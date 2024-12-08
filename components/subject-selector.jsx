"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiAcademicCap, HiDocumentText } from "react-icons/hi";

export default function SubjectSelector({
  subjects,
  selectedSubjects,
  selectedNotes,
  onSubjectsChange,
  onNotesChange,
}) {
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleSubject = (subjectId) => {
    const isSelected = selectedSubjects.includes(subjectId);
    let newSelectedSubjects;
    let newSelectedNotes = [...selectedNotes];

    if (isSelected) {
      // Deseleccionar materia y sus apuntes
      newSelectedSubjects = selectedSubjects.filter(id => id !== subjectId);
      const subject = subjects.find(s => s.id === subjectId);
      if (subject?.notes) {
        newSelectedNotes = selectedNotes.filter(noteId => 
          !subject.notes.some(note => note.id === noteId)
        );
      }
    } else {
      // Seleccionar materia
      newSelectedSubjects = [...selectedSubjects, subjectId];
    }

    onSubjectsChange(newSelectedSubjects);
    onNotesChange(newSelectedNotes);
  };

  const toggleNote = (noteId, subjectId) => {
    const isNoteSelected = selectedNotes.includes(noteId);
    let newSelectedNotes;

    if (isNoteSelected) {
      newSelectedNotes = selectedNotes.filter(id => id !== noteId);
    } else {
      newSelectedNotes = [...selectedNotes, noteId];
      // Asegurarse de que la materia esté seleccionada
      if (!selectedSubjects.includes(subjectId)) {
        onSubjectsChange([...selectedSubjects, subjectId]);
      }
    }

    onNotesChange(newSelectedNotes);
  };

  const toggleExpand = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden">
            <div
              className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(subject.id)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white">
                <HiAcademicCap className="h-5 w-5 text-blue-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={() => toggleSubject(subject.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <div className="truncate font-medium">{subject.name}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {subject.notes?.length || 0} apuntes disponibles
                </div>
              </div>

              <motion.div
                animate={{ rotate: expandedSubjects[subject.id] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown className="h-5 w-5 text-gray-500" />
              </motion.div>
            </div>

            <AnimatePresence>
              {expandedSubjects[subject.id] && subject.notes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t bg-gray-50"
                >
                  <div className="p-4 space-y-3">
                    {subject.notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center gap-3 pl-12 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border bg-white">
                          <HiDocumentText className="h-4 w-4 text-blue-500" />
                        </div>
                        <Checkbox
                          checked={selectedNotes.includes(note.id)}
                          onCheckedChange={() => toggleNote(note.id, subject.id)}
                          className="data-[state=checked]:bg-blue-500"
                        />
                        <span className="text-sm flex-1 truncate">{note.title}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
