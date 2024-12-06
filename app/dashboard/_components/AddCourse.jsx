"use client"
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useContext } from 'react'
import { HiLightBulb, HiSparkles } from "react-icons/hi2";

const Addcourse = () => {
  const {user} = useUser();
    
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-8 shadow-lg border border-orange-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Contenido izquierdo */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-orange-500 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">
              ¡Bienvenido de nuevo, <span className="text-orange-600">{user?.fullName}!</span>
            </h2>
          </div>
          
          <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
            <HiLightBulb className="text-orange-500 text-xl mt-1" />
            <div>
              <p className="text-gray-600 leading-relaxed">
                Crea cursos personalizados con IA y compártelos con tu comunidad. 
                Perfecto para educadores, creadores de contenido y entusiastas del aprendizaje.
              </p>
              <div className="flex gap-2 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  Personalizado
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  Impulsado por IA
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  Fácil de compartir
                </span>
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
              Crear curso con IA
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Addcourse