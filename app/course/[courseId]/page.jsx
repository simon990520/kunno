"use client";

import Header from "@/app/_components/Header";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";

import { db } from "@/configs/db";
import { CourseList } from "@/configs/Schema";
import { eq } from "drizzle-orm";
import { Corben } from "next/font/google";
import React, { useEffect, useState } from "react";
import { HiOutlineShare } from "react-icons/hi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { ref, get, set, update, push } from "firebase/database"; // Importa las funciones necesarias
import { realtimeDb } from "@/configs/firebaseConfig";

const Course = ({ params }) => {
  const [course, setCourse] = useState([]);

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
  
      // Obtener datos del curso
      const snapshot = await get(courseRef);
  
      if (snapshot.exists()) {
        const courseData = snapshot.val();
        console.log(courseData);
        setCourse(courseData);
      } else {
        console.error("No se encontró el curso en la base de datos.");
      }
    } catch (error) {
      console.error("Error al obtener el curso desde Firebase:", error);
    }
  };
  

  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-20 lg:px-44">
        <CourseBasicInfo course={course} edit={false} />
        <h3 className="mt-3  mb-2">Course Url:</h3>
        <div>
          <h2 className="flex items-center justify-between text-center text-gray-400 border p-2 rounded-md">
            {process.env.NEXT_PUBLIC_HOST_NAME}course/{course?.courseId}
            <HiOutlineClipboardDocumentCheck
              onClick={async () =>
                await navigator.clipboard.writeText(
                  process.env.NEXT_PUBLIC_HOST_NAME +
                    "course/" +
                    course?.courseId
                )
              }
              className="text-2xl cursor-pointer text-primary"
            />
            {/* Share URL Icon */}
            {navigator.share && (
              <HiOutlineShare
                onClick={() => {
                  navigator
                    .share({
                      title: "¡Mira este curso!",
                      url:
                        process.env.NEXT_PUBLIC_HOST_NAME +
                        "course/" +
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
        </div>

        <CourseDetail course={course} />
        <ChapterList course={course} edit={false} />
      </div>
    </div>
  );
};

export default Course;
