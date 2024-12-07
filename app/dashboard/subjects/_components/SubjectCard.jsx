import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiPencil, HiTrash, HiPlus, HiChevronDown } from "react-icons/hi2";
import { BsJournalText } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SubjectCard = ({ subject, onEdit, onDelete, onAddNote, onEditNote, onDeleteNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const notesCount = subject.notes ? Object.keys(subject.notes).length : 0;
  const formattedDate = format(new Date(subject.updatedAt), "dd 'de' MMMM, yyyy", { locale: es });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Card Header with Subject Color */}
      <div 
        className="h-2"
        style={{ backgroundColor: subject.color || '#FF6B00' }} 
      />
      
      <div className="p-6 space-y-4">
        {/* Subject Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight text-lg">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              {notesCount} {notesCount === 1 ? 'apunte' : 'apuntes'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <HiPencil className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <HiPencil className="mr-2 h-4 w-4" />
                Editar materia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={onDelete}
              >
                <HiTrash className="mr-2 h-4 w-4" />
                Eliminar materia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notes Section */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-9 w-full justify-between">
                <span className="text-sm font-medium">
                  Ver apuntes
                </span>
                <HiChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            {/* Add Note Button */}
            <Button
              onClick={onAddNote}
              className="w-full btn-primary justify-center gap-2 mb-3"
            >
              <HiPlus className="h-4 w-4" />
              Crear nuevo apunte
            </Button>

            {/* Notes List */}
            <div className="space-y-2">
              {subject.notes && Object.entries(subject.notes)
                .sort(([, a], [, b]) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map(([noteId, note]) => (
                  <div
                    key={noteId}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <BsJournalText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {note.title}
                        </h4>
                        {note.content && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {note.content}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onEditNote(note)}
                      >
                        <HiPencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600"
                        onClick={() => onDeleteNote(noteId)}
                      >
                        <HiTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

              {(!subject.notes || Object.keys(subject.notes).length === 0) && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No hay apuntes en esta materia
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Card Footer */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Última actualización: {formattedDate}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;
