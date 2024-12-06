"use client"
import React from 'react'
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2"

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const quickFilters = [
    'Programación',
    'Idiomas',
    'Personal',
    'Hobbies',
    'Educación'
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, tema o nivel..."
          className="w-full px-4 py-3 pl-12 pr-10 bg-white rounded-xl shadow-sm border border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
        />
        <HiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 text-xl" />
        
        {/* Botón de limpiar búsqueda */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <HiXMark className="text-xl" />
          </button>
        )}
      </div>
      
      {/* Filtros rápidos */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSearchQuery(filter)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
              searchQuery === filter
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
