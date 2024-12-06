"use client";

import React from "react";
import { HiOutlineChartBar, HiOutlineClock, HiOutlineBookOpen, HiOutlinePlay } from "react-icons/hi";

const CourseDetail = ({ course }) => {
  // Calcular la duración total sumando la duración de cada capítulo
  const totalDuration = course?.courseOutput?.course?.chapters?.reduce(
    (sum, chapter) => sum + (parseInt(chapter.duration) || 0),
    0
  ) || 0;

  // Obtener el número de capítulos
  const chaptersCount = course?.courseOutput?.course?.chapters?.length || 0;

  return (
    <div className="p-6 border rounded-xl shadow-md mt-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="flex gap-2">
          <HiOutlineChartBar className="text-4xl text-orange-500" />
          <div>
            <h2 className="text-xs text-gray-500">Nivel de habilidad</h2>
            <h2 className="font-medium text-lg">{course?.level}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <HiOutlineClock className="text-4xl text-orange-500" />
          <div>
            <h2 className="text-xs text-gray-500">Duración</h2>
            <h2 className="font-medium text-lg">{totalDuration} minutos</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <HiOutlineBookOpen className="text-4xl text-orange-500" />
          <div>
            <h2 className="text-xs text-gray-500">Número de capítulos</h2>
            <h2 className="font-medium text-lg">{chaptersCount} capítulos</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <HiOutlinePlay className="text-4xl text-orange-500" />
          <div>
            <h2 className="text-xs text-gray-500">Incluir video</h2>
            <h2 className="font-medium text-lg">{course?.includeVideo ? "Sí" : "No"}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
