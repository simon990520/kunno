"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HiPencilSquare, HiTrash, HiDocumentText, HiChevronDown } from "react-icons/hi2";
import { BsBook } from "react-icons/bs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import NotesList from './NotesList';

const SubjectCard = ({ subject, onEdit, onDelete, onAddNote, onEditNote, onDeleteNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!subject) return null;

  // Calcular la cantidad de apuntes considerando que notes puede ser un objeto o undefined
  const notesCount = subject.notes ? 
    (typeof subject.notes === 'object' ? Object.keys(subject.notes).length : 0) : 0;
    
  const lastUpdated = new Date(subject.updatedAt).toLocaleDateString();

  console.log('Subject notes:', subject.notes); // Para debug
  console.log('Notes count:', notesCount); // Para debug

  return (
    <Card className="relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <BsBook className="h-4 w-4 text-orange-600" />
            </div>
            <CardTitle className="text-lg font-medium text-gray-800">
              {subject.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-gray-200 hover:border-blue-500 hover:text-blue-500"
              onClick={() => onEdit(subject)}
            >
              <HiPencilSquare className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-gray-200 hover:border-red-500 hover:text-red-500"
              onClick={() => onDelete(subject.id)}
            >
              <HiTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {subject.description && (
          <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-2">
            {subject.description}
          </CardDescription>
        )}
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="pb-4">
          <div className="flex items-center justify-between text-sm">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent flex items-center gap-2 text-gray-600"
              >
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                  {notesCount} {notesCount === 1 ? 'apunte' : 'apuntes'}
                </Badge>
                <HiChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <span className="text-gray-500 text-xs">
              Actualizado: {lastUpdated}
            </span>
          </div>

          <CollapsibleContent className="mt-4">
            <NotesList
              notes={subject.notes || {}}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
              onAdd={() => onAddNote(subject)}
            />
          </CollapsibleContent>
        </CardContent>
      </Collapsible>

      <CardFooter className="pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-orange-600 hover:bg-orange-50"
          onClick={() => onAddNote(subject)}
        >
          <HiDocumentText className="mr-2 h-4 w-4" />
          Agregar Apunte
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
