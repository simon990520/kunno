"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { HiMagnifyingGlass, HiSparkles, HiLightBulb, HiAcademicCap } from "react-icons/hi2";

const ExploreHeader = () => {
  const {user} = useUser();
  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
    creators: 0
  });
    
  useEffect(() => {
    // Generar números aleatorios solo del lado del cliente
    setStats({
      courses: Math.floor(Math.random() * 100) + 50,
      categories: Math.floor(Math.random() * 10) + 5,
      creators: Math.floor(Math.random() * 50) + 20
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-8 shadow-lg border border-orange-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Contenido izquierdo */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <HiMagnifyingGlass className="text-orange-500 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Explora cursos <span className="text-orange-600">creados por la comunidad</span>
            </h2>
          </div>
          
          <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
            <HiAcademicCap className="text-orange-500 text-xl mt-1" />
            <div>
              <p className="text-gray-600 leading-relaxed">
                Descubre una amplia variedad de cursos generados con IA, desde programación hasta marketing. 
                Aprende de otros creadores y encuentra inspiración para tus propios cursos.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <HiSparkles className="text-orange-500" />
                  <span>{stats.courses}+ Cursos disponibles</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <HiLightBulb className="text-orange-500" />
                  <span>Múltiples categorías</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <HiAcademicCap className="text-orange-500" />
                  <span>Contenido actualizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de crear curso */}
        <div className="w-full md:w-auto">
          <Link href="/create-course">
            <Button 
              variant="startButton"
              className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <HiSparkles className="text-xl" />
              Crear tu propio curso
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/80 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <HiSparkles className="text-orange-500 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Cursos Totales</h3>
            <p className="text-2xl font-semibold text-orange-600">{stats.courses}</p>
          </div>
        </div>
        
        <div className="bg-white/80 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <HiLightBulb className="text-orange-500 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Categorías</h3>
            <p className="text-2xl font-semibold text-orange-600">{stats.categories}</p>
          </div>
        </div>
        
        <div className="bg-white/80 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <HiAcademicCap className="text-orange-500 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Creadores</h3>
            <p className="text-2xl font-semibold text-orange-600">{stats.creators}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreHeader
