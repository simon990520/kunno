"use client";
import React, { useContext, useEffect, useState } from "react";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { HiLightBulb } from "react-icons/hi";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayoutAI } from "@/configs/AiModel";
import Loading from "./_components/Loading";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/Schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { adminConfig } from "@/configs/AdminConfig";
import { ref, set, serverTimestamp } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { toast } from 'react-hot-toast';

const MAX_CHAPTERS = 25;
const MAX_TOPIC_LENGTH = 200;
const MAX_RETRIES = 3;

const CreateCourse = () => {
  const StepperOptions = [
    {
      id: 1,
      name: "Categoría",
      icon: <HiMiniSquares2X2 />,
    },
    {
      id: 2,
      name: "Temas",
      icon: <HiLightBulb />,
    },
    {
      id: 3,
      name: "Opciones",
      icon: <HiClipboardDocumentCheck />,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not signed in
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Validate user input on change
    validateUserInput();
  }, [userCourseInput, isSignedIn]);

  const validateUserInput = () => {
    if (!userCourseInput) return;

    // Validate topic length
    if (userCourseInput.topic && userCourseInput.topic.length > MAX_TOPIC_LENGTH) {
      setError(`El tema no puede exceder ${MAX_TOPIC_LENGTH} caracteres`);
      return false;
    }

    // Validate required fields
    if (activeIndex === 2 && !isValidOptions()) {
      setError('Por favor completa todas las opciones requeridas');
      return false;
    }

    setError(null);
    return true;
  };

  const isValidOptions = () => {
    const { level, duration, displayVideo, noOfChapter } = userCourseInput;
    return level && duration && displayVideo !== undefined && 
           noOfChapter && noOfChapter > 0 && noOfChapter <= MAX_CHAPTERS;
  };

  const checkStatus = () => {
    if (!userCourseInput || Object.keys(userCourseInput).length === 0) {
      return true;
    }

    switch(activeIndex) {
      case 0:
        return !userCourseInput.category;
      case 1:
        return !userCourseInput.topic;
      case 2:
        return !isValidOptions();
      default:
        return false;
    }
  };

  const isAdmin = user?.primaryEmailAddress?.emailAddress && 
                 adminConfig.emails.includes(user.primaryEmailAddress.emailAddress);

  const GenerateCourseLayout = async () => {
    try {
      if (!isSignedIn) {
        toast.error('Debes iniciar sesión para crear un curso');
        router.push('/sign-in');
        return;
      }

      if (!validateUserInput()) {
        toast.error(error);
        return;
      }

      const numberOfChapter = userCourseInput?.noOfChapter;
      if (!isAdmin && numberOfChapter > MAX_CHAPTERS) {
        toast.error(`No puedes seleccionar más de ${MAX_CHAPTERS} capítulos.`);
        return;
      }

      setLoading(true);
      setError(null);

      const prompt = buildPrompt();
      let result;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          result = await GenerateCourseLayoutAI.sendMessage(prompt);
          
          if (!result || !result.response) {
            throw new Error('La respuesta del modelo está vacía');
          }

          const responseText = result.response.text();
          if (!responseText) {
            throw new Error('El contenido de la respuesta está vacío');
          }

          // Limpiar el texto de la respuesta
          const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
          
          try {
            const parsedResult = JSON.parse(cleanedText);
            
            // Validar la estructura del JSON
            if (!parsedResult.course || !parsedResult.course.name || !parsedResult.course.description || !Array.isArray(parsedResult.course.chapters)) {
              console.error('JSON inválido:', parsedResult);
              throw new Error('El formato del curso generado no es válido');
            }

            // Validar que tengamos el número correcto de capítulos
            const requestedChapters = parseInt(userCourseInput.noOfChapter);
            const generatedChapters = parsedResult.course.chapters.length;
            
            console.log('Capítulos solicitados:', requestedChapters);
            console.log('Capítulos generados:', generatedChapters);

            if (generatedChapters !== requestedChapters) {
              throw new Error(`El número de capítulos generados (${generatedChapters}) no coincide con lo solicitado (${requestedChapters})`);
            }

            // Validar la duración total aproximada
            const totalDuration = parsedResult.course.chapters.reduce((sum, chapter) => sum + (parseInt(chapter.duration) || 0), 0);
            const requestedDuration = parseInt(userCourseInput.duration) || 60; // duración en minutos

            console.log('Duración total generada:', totalDuration, 'minutos');
            console.log('Duración solicitada:', requestedDuration, 'minutos');

            // Permitir un margen de error del 20% en la duración
            const durationMargin = requestedDuration * 0.2;
            if (Math.abs(totalDuration - requestedDuration) > durationMargin) {
              console.warn(`Advertencia: La duración total (${totalDuration} min) difiere significativamente de lo solicitado (${requestedDuration} min)`);
            }

            // Guardar el curso en la base de datos
            const courseId = uuidv4();
            const courseRef = ref(realtimeDb, `courses/${courseId}`);

            const sanitizedData = {
              courseId: courseId,
              name: userCourseInput?.topic?.slice(0, MAX_TOPIC_LENGTH) || "Sin nombre",
              level: userCourseInput?.level || "Principiante",
              category: userCourseInput?.category || "General",
              includeVideo: userCourseInput?.displayVideo || false,
              courseOutput: {
                ...parsedResult,
                course: {
                  ...parsedResult.course,
                  totalDuration: totalDuration,
                  requestedDuration: requestedDuration
                }
              },
              createdBy: user?.primaryEmailAddress?.emailAddress || "Usuario desconocido",
              userName: user?.fullName || "Anónimo",
              userProfileImage: user?.imageUrl || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };

            await set(courseRef, sanitizedData);
            toast.success('¡Curso creado exitosamente!');
            
            // Redirigir a la página de finalización del curso
            router.push(`/create-course/${courseId}`);
            return;
          } catch (parseError) {
            console.error('Error al parsear JSON:', parseError, '\nTexto recibido:', cleanedText);
            throw new Error('Error al procesar la respuesta del modelo');
          }
        } catch (err) {
          console.error(`Intento ${retries + 1} fallido:`, err);
          retries++;
          
          if (retries === MAX_RETRIES) {
            throw new Error('No se pudo generar el curso después de varios intentos. Por favor, inténtalo de nuevo.');
          }
          
          // Esperar antes del siguiente intento (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
      }
    } catch (error) {
      console.error('Error al generar curso:', error);
      toast.error(error.message || 'Error al generar el curso');
      setError(error.message || 'Error al generar el curso');
    } finally {
      setLoading(false);
    }
  };

  const buildPrompt = () => {
    const categoryText = userCourseInput?.category || 'General';
    const topicText = userCourseInput?.topic || '';
    const levelText = userCourseInput?.level || 'Principiante';
    const durationText = userCourseInput?.duration || '1 hora';
    const chaptersCount = userCourseInput?.noOfChapter || 5;

    return `
      Información del curso:
      - Categoría: ${categoryText}
      - Tema: ${topicText}
      - Nivel: ${levelText}
      - Duración total: ${durationText}
      - Número de capítulos: ${chaptersCount}

      Instrucciones adicionales:
      - La duración de cada capítulo debe sumar aproximadamente ${durationText}
      - El contenido debe ser apropiado para nivel ${levelText}
      - Enfócate en la categoría ${categoryText}
      - Genera exactamente ${chaptersCount} capítulos
    `;
  };

  return (
    <div className="p-5 px-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* steper */}
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-4xl text-primary font-medium">Crear curso</h2>
        <div className="flex  mt-10">
          {StepperOptions.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                <div
                  className={`bg-gray-300 p-3 rounded-full text-white ${
                    activeIndex >= index && "bg-orange-500"
                  }`}
                >
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.name}</h2>
              </div>
              {index != StepperOptions.length - 1 && (
                <div
                  className={`h-1 w-[50px] md:w-[100px] rounded-full bg-gray-300 lg:w-[170px] ${
                    activeIndex - 1 >= index && "bg-purple-500"
                  } `}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* components */}
        {activeIndex == 0 ? (
          <SelectCategory />
        ) : activeIndex == 1 ? (
          <TopicDescription />
        ) : (
          <SelectOption />
        )}

        {/* next previous button  */}
        <div className="flex justify-between mt-10">
          <Button
            disabled={activeIndex == 0}
            onClick={() => setActiveIndex(activeIndex - 1)}
            variant="outline"
          >
            Previous
          </Button>
          {activeIndex < 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              Next
            </Button>
          )}
          {activeIndex == 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => GenerateCourseLayout()}
            >
              Generar curso
            </Button>
          )}
        </div>
      </div>
      <Loading loading={loading} />
    </div>
  );
};

export default CreateCourse;
