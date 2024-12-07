"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ref, get, set, update } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subject: z.string().min(1, 'La materia es requerida'),
  content: z.string().min(1, 'El contenido es requerido'),
});

const CreateNotePage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subject: '',
      content: '',
    },
  });

  useEffect(() => {
    const loadSubjects = async () => {
      if (!user) return;
      
      try {
        const subjectsRef = ref(realtimeDb, 'subjects');
        const snapshot = await get(subjectsRef);
        
        if (snapshot.exists()) {
          const subjectsData = snapshot.val();
          const userSubjects = Object.entries(subjectsData)
            .filter(([_, subject]) => subject.createdBy === user.id)
            .map(([id, subject]) => ({
              id,
              name: subject.name
            }));
          setSubjects(userSubjects);
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las materias",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [user, toast]);

  const onSubmit = async (data) => {
    try {
      const selectedSubject = subjects.find(s => s.id === data.subject);
      if (!selectedSubject) {
        throw new Error('Materia no encontrada');
      }

      // Primero obtener la materia actual para preservar sus datos
      const subjectRef = ref(realtimeDb, `subjects/${data.subject}`);
      const subjectSnapshot = await get(subjectRef);
      
      if (!subjectSnapshot.exists()) {
        throw new Error('Materia no encontrada en la base de datos');
      }

      const subjectData = subjectSnapshot.val();
      const noteId = uuidv4();
      const now = new Date().toISOString();
      
      // Preparar los datos de la nota
      const noteData = {
        id: noteId,
        title: data.title,
        content: data.content,
        createdAt: now,
        updatedAt: now,
        createdBy: user.id
      };

      // Actualizar la materia con la nueva nota
      const updates = {
        [`subjects/${data.subject}/notes/${noteId}`]: noteData,
        [`subjects/${data.subject}/updatedAt`]: now
      };

      // Usar update para preservar datos existentes
      await update(ref(realtimeDb), updates);

      toast({
        title: "Apunte creado",
        description: "El apunte ha sido creado exitosamente",
      });

      router.push('/dashboard/notes');
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el apunte",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando materias...</div>;
  }

  if (subjects.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">No hay materias disponibles</h1>
        <p className="text-gray-500 mb-4">Necesitas crear al menos una materia antes de crear un apunte</p>
        <Button onClick={() => router.push('/dashboard/subjects')}>
          Crear Materia
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Nuevo Apunte</h1>
        <p className="text-gray-500">Completa los campos para crear un nuevo apunte</p>
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
            <Button type="submit">Crear Apunte</Button>
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

export default CreateNotePage;
