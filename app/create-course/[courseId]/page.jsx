"use client";
import { ref, get, set, update } from "firebase/database";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import service from "@/configs/service";
import Loading from "../_components/Loading";
import { useRouter } from "next/navigation";
import { realtimeDb } from "@/configs/firebaseConfig";

const courseLayout = ({ params }) => {
  const { user, isLoaded } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCourseValid, setIsCourseValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Esperar a que Clerk cargue
    
    if (params?.courseId && user?.primaryEmailAddress?.emailAddress) {
      getCourseData();
    } else if (isLoaded && !user) {
      // Si Clerk terminó de cargar y no hay usuario, redirigir al login
      router.push('/sign-in');
    }
  }, [params, user, isLoaded]);

  // Función para obtener datos del curso desde Firebase
  const getCourseData = async () => {
    if (!realtimeDb) {
      console.error("Firebase Realtime Database no está inicializado correctamente.");
      return;
    }

    try {
      const courseRef = ref(realtimeDb, `courses/${params.courseId}`);
      const snapshot = await get(courseRef);

      if (snapshot.exists()) {
        const courseData = snapshot.val();
        // Verificar que el curso pertenece al usuario actual
        if (courseData.createdBy === user?.primaryEmailAddress?.emailAddress) {
          setCourse(courseData);
          setIsCourseValid(true);
        } else {
          console.error("No tienes permiso para acceder a este curso.");
          setIsCourseValid(false);
          toast.error("No tienes permiso para acceder a este curso");
          router.push('/dashboard');
        }
      } else {
        console.error("No se encontró el curso en la base de datos.");
        setIsCourseValid(false);
        toast.error("No se encontró el curso");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error obteniendo datos del curso:", error);
      setIsCourseValid(false);
      toast.error("Error al cargar el curso");
    }
  };

  // Función para generar contenido de capítulos y guardarlo en Firebase
  const generateChapterContent = async () => {
    if (!course?.courseId || !course?.courseOutput?.course?.chapters) {
      toast.error("Faltan datos del curso o capítulos. No se puede generar contenido.");
      return;
    }

    setLoading(true);
    const chapters = course?.courseOutput?.course?.chapters;

    try {
      for (const [index, chapter] of chapters.entries()) {
        const prompt = `
          Explica el concepto en detalle sobre el tema: ${course?.name}, 
          Capítulo: ${chapter?.name}, 
          Genera un objeto JSON con la siguiente estructura exacta, sin incluir comillas triples ni la palabra json:
          {
            "sections": [
              {
                "title": "Título de la sección",
                "description": "Descripción detallada",
                "code": "<precode>código de ejemplo</precode>" (opcional)
              }
            ]
          }
        `;

        try {
          let videoId = "";
          // Genera el video URL
          const videoResponse = await service.getVideos(`${course?.name}:${chapter?.name}`);
          if (videoResponse?.length > 0) {
            videoId = videoResponse[0]?.id?.videoId || "";
          }

          // Genera el contenido del capítulo
          const result = await GenerateChapterContent_AI.sendMessage(prompt);
          const rawText = await result.response.text();
          
          // Limpia el texto de la respuesta
          let cleanJson = rawText;
          // Elimina los backticks y la palabra json si están presentes
          if (rawText.includes('```')) {
            cleanJson = rawText.replace(/```json\n|\n```|```/g, '').trim();
          }

          try {
            const content = JSON.parse(cleanJson);

            // Guarda el contenido del capítulo en Firebase
            const chapterRef = ref(realtimeDb, `courses/${course.courseId}/chapters/${index}`);
            await set(chapterRef, {
              chapterId: index,
              name: chapter?.name,
              content: content,
              videoId: videoId,
            });
          } catch (jsonError) {
            console.error("Error parseando JSON:", jsonError);
            console.log("JSON inválido:", cleanJson);
            toast.error(`Error en el formato JSON del capítulo ${index + 1}: ${chapter?.name}`);
          }
        } catch (error) {
          console.error("Error generando contenido del capítulo:", error);
          toast.error(`Error en capítulo ${index + 1}: ${chapter?.name}`);
        }
      }

      // Actualiza el estado del curso como "publicado"
      const courseRef = ref(realtimeDb, `courses/${course.courseId}`);
      await update(courseRef, { publish: true });
      
      toast.success("¡Contenido generado exitosamente!");
      router.replace(`/create-course/${course?.courseId}/finish`);
    } catch (error) {
      console.error("Error en el proceso de generación:", error);
      toast.error("Error al generar el contenido del curso");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return <Loading loading={true} />;
  }

  return (
    <div className="h-screen w-full mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Diseño del curso</h2>

      {/* Información básica del curso */}
      <CourseBasicInfo course={course} refreshData={getCourseData} />

      {/* Detalles del curso */}
      <CourseDetail course={course} />

      {/* Lista de capítulos */}
      <ChapterList course={course} refreshData={getCourseData} />

      <Button 
        disabled={!isCourseValid} 
        onClick={generateChapterContent} 
        className="w-full my-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
      >
        {loading ? "Generando contenido..." : "Generar contenido del curso"}
      </Button>
      <Toaster />
    </div>
  );
};

export default courseLayout;