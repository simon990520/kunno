'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';
import { useUser } from '@clerk/nextjs';

export default function NotesSelector({ subject, selectedNotes, onNotesChange }) {
  const { user } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      if (!user || !subject) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const notesRef = ref(realtimeDb, `users/${user.id}/notes/${subject}`);
        const snapshot = await get(notesRef);
        
        if (snapshot.exists()) {
          const notesData = snapshot.val();
          const notesList = Object.keys(notesData).map(key => ({
            id: key,
            ...notesData[key]
          }));
          setNotes(notesList);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user, subject]);

  const handleNoteToggle = (noteId) => {
    const newSelectedNotes = selectedNotes.includes(noteId)
      ? selectedNotes.filter(id => id !== noteId)
      : [...selectedNotes, noteId];
    
    onNotesChange(newSelectedNotes);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center text-gray-500">
        Selecciona una materia para ver los apuntes disponibles
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay apuntes disponibles para esta materia
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {notes.map((note) => (
          <Card key={note.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={note.id}
                checked={selectedNotes.includes(note.id)}
                onCheckedChange={() => handleNoteToggle(note.id)}
              />
              <div className="flex-1">
                <label
                  htmlFor={note.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {note.title}
                </label>
                {note.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {note.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
