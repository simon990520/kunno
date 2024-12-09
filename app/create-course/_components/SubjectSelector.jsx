'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HiPlus, HiX } from 'react-icons/hi';

const subjectsByCategory = {
  programming: [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
    'PHP', 'Ruby', 'C++', 'C#', 'Swift', 'Kotlin', 'Go', 'Rust'
  ],
  science: [
    'Física', 'Química', 'Biología', 'Matemáticas', 'Astronomía', 'Geología',
    'Estadística', 'Cálculo', 'Álgebra', 'Geometría'
  ],
  languages: [
    'Inglés', 'Español', 'Francés', 'Alemán', 'Italiano', 'Portugués',
    'Chino', 'Japonés', 'Coreano', 'Ruso'
  ],
  arts: [
    'Dibujo', 'Pintura', 'Escultura', 'Fotografía', 'Diseño Gráfico',
    'Animación', 'Ilustración', 'Historia del Arte'
  ],
  health: [
    'Anatomía', 'Fisiología', 'Nutrición', 'Psicología', 'Medicina',
    'Enfermería', 'Farmacología', 'Salud Pública'
  ],
  music: [
    'Teoría Musical', 'Piano', 'Guitarra', 'Violín', 'Batería',
    'Canto', 'Composición', 'Producción Musical'
  ],
  education: [
    'Pedagogía', 'Didáctica', 'Psicología Educativa', 'Tecnología Educativa',
    'Evaluación', 'Currículo', 'Gestión Educativa'
  ],
  personal_dev: [
    'Liderazgo', 'Comunicación', 'Gestión del Tiempo', 'Productividad',
    'Inteligencia Emocional', 'Negociación', 'Emprendimiento'
  ]
};

const SubjectTag = ({ subject, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full"
  >
    <span className="text-sm font-medium">{subject}</span>
    <button
      onClick={onRemove}
      className="p-1 hover:bg-orange-200 rounded-full transition-colors"
    >
      <HiX className="w-3 h-3" />
    </button>
  </motion.div>
);

export default function SubjectSelector({ categoryId, onSubjectsChange, initialSubjects = [] }) {
  const [selectedSubjects, setSelectedSubjects] = useState(initialSubjects);
  const [customSubject, setCustomSubject] = useState('');
  const availableSubjects = subjectsByCategory[categoryId] || [];

  const handleAddSubject = (subject) => {
    if (!selectedSubjects.includes(subject)) {
      const newSubjects = [...selectedSubjects, subject];
      setSelectedSubjects(newSubjects);
      onSubjectsChange?.(newSubjects);
    }
  };

  const handleRemoveSubject = (subject) => {
    const newSubjects = selectedSubjects.filter(s => s !== subject);
    setSelectedSubjects(newSubjects);
    onSubjectsChange?.(newSubjects);
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      handleAddSubject(customSubject.trim());
      setCustomSubject('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {selectedSubjects.map((subject) => (
            <SubjectTag
              key={subject}
              subject={subject}
              onRemove={() => handleRemoveSubject(subject)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Agregar materia personalizada"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSubject()}
            className="flex-1"
          />
          <Button
            onClick={handleAddCustomSubject}
            disabled={!customSubject.trim()}
            size="icon"
          >
            <HiPlus className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {availableSubjects.map((subject) => (
            <motion.button
              key={subject}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddSubject(subject)}
              disabled={selectedSubjects.includes(subject)}
              className={`p-2 text-sm rounded-lg transition-colors ${
                selectedSubjects.includes(subject)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600'
              }`}
            >
              {subject}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
