"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/Schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import { ref, get, set, update, push } from "firebase/database"; // Importa las funciones necesarias
import { realtimeDb } from "@/configs/firebaseConfig";

import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

const CourseStart = ({ params }) => {
  const [course, setCourse] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState();
  const[ chapterContent, setChapterContent] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    params && GetCourse();
  }, [params]);
  const GetCourse = async () => {
    if (!params?.courseId) {
      console.error("Falta el ID del curso.");
      return;
    }
  
    try {
      // Referencia al curso en Firebase
      const courseRef = ref(realtimeDb, `courses/${params.courseId}`);
      const snapshot = await get(courseRef);
  
      if (snapshot.exists()) {
        const courseData = snapshot.val();
        setCourse(courseData);
  
        // Validar que existan capítulos
        const chapters = courseData?.courseOutput?.course?.chapters;
        if (chapters && chapters.length > 0) {
          const firstChapterIndex = 0;
          const firstChapter = chapters[firstChapterIndex];
  
          // Establecer capítulo seleccionado y cargar contenido
          setSelectedChapter({ ...firstChapter, index: firstChapterIndex });
          await GetSelectedChapterContent(params.courseId, firstChapterIndex);
        } else {
          console.error("No hay capítulos disponibles para este curso.");
        }
      } else {
        console.error("No se encontró el curso en la base de datos.");
      }
    } catch (error) {
      console.error("Error al obtener el curso desde Firebase:", error);
    }
  };
  
  const GetSelectedChapterContent = async (courseId, chapterIndex) => {
    if (!courseId || chapterIndex === undefined) {
      console.error("Faltan datos para obtener el contenido del capítulo.");
      return;
    }
  
    try {
      // Referencia al contenido del capítulo en Firebase
      const chapterRef = ref(realtimeDb, `courses/${courseId}/chapters/${chapterIndex}`);
      const snapshot = await get(chapterRef);
  
      if (snapshot.exists()) {
        const content = snapshot.val();
        setChapterContent(content); // Actualiza el contenido
      } else {
        console.error("No se encontró el contenido del capítulo en la base de datos.");
      }
    } catch (error) {
      console.error("Error al obtener el contenido del capítulo desde Firebase:", error);
    }
  };
  
  return (
    <div>
      {/* Botón de alternar menú lateral en dispositivos móviles */}
      <div className="md:hidden p-4">
        <button
          className="bg-primary text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <Cross1Icon className="w-6 h-6" /> : <HamburgerMenuIcon className="w-6 h-6" />}
        </button>
      </div>
  
      {/* Menú lateral de capítulos */}
      <div
        className={`fixed md:w-64 w-64 h-screen bg-white border-r shadow-sm z-20 transform transition-transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <h2 className="font-medium text-lg bg-primary p-3 text-white">
          {course?.courseOutput?.course?.name || "Cargando curso..."}
        </h2>
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          {course?.courseOutput?.course?.chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-purple-50 ${
                selectedChapter?.index === index ? "bg-purple-100" : ""
              }`}
              onClick={async () => {
                setSelectedChapter({ ...chapter, index }); // Cambia el capítulo seleccionado
                await GetSelectedChapterContent(params.courseId, index); // Carga contenido del capítulo
                setIsSidebarOpen(false); // Cierra el menú
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>
  
      {/* Contenido del capítulo seleccionado */}
      <div className="md:ml-64">
        <ChapterContent
          chapter={selectedChapter}
          content={chapterContent}
          key={selectedChapter?.index} // Clave única para forzar renderizado
        />
      </div>
  
      {/* Overlay para cerrar el menú en dispositivos móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );  
};

export default CourseStart;
