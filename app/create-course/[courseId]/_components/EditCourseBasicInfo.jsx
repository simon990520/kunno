import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/Schema";
import { eq } from "drizzle-orm";
import { realtimeDb } from "@/configs/firebaseConfig";
import { ref, update } from "firebase/database";

const EditCourseBasicInfo = ({course, refreshData}) => {
  const [name, setName] =  useState();
  const [description, setDescription] =  useState();

  useEffect(()=>{
         setName(course?.courseOutput?.course?.name);
         setDescription(course?.courseOutput?.course?.description);
  },[course])

  const onUpdateHandler = async () => {
    if (!course || !course.courseId) {
      console.error("Datos del curso inválidos. No se puede actualizar.");
      return;
    }
  
    try {
      // Referencia al curso en Firebase
      const courseRef = ref(realtimeDb, `courses/${course.courseId}/courseOutput/course`);
  
      // Actualiza los datos en Firebase
      await update(courseRef, {
        name: name,
        description: description,
      });
  
      console.log("Curso actualizado exitosamente en Firebase");
      refreshData(true); // Refresca los datos si es necesario
    } catch (error) {
      console.error("Error al actualizar el curso en Firebase:", error);
    }
  };
  
  
  return (
      <Dialog>
        <DialogTrigger>
            <HiPencilSquare />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar título y descripción del curso</DialogTitle>
            <DialogDescription>
             <div className="mt-3">
              <label htmlFor="">Título del curso</label>
              <Input defaultValue={course?.courseOutput?.course?.name} onChange={(e) =>setName(e?.target.value)} />
             </div>
             <div  className='mt-3'>
              <label  htmlFor="">Descripción del curso</label>
              <Textarea className="h-40"  defaultValue={course?.courseOutput?.course?.description} onChange ={(e) =>setDescription(e?.target.value)}/>
             </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button onClick={onUpdateHandler}>
                Actualizar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default EditCourseBasicInfo;
