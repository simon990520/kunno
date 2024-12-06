"use client";

import { Button } from "@/components/ui/button";
import { get, ref, remove, set, update } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import SubjectCard from "./_components/SubjectCard";
import SubjectModal from "./_components/SubjectModal";
import NoteModal from "./_components/NoteModal";
import { Input } from "@/components/ui/input";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadSubjects();
    }
  }, [user]);

  const loadSubjects = async () => {
    try {
      const subjectsRef = ref(realtimeDb, 'subjects');
      const snapshot = await get(subjectsRef);
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const subjectsList = Object.entries(subjectsData)
          .map(([id, data]) => {
            // Asegurarse de que notes sea un objeto si existe, o un objeto vacío si no existe
            const notes = data.notes && typeof data.notes === 'object' ? data.notes : {};
            return {
              id,
              ...data,
              notes
            };
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setSubjects(subjectsList);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error al cargar materias:', error);
      toast.error('Error al cargar las materias');
    }
  };

  const handleSaveSubject = async (formData) => {
    try {
      const now = new Date().toISOString();
      let subjectData = {
        ...formData,
        updatedAt: now,
      };

      if (!editingSubject) {
        // Crear nueva materia
        subjectData = {
          ...subjectData,
          createdAt: now,
          createdBy: user?.id || 'unknown',
          notes: {}
        };
        const subjectId = Date.now().toString();
        const newSubjectRef = ref(realtimeDb, `subjects/${subjectId}`);
        await set(newSubjectRef, subjectData);
        toast.success('Materia creada exitosamente');
      } else {
        // Actualizar materia existente
        const subjectRef = ref(realtimeDb, `subjects/${editingSubject.id}`);
        subjectData = {
          ...editingSubject,
          ...subjectData,
          notes: editingSubject.notes || {},
          createdAt: editingSubject.createdAt,
          createdBy: editingSubject.createdBy,
        };
        await set(subjectRef, subjectData);
        toast.success('Materia actualizada exitosamente');
      }

      handleCloseSubjectModal();
      loadSubjects();
    } catch (error) {
      console.error('Error al guardar materia:', error);
      toast.error('Error al guardar la materia');
    }
  };

  const handleSaveNote = async (formData) => {
    if (!currentSubject) return;

    try {
      const now = new Date().toISOString();
      const noteId = editingNote ? editingNote.id : Date.now().toString();
      
      const noteData = {
        ...formData,
        id: noteId,
        updatedAt: now,
        createdAt: editingNote ? editingNote.createdAt : now,
        createdBy: editingNote ? editingNote.createdBy : user?.id || 'unknown',
      };

      // Actualizar la nota específica en la ruta correcta
      const noteRef = ref(realtimeDb, `subjects/${currentSubject.id}/notes/${noteId}`);
      await set(noteRef, noteData);

      // Actualizar la fecha de actualización de la materia
      const subjectRef = ref(realtimeDb, `subjects/${currentSubject.id}`);
      await update(subjectRef, { updatedAt: now });

      toast.success(editingNote ? 'Apunte actualizado exitosamente' : 'Apunte creado exitosamente');
      handleCloseNoteModal();
      loadSubjects();
    } catch (error) {
      console.error('Error al guardar apunte:', error);
      toast.error('Error al guardar el apunte');
    }
  };

  const handleDeleteSubject = async () => {
    if (!deleteSubjectId) return;

    try {
      const subjectRef = ref(realtimeDb, `subjects/${deleteSubjectId}`);
      await remove(subjectRef);
      toast.success('Materia eliminada exitosamente');
      setDeleteSubjectId(null);
      loadSubjects();
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      toast.error('Error al eliminar la materia');
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteId || !currentSubject) return;

    try {
      // Eliminar la nota específica
      const noteRef = ref(realtimeDb, `subjects/${currentSubject.id}/notes/${deleteNoteId}`);
      await remove(noteRef);

      // Actualizar la fecha de actualización de la materia
      const subjectRef = ref(realtimeDb, `subjects/${currentSubject.id}`);
      await update(subjectRef, { updatedAt: new Date().toISOString() });

      toast.success('Apunte eliminado exitosamente');
      setDeleteNoteId(null);
      setCurrentSubject(null);
      loadSubjects();
    } catch (error) {
      console.error('Error al eliminar apunte:', error);
      toast.error('Error al eliminar el apunte');
    }
  };

  const handleOpenSubjectModal = (subject = null) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleCloseSubjectModal = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(false);
  };

  const handleOpenNoteModal = (subject, note = null) => {
    setCurrentSubject(subject);
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setCurrentSubject(null);
    setEditingNote(null);
    setIsNoteModalOpen(false);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Materias</h1>
          <Button
            onClick={() => handleOpenSubjectModal()}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <HiPlus className="mr-2 h-4 w-4" />
            Nueva Materia
          </Button>
        </div>

        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar materias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={() => handleOpenSubjectModal(subject)}
                onDelete={() => setDeleteSubjectId(subject.id)}
                onAddNote={() => handleOpenNoteModal(subject)}
                onEditNote={(note) => handleOpenNoteModal(subject, note)}
                onDeleteNote={(noteId) => {
                  setCurrentSubject(subject);
                  setDeleteNoteId(noteId);
                }}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <HiPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay materias</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando una nueva materia
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => handleOpenSubjectModal()}
                    className="bg-orange-600 text-white hover:bg-orange-700"
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Nueva Materia
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={handleCloseSubjectModal}
        onSave={handleSaveSubject}
        subject={editingSubject}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        onSave={handleSaveNote}
        note={editingNote}
      />

      <AlertDialog open={!!deleteSubjectId} onOpenChange={() => setDeleteSubjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la materia y todos sus apuntes permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el apunte permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubjectsPage;
