"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/Schema";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";
import { index } from "drizzle-orm/mysql-core";

const Explore = () => {
  const [courseList, setCourseList] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    GetAllCourse();
    const timer = setTimeout(() => {
      setShowSkeleton(false); // Hide skeleton after 10 seconds
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [pageIndex]);

  const GetAllCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .limit(7)
      .offset(pageIndex * 6);

    // console.log(result);
    // setCourseList(result);
    setCourseList(result.slice(0, 6));
    setShowSkeleton(false);
  };
  return (
    <div>
      <h2 className="font-bold text-3xl">Explorar mas cursos</h2>
      <p>Explora más proyectos creados con IA por otros usuarios.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-col-4 gap-5 mt-3">
        {/* {
          courseList?.length>0?courseList.map((course, index)=>(
            <CourseCard course={course} key={index} displayUser={true}/>
          ))
          :[1,2,3,4,5].map((item,index)=>(
            <div key={index} className='w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[250px]'>
               </div>
          ))
        } */}

        {showSkeleton ? (
          // Show skeletons while loading (for the first 10 seconds)
          [1, 2, 3, 4, 5,6].map((item, index) => (
            <div
              key={index}
              className="w-full mt-5 bg-slate-200 animate-pulse rounded-lg h-[250px]"
            />
          ))
        ) : courseList?.length > 0 ? (
          // Display courses if available
          courseList.map((course, index) => (
            <CourseCard course={course} key={index} displayUser={true} />
          ))
        ) : (
          // Show "No courses available" after skeleton and if no courses found
          <div className="flex items-center justify-center">
            <h2>No hay cursos disponibles. </h2>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4 items-center">
        {pageIndex !== 0 && (
          <Button onClick={() => setPageIndex(pageIndex - 1)}>
            Previous Page
          </Button>
        )}
        {/* Only show the "Next" button if there are courses to navigate through */}
        {courseList?.length === 6 && (
          <Button onClick={() => setPageIndex(pageIndex + 1)}>Next Page</Button>
        )}
      </div>
    </div>
  );
};

export default Explore;
