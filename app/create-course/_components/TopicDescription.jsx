import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";

const TopicDescription = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const handleInputChange = (fieldname, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldname]: value,
    }));
  };

  return (
    <div className="mx-20 lg:mx-44">
      {/* Input  Topic
       */}
      <div className="mt-5">
        <label>
          💡 Escribe un tema para el que quieras generar un curso (por ejemplo, Curso de Python, Yoga, etc.)
        </label>
        <Input
          className="h-14 text-xl"
          placeholder={"Titulo"}
          defaultValue = {userCourseInput?.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
        />
      </div>
      {/* TextArea  */}
      <div className="mt-5 ">
        <label htmlFor="">
          {" "}
          🔥Cuéntanos más sobre tu curso, ¿qué te gustaría incluir en él? (Opcional)
        </label>
        <Textarea
          placeholder="Cuéntanos más"
          className="h-24 text-xl"
          defaultValue = {userCourseInput?.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
    </div>
  );
};

export default TopicDescription;
