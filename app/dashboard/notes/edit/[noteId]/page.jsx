"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditNotePage({ params }) {
  const { noteId } = params;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subjectId: "",
  });

  useEffect(() => {
    if (user) {
      loadNote();
      loadSubjects();
    }
  }, [user]);

  const loadNote = async () => {
    try {
      const noteRef = ref(realtimeDb, `notes/${noteId}`);
      const snapshot = await get(noteRef);
      if (snapshot.exists()) {
        const noteData = snapshot.val();
        setNote(noteData);
        setFormData({
          title: noteData.title || "",
          content: noteData.content || "",
          subjectId: noteData.subjectId || "",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar la nota:", error);
      toast.error("Error al cargar la nota");
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const subjectsRef = ref(realtimeDb, "subjects");
      const snapshot = await get(subjectsRef);
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const subjectsList = Object.entries(subjectsData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setSubjects(subjectsList);
      }
    } catch (error) {
      console.error("Error al cargar materias:", error);
      toast.error("Error al cargar las materias");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      const noteRef = ref(realtimeDb, `notes/${noteId}`);
      const updatedNote = {
        ...note,
        ...formData,
        subjectName: selectedSubject?.name || note.subjectName,
        updatedAt: new Date().toISOString(),
      };

      await update(noteRef, updatedNote);
      toast.success("Nota actualizada exitosamente");
      router.push("/dashboard/notes");
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      toast.error("Error al actualizar la nota");
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!note) {
    return <div className="p-6">Nota no encontrada</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Apunte</h1>
        <p className="text-muted-foreground">
          Modifica los detalles de tu apunte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Título
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Título del apunte"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Contenido
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Contenido del apunte"
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Materia
          </label>
          <Select
            value={formData.subjectId}
            onValueChange={(value) =>
              setFormData({ ...formData, subjectId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" className="btn-primary">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
