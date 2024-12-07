"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { ref, remove } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';

const NoteCard = ({ note }) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const handleEdit = () => {
    router.push(`/dashboard/notes/${note.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este apunte?')) return;

    try {
      const noteRef = ref(realtimeDb, `notes/${user.id}/${note.id}`);
      await remove(noteRef);
      toast({
        title: "Apunte eliminado",
        description: "El apunte ha sido eliminado exitosamente",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el apunte",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2">{note.title}</CardTitle>
            <CardDescription>
              {note.subject}
              <br />
              {format(new Date(note.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <HiPencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <HiTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
