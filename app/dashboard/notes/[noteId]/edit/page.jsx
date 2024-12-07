"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ref, get, update, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subject: z.string().min(1, 'La materia es requerida'),
  content: z.string().min(1, 'El contenido es requerido'),
});

const EditNotePage = ({ params }) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const { noteId } = params;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subject: '',
      content: '',
    },
  });

  useEffect(() => {
    const fetchNote = async () => {
      if (!user || !noteId) return;

      try {
        const noteRef = ref(realtimeDb, `notes/${user.id}/${noteId}`);
        const snapshot = await get(noteRef);
        
        if (snapshot.exists()) {
          const noteData = snapshot.val();
          form.reset(noteData);
        } else {
          toast({
            title: "Error",
            description: "No se encontró el apunte",
            variant: "destructive",
          });
          router.push('/dashboard/notes');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el apunte",
          variant: "destructive",
        });
      }
    };

    fetchNote();
  }, [user, noteId, form, router, toast]);

  const onSubmit = async (data) => {
    try {
      const noteRef = ref(realtimeDb, `notes/${user.id}/${noteId}`);
      await update(noteRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Apunte actualizado",
        description: "El apunte ha sido actualizado exitosamente",
      });

      router.push('/dashboard/notes');
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el apunte",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Apunte</h1>
        <p className="text-gray-500">Modifica los campos para actualizar el apunte</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título del apunte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materia</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la materia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Escribe tu apunte aquí..." 
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">Guardar Cambios</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditNotePage;
