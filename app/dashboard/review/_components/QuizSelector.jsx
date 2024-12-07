"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { HiOutlineBookOpen, HiOutlineDocumentText } from "react-icons/hi";

const QuizSelector = ({ subjects, notes, onStart }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(current =>
      current.some(s => s.id === subject.id)
        ? current.filter(s => s.id !== subject.id)
        : [...current, subject]
    );
  };

  const handleNoteToggle = (note) => {
    setSelectedNotes(current =>
      current.some(n => n.id === note.id)
        ? current.filter(n => n.id !== note.id)
        : [...current, note]
    );
  };

  const canStart = selectedSubjects.length > 0 && selectedNotes.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjects Selection */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineBookOpen className="text-orange-500 text-xl" />
            <h3 className="font-semibold">Selecciona las Materias</h3>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedSubjects.some(s => s.id === subject.id)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  />
                  <label
                    htmlFor={`subject-${subject.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Notes Selection */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineDocumentText className="text-orange-500 text-xl" />
            <h3 className="font-semibold">Selecciona los Apuntes</h3>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`note-${note.id}`}
                    checked={selectedNotes.some(n => n.id === note.id)}
                    onCheckedChange={() => handleNoteToggle(note)}
                  />
                  <label
                    htmlFor={`note-${note.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {note.title}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => onStart(selectedSubjects, selectedNotes)}
          disabled={!canStart}
          className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white"
        >
          Comenzar Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizSelector;
