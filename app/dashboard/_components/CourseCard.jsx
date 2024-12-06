"use client";

import Image from "next/image";
import React from "react";
import { HiMiniEllipsisVertical, HiOutlineBookOpen } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import Link from "next/link";
import { realtimeDb } from "@/configs/firebaseConfig";
import { ref, remove } from "firebase/database";
import { HiOutlineShare } from "react-icons/hi";

const CourseCard = ({ course, refreshData, displayUser = false }) => {
  const handleOnDelete = async () => {
    try {
      if (!course?.courseId) {
        throw new Error("El ID del curso no está definido.");
      }

      const courseRef = ref(realtimeDb, `courses/${course?.courseId}`);
      await remove(courseRef);
      refreshData();
      console.log(`Curso con ID ${course?.courseId} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
    }
  };

  // Calcular el número de capítulos
  const getChapterCount = () => {
    if (course?.courseOutput?.course?.chapters) {
      return course.courseOutput.course.chapters.length;
    }
    if (course?.chapters) {
      return Object.keys(course.chapters).length;
    }
    return 0;
  };

  const defaultImage = "/course-cover.svg";
  
  return (
    <div className="shadow-sm rounded-md border cursor-pointer hover:border-primary">
      <Link href={`/course/${course?.courseId}`}>
        <Image
          src={course?.courseBanner || defaultImage}  
          width={300}
          height={200}
          className="w-full h-[200px] rounded-md object-cover"
          alt={`Banner del curso ${course?.courseOutput?.course?.name || 'Sin nombre'}`}
        />
      </Link>
      <div className="p-2">
        <h2 className="font-medium text-lg flex items-center justify-between">
          {course?.courseOutput?.course?.name || course?.name}
          {!displayUser && (
            <DropdownOption handleOnDelete={handleOnDelete}>
              <HiMiniEllipsisVertical />
            </DropdownOption>
          )}
          {navigator.share && (
            <HiOutlineShare
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator
                  .share({
                    title: course?.courseOutput?.course?.name || course?.name,
                    url: `${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`,
                  })
                  .then(() => console.log("Successfully shared"))
                  .catch((error) => console.log("Error sharing", error));
              }}
              className="text-2xl cursor-pointer text-orange-500"
              title="Share URL"
            />
          )}
        </h2>

        <p className="text-sm text-gray-400 my-1">{course?.category}</p>

        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-orange-50 text-orange-500 text-sm rounded-sm">
            <HiOutlineBookOpen /> {getChapterCount()} Capítulos
          </h2>
          <h2 className="text-sm bg-orange-50 text-orange-500 p-1 rounded-sm">
            {course?.level}
          </h2>
        </div>

        {displayUser && (
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={course?.userProfileImage || defaultImage}  
              width={30}
              height={30}
              className="rounded-full"
              alt={`Imagen de perfil de ${course?.userName || 'Usuario'}`}
            />
            <h2>{course?.userName}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
