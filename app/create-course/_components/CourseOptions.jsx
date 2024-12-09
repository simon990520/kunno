'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiAcademicCap, HiClock, HiUserGroup, HiVideoCamera } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const difficultyLevels = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' }
];

const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' },
  { value: '180', label: '3 horas' },
  { value: 'custom', label: 'Personalizado' }
];

const audienceOptions = [
  { value: 'students', label: 'Estudiantes' },
  { value: 'professionals', label: 'Profesionales' },
  { value: 'teachers', label: 'Profesores' },
  { value: 'researchers', label: 'Investigadores' },
  { value: 'general', label: 'Público General' }
];

export default function CourseOptions({ initialOptions = {}, onChange }) {
  const [options, setOptions] = useState({
    difficulty: 'beginner',
    duration: '60',
    customDuration: '',
    targetAudience: ['general'],
    includeVideo: true,
    ...initialOptions
  });

  const handleChange = (field, value) => {
    const updatedOptions = { ...options, [field]: value };
    setOptions(updatedOptions);
    onChange?.(updatedOptions);
  };

  const toggleAudience = (audience) => {
    const currentAudiences = options.targetAudience || [];
    let newAudiences;

    if (currentAudiences.includes(audience)) {
      newAudiences = currentAudiences.filter(a => a !== audience);
    } else {
      newAudiences = [...currentAudiences, audience];
    }

    handleChange('targetAudience', newAudiences);
  };

  return (
    <div className="space-y-8">
      {/* Difficulty Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <HiAcademicCap className="w-5 h-5 text-orange-600" />
          <h3>Nivel de Dificultad</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleChange('difficulty', level.value)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${options.difficulty === level.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-200'
                }
              `}
            >
              {level.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <HiClock className="w-5 h-5 text-orange-600" />
          <h3>Duración del Curso</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {durationOptions.map((duration) => (
              <button
                key={duration.value}
                onClick={() => handleChange('duration', duration.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${options.duration === duration.value
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-orange-200'
                  }
                `}
              >
                {duration.label}
              </button>
            ))}
          </div>
          {options.duration === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={options.customDuration}
                onChange={(e) => handleChange('customDuration', e.target.value)}
                placeholder="Duración en minutos"
                className="max-w-[200px]"
              />
              <span className="text-gray-500">minutos</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Target Audience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <HiUserGroup className="w-5 h-5 text-orange-600" />
          <h3>Audiencia Objetivo</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {audienceOptions.map((audience) => (
            <button
              key={audience.value}
              onClick={() => toggleAudience(audience.value)}
              className={`
                px-4 py-2 rounded-full transition-all
                ${options.targetAudience?.includes(audience.value)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              {audience.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Video Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <HiVideoCamera className="w-5 h-5 text-orange-600" />
          <h3>Contenido en Video</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleChange('includeVideo', true)}
            className={`
              px-4 py-2 rounded-lg transition-all
              ${options.includeVideo
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            Incluir Videos
          </button>
          <button
            onClick={() => handleChange('includeVideo', false)}
            className={`
              px-4 py-2 rounded-lg transition-all
              ${!options.includeVideo
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            Solo Texto
          </button>
        </div>
      </motion.div>
    </div>
  );
}
