"use client";

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { realtimeDb } from "@/configs/firebaseConfig";
import { ref, update } from "firebase/database";
import toast from "react-hot-toast";

const EditChapter = ({course, index, refreshData}) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const chapters = course?.courseOutput?.course?.chapters;

    useEffect(() => {
        if (chapters && chapters[index]) {
            setName(chapters[index].name || "");
            setAbout(chapters[index].about || "");
        }
    }, [chapters, index]);

    const onUpdateHandler = async () => {
        if (!course?.courseId || !chapters?.[index]) {
            toast.error("Datos del curso o capítulo inválidos");
            return;
        }

        try {
            const chapterRef = ref(realtimeDb, `courses/${course.courseId}/courseOutput/course/chapters/${index}`);
            await update(chapterRef, {
                name: name,
                about: about,
            });

            toast.success("Capítulo actualizado exitosamente");
            refreshData(true);
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar el capítulo:", error);
            toast.error("Error al actualizar el capítulo");
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HiPencilSquare className="h-5 w-5" />
                    <span className="sr-only">Editar capítulo</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar capítulo del curso</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del capítulo según sea necesario.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="chapter-name" className="text-sm font-medium">
                            Título del capítulo
                        </label>
                        <Input
                            id="chapter-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese el título del capítulo"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="chapter-description" className="text-sm font-medium">
                            Descripción del capítulo
                        </label>
                        <Textarea
                            id="chapter-description"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Ingrese la descripción del capítulo"
                            className="h-40"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={onUpdateHandler}>
                        Actualizar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditChapter;