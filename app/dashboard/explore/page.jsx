"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";
import { realtimeDb } from "@/configs/firebaseConfig"; // Configuración de Firebase
import { ref, get } from "firebase/database"; // Métodos de Firebase

const Explore = () => {
  const [courseList, setCourseList] = useState([]); // Lista de cursos
  const [showSkeleton, setShowSkeleton] = useState(true); // Mostrar esqueleto de carga
  const [pageIndex, setPageIndex] = useState(0); // Índice de la página
  const [totalCourses, setTotalCourses] = useState(0); // Total de cursos en Firebase

  useEffect(() => {
    GetAllCourse();
    const timer = setTimeout(() => {
      setShowSkeleton(false); // Ocultar esqueleto después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer);
  }, [pageIndex]);

  // Función para obtener los cursos desde Firebase
  const GetAllCourse = async () => {
    try {
      // Referencia a la ruta "courses" en Firebase
      const coursesRef = ref(realtimeDb, "courses/");
      
      // Obtener los datos de Firebase
      const snapshot = await get(coursesRef);

      if (snapshot.exists()) {
        const coursesData = snapshot.val(); // Datos de Firebase
        const coursesArray = Object.values(coursesData); // Convertir en array
        setTotalCourses(coursesArray.length); // Total de cursos disponibles

        // Implementar la paginación (6 cursos por página)
        const paginatedCourses = coursesArray.slice(pageIndex * 6, (pageIndex + 1) * 6);
        setCourseList(paginatedCourses); // Establecer los cursos a mostrar
      } else {
        setCourseList([]); // No hay cursos disponibles
        setTotalCourses(0); // No hay cursos
      }

      setShowSkeleton(false); // Terminar el esqueleto de carga
    } catch (error) {
      console.error("Error al obtener los cursos de Firebase:", error);
      setShowSkeleton(false); // Ocultar el esqueleto incluso en caso de error
    }
  };
  return (
    <div>
      <h2 className="font-bold text-3xl">Explorar más cursos</h2>
      <p>Explora más proyectos creados con IA por otros usuarios.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
        {showSkeleton ? (
          // Mostrar skeletons mientras se cargan los datos
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[250px]"
            />
          ))
        ) : courseList?.length > 0 ? (
          // Mostrar los cursos si hay datos
          courseList.map((course, index) => (
            <CourseCard course={course} key={index} displayUser={true} />
          ))
        ) : (
          // Mostrar mensaje si no hay cursos
          <div className="flex items-center justify-center">
            <h2>No hay cursos disponibles.</h2>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4 items-center">
        {/* Botón "Página anterior" */}
        {pageIndex > 0 && (
          <Button onClick={() => setPageIndex(pageIndex - 1)}>
            Página anterior
          </Button>
        )}
        {/* Botón "Página siguiente" */}
        {courseList?.length === 6 && totalCourses > (pageIndex + 1) * 6 && (
          <Button onClick={() => setPageIndex(pageIndex + 1)}>Página siguiente</Button>
        )}
      </div>
    </div>
  );
};

export default Explore;
