'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HiPlus, HiX, HiPencil, HiCheck } from 'react-icons/hi';
import { toast } from 'sonner';

const NoteCard = ({ note, onEdit, onDelete, subjectName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    if (editedContent.trim()) {
      onEdit({ ...note, content: editedContent.trim() });
      setIsEditing(false);
    } else {
      toast.error('El contenido no puede estar vacío');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-orange-600">
          {subjectName}
        </span>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
            >
              <HiCheck className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <HiPencil className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(note.id)}
          >
            <HiX className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[100px]"
          placeholder="Escribe tu apunte aquí..."
        />
      ) : (
        <p className="text-gray-600 text-sm whitespace-pre-wrap">
          {note.content}
        </p>
      )}
    </motion.div>
  );
};

export default function NotesEditor({ subjects, initialNotes = [], onChange }) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }

    if (!selectedSubject) {
      toast.error('Selecciona una materia');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      subjectId: selectedSubject,
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNoteContent('');
    onChange?.(updatedNotes);
    toast.success('Apunte agregado exitosamente');
  };

  const handleEditNote = (editedNote) => {
    const updatedNotes = notes.map(note =>
      note.id === editedNote.id ? editedNote : note
    );
    setNotes(updatedNotes);
    onChange?.(updatedNotes);
    toast.success('Apunte actualizado exitosamente');
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    onChange?.(updatedNotes);
    toast.success('Apunte eliminado exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Escribe un nuevo apunte..."
            className="min-h-[100px]"
          />
          <Button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim() || !selectedSubject}
            className="w-full"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Agregar Apunte
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                subjectName={subjects.find(s => s.id === note.subjectId)?.name}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
