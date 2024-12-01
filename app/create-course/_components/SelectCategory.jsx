import { UserInputContext } from "@/app/_context/UserInputContext";
import CategoryList from "@/app/_shared/CategoryList";
import Image from "next/image";
import React, { useContext } from "react";

const SelectCategory = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({
      ...prev,
      category: category,
    }));
  };

  return (
    <div className="px-5 md:px-20 py-5">
      <h2 className="my-5 text-center text-xl sm:text-2xl md:text-3xl font-semibold">Selecciona la categoría del curso</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-10">
        {CategoryList.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col p-5 border items-center rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer ${
              userCourseInput?.category === item.name && "border-primary bg-blue-50"
            }`}
            onClick={() => handleCategoryChange(item.name)}
          >
            <Image
              rel={"category"}
              src="/logo.png"
              width={50}
              height={50}
              alt={`${item.name}`}
              className="mb-3"
            />
            <h2 className="text-center text-sm sm:text-base">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCategory;
