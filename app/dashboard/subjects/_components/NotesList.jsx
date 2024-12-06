"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { HiPencilSquare, HiTrash, HiPlus, HiChevronDown } from "react-icons/hi2";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const NotesList = ({ notes = {}, onEdit, onDelete, onAdd }) => {
  // Asegurarse de que notes sea un objeto
  const notesObj = typeof notes === 'object' && notes !== null ? notes : {};
  
  // Convertir el objeto de notas en un array y ordenarlo
  const notesList = Object.entries(notesObj).map(([id, note]) => ({
    id,
    ...note
  })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  console.log('Notes object:', notesObj); // Para debug
  console.log('Notes list:', notesList); // Para debug

  if (notesList.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
            <HiPlus className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay apuntes</h3>
          <p className="text-sm text-gray-500 mb-4">Comienza agregando tu primer apunte</p>
          <Button
            onClick={onAdd}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <HiPlus className="mr-2 h-4 w-4" />
            Agregar Apunte
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {notesList.map((note) => (
        <AccordionItem
          key={note.id}
          value={note.id}
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline px-4 py-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{note.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                >
                  <HiPencilSquare className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                >
                  <HiTrash className="h-4 w-4" />
                </Button>
                <HiChevronDown className="h-4 w-4 text-gray-500 transform transition-transform duration-200" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Última actualización: {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default NotesList;
