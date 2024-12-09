'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiAcademicCap, HiBeaker, HiCode, HiGlobe, HiHeart, HiLightBulb, HiMusicNote, HiPencil } from 'react-icons/hi';

const categories = [
  {
    id: 'programming',
    name: 'Programación',
    icon: HiCode,
    color: 'bg-blue-500',
    description: 'Desarrollo de software, web y móvil'
  },
  {
    id: 'science',
    name: 'Ciencias',
    icon: HiBeaker,
    color: 'bg-green-500',
    description: 'Física, química, biología y más'
  },
  {
    id: 'languages',
    name: 'Idiomas',
    icon: HiGlobe,
    color: 'bg-yellow-500',
    description: 'Aprende nuevos idiomas'
  },
  {
    id: 'arts',
    name: 'Artes',
    icon: HiPencil,
    color: 'bg-purple-500',
    description: 'Dibujo, pintura, música y más'
  },
  {
    id: 'health',
    name: 'Salud',
    icon: HiHeart,
    color: 'bg-red-500',
    description: 'Medicina, nutrición y bienestar'
  },
  {
    id: 'music',
    name: 'Música',
    icon: HiMusicNote,
    color: 'bg-indigo-500',
    description: 'Teoría musical e instrumentos'
  },
  {
    id: 'education',
    name: 'Educación',
    icon: HiAcademicCap,
    color: 'bg-orange-500',
    description: 'Pedagogía y métodos de enseñanza'
  },
  {
    id: 'personal_dev',
    name: 'Desarrollo Personal',
    icon: HiLightBulb,
    color: 'bg-teal-500',
    description: 'Crecimiento personal y profesional'
  }
];

const CategoryCard = ({ category, isSelected, onClick }) => {
  const Icon = category.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl p-6 ${
        isSelected ? category.color + ' text-white' : 'bg-white hover:bg-gray-50'
      } transition-all duration-300 shadow-sm hover:shadow-md`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <Icon className={`w-12 h-12 ${isSelected ? 'text-white' : category.color}`} />
        <div>
          <h3 className="font-bold text-lg">{category.name}</h3>
          <p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
            {category.description}
          </p>
        </div>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
        >
          <svg
            className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function CategorySelector({ onSelect, initialCategory = null }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleSelect = (category) => {
    setSelectedCategory(category.id);
    onSelect?.(category);
  };

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleSelect(category)}
          />
        ))}
      </motion.div>
    </div>
  );
}
