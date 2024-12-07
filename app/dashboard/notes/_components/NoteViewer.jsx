"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HiX, HiPencil, HiClock, HiAcademicCap } from "react-icons/hi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const NoteViewer = ({ isOpen, onClose, note, onEdit }) => {
  console.log('NoteViewer - Component rendered with props:', { isOpen, note });
  
  // Only render the Dialog if both isOpen is true and note exists
  if (!isOpen || !note) {
    console.log('NoteViewer - Not rendering:', { isOpen, hasNote: !!note });
    return null;
  }

  const formatDate = (dateString) => {
    console.log('NoteViewer - Formatting date:', dateString);
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error('NoteViewer - Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const handleEdit = () => {
    console.log('NoteViewer - Editing note:', note);
    onEdit(note);
  };

  const handleClose = () => {
    console.log('NoteViewer - Closing viewer');
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 bg-gradient-to-br from-white to-orange-50">
        <DialogHeader className="sr-only">
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full h-full"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b p-4">
              <div className="flex justify-between items-center">
                <motion.h2 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {note.title}
                </motion.h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEdit}
                    className="hover:bg-orange-100"
                  >
                    <HiPencil className="h-4 w-4" />
                    <span className="sr-only">Editar apunte</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClose}
                    className="hover:bg-orange-100"
                  >
                    <HiX className="h-4 w-4" />
                    <span className="sr-only">Cerrar visor</span>
                  </Button>
                </div>
              </div>

              <motion.div 
                variants={contentVariants}
                className="flex items-center gap-4 mt-2 text-sm text-gray-600"
              >
                <div className="flex items-center gap-1">
                  <HiAcademicCap className="h-4 w-4" />
                  <span>{note.subject}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiClock className="h-4 w-4" />
                  <span>Actualizado: {formatDate(note.updatedAt)}</span>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[calc(90vh-120px)] p-6">
              <motion.div
                variants={contentVariants}
                className="prose prose-orange max-w-none"
              >
                {/* Split content by paragraphs and animate each one */}
                {note.content.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mb-4 text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}

                {/* Key Points Section (if available) */}
                {note.content.includes('Puntos clave') && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">
                      Puntos clave
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {note.content
                        .split('Puntos clave')[1]
                        .split('\n')
                        .filter(point => point.trim())
                        .map((point, index) => (
                          <motion.li
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            {point.trim()}
                          </motion.li>
                        ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default NoteViewer;
