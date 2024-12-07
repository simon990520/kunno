"use client";

import React, { useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  subjectId: z.string().min(1, 'La materia es requerida'),
});

const EditNotePage = ({ params }) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const { noteId } = params;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('EditNotePage - Initial render with params:', { noteId, userId: user?.id });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      subjectId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !noteId) {
        console.log('EditNotePage - Missing user or noteId:', { user, noteId });
        return;
      }

      try {
        console.log('EditNotePage - Fetching subjects...');
        // First, load all subjects
        const subjectsRef = ref(realtimeDb, 'subjects');
        const subjectsSnapshot = await get(subjectsRef);
        
        if (!subjectsSnapshot.exists()) {
          console.log('EditNotePage - No subjects found');
          toast({
            title: "Error",
            description: "No se encontraron materias",
            variant: "destructive",
          });
          router.push('/dashboard/notes');
          return;
        }

        const subjectsData = subjectsSnapshot.val();
        console.log('EditNotePage - Subjects data:', subjectsData);
        
        const subjectsList = [];
        let foundNote = null;
        let foundSubjectId = null;

        // Convert subjects and find the note
        for (const [subjectId, subject] of Object.entries(subjectsData)) {
          subjectsList.push({
            id: subjectId,
            name: subject.name,
          });

          console.log(`EditNotePage - Checking subject ${subjectId} for note ${noteId}`);
          if (subject.notes && subject.notes[noteId]) {
            console.log('EditNotePage - Found note in subject:', subjectId);
            foundNote = subject.notes[noteId];
            foundSubjectId = subjectId;
          }
        }

        setSubjects(subjectsList);
        console.log('EditNotePage - Subjects list:', subjectsList);

        if (foundNote) {
          console.log('EditNotePage - Setting form with found note:', foundNote);
          form.reset({
            title: foundNote.title,
            content: foundNote.content,
            subjectId: foundSubjectId,
          });
        } else {
          console.log('EditNotePage - Note not found:', noteId);
          toast({
            title: "Error",
            description: "No se encontró el apunte",
            variant: "destructive",
          });
          router.push('/dashboard/notes');
        }
      } catch (error) {
        console.error('EditNotePage - Error fetching note:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el apunte",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, noteId, form, router, toast]);

  const onSubmit = async (data) => {
    console.log('EditNotePage - Submitting form with data:', data);
    try {
      const noteRef = ref(realtimeDb, `subjects/${data.subjectId}/notes/${noteId}`);
      console.log('EditNotePage - Updating note at path:', `subjects/${data.subjectId}/notes/${noteId}`);
      
      const updateData = {
        title: data.title,
        content: data.content,
        updatedAt: serverTimestamp(),
        updatedBy: user.id,
      };
      console.log('EditNotePage - Update data:', updateData);

      await update(noteRef, updateData);
      console.log('EditNotePage - Note updated successfully');

      toast({
        title: "Apunte actualizado",
        description: "El apunte ha sido actualizado exitosamente",
      });

      router.push('/dashboard/notes');
    } catch (error) {
      console.error('EditNotePage - Error updating note:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el apunte",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

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
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materia</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
