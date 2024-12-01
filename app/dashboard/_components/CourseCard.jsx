import Image from "next/image";
import React from "react";
import { HiMiniEllipsisVertical, HiOutlineBookOpen } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import Link from "next/link";
import { realtimeDb } from "@/configs/firebaseConfig";
import { getDatabase, ref, remove } from "firebase/database"; // Firebase imports
import { HiOutlineShare } from "react-icons/hi";

const CourseCard = ({ course, refreshData, displayUser = false }) => {
  const handleOnDelete = async () => {
    try {
      // Verifica que el ID del curso esté definido
      if (!course?.courseId) {
        throw new Error("El ID del curso no está definido.");
      }

      console.log("Intentando eliminar el curso:", course);

      // Configura la referencia en Firebase
      const courseRef = ref(realtimeDb, `courses/${course?.courseId}`); // Ruta a eliminar

      await remove(courseRef); // Elimina el curso de Firebase

      // Actualiza la lista de cursos
      refreshData();
      console.log(`Curso con ID ${course?.courseId} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
    }
  };

  // Imagen por defecto si no hay imagen del curso
  const defaultImage = "/course-cover.svg"; // Aquí colocas la ruta de la imagen por defecto
  
  return (
    <div className="shadow-sm rounded-md border cursor-pointer hover:border-primary">
      {/* Link al detalle del curso */}
      <Link href={`/course/${course?.courseId}`}>
        <Image
          src={course?.courseBanner || defaultImage}  
          width={300}
          height={200}
          className="w-full h-[200px] rounded-md object-cover"
          alt={`Banner del curso ${course?.courseOutput?.course?.name}`}
        />
      </Link>
      <div className="p-2">
        {/* Título del curso y opciones */}
        <h2 className="font-medium text-lg flex items-center justify-between">
          {course?.courseOutput?.course?.name}
          {!displayUser && (
            <DropdownOption handleOnDelete={handleOnDelete}>
              <HiMiniEllipsisVertical />
            </DropdownOption>
          )}
          {/* Botón para compartir URL */}
          {navigator.share && (
            <HiOutlineShare
              onClick={() => {
                navigator
                  .share({
                    title: "Check out this course!",
                    url: `${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`,
                  })
                  .then(() => console.log("Successfully shared"))
                  .catch((error) => console.log("Error sharing", error));
              }}
              className="text-2xl cursor-pointer text-primary"
              title="Share URL"
            />
          )}
        </h2>

        {/* Categoría del curso */}
        <p className="text-sm text-gray-400 my-1">{course?.category}</p>

        {/* Información adicional */}
        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary text-sm rounded-sm">
            <HiOutlineBookOpen /> {course?.courseOutput?.course?.noOfChapters} - Capítulos
          </h2>
          <h2 className="text-sm bg-purple-50 text-primary p-1 rounded-sm">
            {course?.level}
          </h2>
        </div>

        {/* Mostrar información del usuario si está habilitado */}
        {displayUser && (
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={course?.userProfileImage || defaultImage}  
              width={30}
              height={30}
              className="rounded-full"
              alt={`Imagen de perfil de ${course?.userName}`}
            />
            <h2>{course?.userName}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
