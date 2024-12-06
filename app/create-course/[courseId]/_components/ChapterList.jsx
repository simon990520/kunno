"use client";

import React from "react";
import { HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import EditChapter from "./EditChapter";

const ChapterList = ({ course, refreshData, edit = true }) => {
  if (!course?.courseOutput?.course?.chapters) {
    return (
      <div className="mt-3">
        <h2 className="font-medium text-xl">Capítulos</h2>
        <div className="mt-2 p-5 border rounded-lg text-center text-gray-500">
          No hay capítulos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h2 className="font-medium text-xl">Capítulos</h2>
      <div className="mt-2">
        {course.courseOutput.course.chapters.map((chapter, index) => (
          <div key={index} className="p-5 border rounded-lg mt-2 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex gap-5 items-center">
              <h2 className="bg-orange-500 text-white flex-none h-10 w-10 rounded-full text-center p-2">
                {index + 1}
              </h2>
              <div>
                <h2 className="font-medium text-lg flex items-center gap-2">
                  {chapter?.name}
                  {edit && (
                    <EditChapter
                      index={index}
                      course={course}
                      refreshData={() => refreshData(true)}
                    />
                  )}
                </h2>
                <p className="text-sm text-gray-500">{chapter?.about}</p>
                <p className="flex gap-2 text-orange-500 items-center mt-1">
                  <HiOutlineClock className="text-lg" /> {chapter?.duration} minutos
                </p>
              </div>
            </div>
            <HiOutlineCheckCircle className="text-4xl flex-none text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
