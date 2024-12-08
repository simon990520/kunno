'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';
import { useUser } from '@clerk/nextjs';

export default function SubjectSelector({ selectedSubject, onSubjectChange }) {
  const { user } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!user) return;

      try {
        const subjectsRef = ref(realtimeDb, `users/${user.id}/subjects`);
        const snapshot = await get(subjectsRef);
        
        if (snapshot.exists()) {
          const subjectsData = snapshot.val();
          const subjectsList = Object.keys(subjectsData).map(key => ({
            id: key,
            ...subjectsData[key]
          }));
          setSubjects(subjectsList);
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [user]);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Cargando materias..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (subjects.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="No hay materias disponibles" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedSubject} onValueChange={onSubjectChange}>
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
  );
}
