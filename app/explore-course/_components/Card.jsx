import Image from "next/image";
import React from "react";
import { HiOutlineBookOpen } from "react-icons/hi2";

import { db } from "@/configs/db";
import { CourseList } from "@/configs/Schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { HiOutlineShare } from "react-icons/hi";
import { realtimeDb } from "@/configs/firebaseConfig";
import { getDatabase, ref, remove } from "firebase/database"; // Firebase imports

const Card = ({ course, refreshData }) => {
  const handleOnDelete = async () => {
    try {
      const courseRef = ref(realtimeDb, `courses/${course?.courseId}`); // Referencia al curso en Firebase

      await remove(courseRef); // Elimina el curso

      // Refresca los datos después de la eliminación
      refreshData();
      console.log(`Curso con ID ${course?.courseId} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
    }
  };
  // Imagen por defecto si no hay imagen del curso
  const defaultImage = "/course-cover.svg"; // Aquí colocas la ruta de la imagen por defecto
  return (
    <div className="shadow-sm rounded-md border  cursor-pointer hover:border-primary">
      <Link href={"/course/" + course?.courseId}>
        <Image
          src={course?.courseBanner || defaultImage}  
          width={300}
          height={200}
          className="w-full h-[200px] rounded-md object-cover"
        />
      </Link>
      <div className="p-2">
        <h2 className="font-medium text-lg flex items-center justify-between">
          {course?.courseOutput?.course?.name}{" "}
        
          {/* Share URL Icon */}
          {navigator.share && (
            <HiOutlineShare
              onClick={() => {
                navigator
                  .share({
                    title: "Check out this course!",
                    url:
                      process.env.NEXT_PUBLIC_HOST_NAME +
                      "/course/" +
                      course?.courseId,
                  })
                  .then(() => console.log("Successfully shared"))
                  .catch((error) => console.log("Error sharing", error));
              }}
              className="text-2xl cursor-pointer text-primary"
              title="Share URL"
            />
          )}
        </h2>

        <p className="text-sm text-gray-400 my-1">{course?.category}</p>
        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary text-sm rounded-sm">
            <HiOutlineBookOpen /> {course?.courseOutput?.course?.noOfChapters}
            -Capitulos
          </h2>
          <h2 className="text-sm bg-purple-50 text-primary p-1 rounded-sm ">
            {course?.level}
          </h2>
        </div>
        
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={course?.userProfileImage}
              width={30}
              height={30}
              className="rounded-full"
            />
            <h2>{course?.userName}</h2>
          </div>
      
      </div>
    </div>
  );
};

export default Card;
