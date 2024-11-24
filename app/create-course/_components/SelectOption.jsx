import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserInputContext } from "@/app/_context/UserInputContext";

const SelectOption = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const handleInputChange = (fieldname, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldname]: value,
    }));
  };
  return (
    <div className="px-10 md:px-20 lg:px-44">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <label htmlFor="" className="text-xm">
            {" "}
            🎓  Nivel de dificultad
          </label>
          <Select
            onValueChange={(value) =>
              handleInputChange("level", value)
            }
            defaultValue={userCourseInput?.level}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="Beginner">Principiante</SelectItem>
            <SelectItem value="Intermediate">Intermedio</SelectItem>
            <SelectItem value="Advance">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="" className="text-xm">
            🕛 Duración del curso
          </label>
          <Select
            onValueChange={(value) => handleInputChange("duration", value)}
            defaultValue={userCourseInput?.duration}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Hour">1 Hora</SelectItem>
              <SelectItem value="2 Hours">2 Horas</SelectItem>
              <SelectItem value="More than 3 Hours">Más de 3 Horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="" className="text-xm">
            ▶️  Agregar video
          </label>
          <Select
            onValueChange={(value) => handleInputChange("displayVideo", value)}
            defaultValue={userCourseInput?.displayVideo}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Si</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="">Número de capítulos</label>
          <Input
            onChange={(e) => handleInputChange("noOfChapter", e.target.value)}
            defaultValue={userCourseInput?.noOfChapter}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectOption;
