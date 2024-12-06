"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiChevronDoubleRight, HiOutlineBookOpen, HiOutlineDownload, HiOutlineUserGroup, HiOutlineAcademicCap } from "react-icons/hi";
import { get, ref } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";

const Hero = () => {
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    chapters: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener estadísticas de cursos
        const coursesRef = ref(realtimeDb, 'courses');
        const coursesSnapshot = await get(coursesRef);
        const coursesData = coursesSnapshot.val() || {};
        const coursesCount = Object.keys(coursesData).length;
        
        // Calcular total de capítulos
        const chaptersCount = Object.values(coursesData).reduce((total, course) => {
          return total + (course?.courseOutput?.course?.chapters?.length || 0);
        }, 0);

        setStats({
          courses: coursesCount,
          chapters: chaptersCount,
          users: 0 // Esto se podría actualizar si tienes acceso a la base de datos de usuarios
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Fondo con overlay */}
      <div className="absolute inset-0 bg-[url('/banner.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative container mx-auto px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título y descripción */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
            Crea tus propios cursos con
            <span className="block text-orange-500 mt-2">Inteligencia Artificial</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Descubre una nueva forma de aprender con cursos personalizados creados por IA.
            Adapta tu educación a tu ritmo y objetivos únicos.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/explore-course">
              <Button 
                variant="startButton"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:scale-105"
              >
                Explorar cursos
                <HiChevronDoubleRight className="ml-2 text-xl" />
              </Button>
            </Link>

            <Link href="#download">
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-medium border-2 border-white text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
              >
                Descargar APP
                <HiOutlineDownload className="ml-2 text-xl" />
              </Button>
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <HiOutlineBookOpen className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.courses}+</h3>
              <p className="text-gray-300">Cursos Creados</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <HiOutlineAcademicCap className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.chapters}+</h3>
              <p className="text-gray-300">Capítulos Disponibles</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <HiOutlineUserGroup className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.users}+</h3>
              <p className="text-gray-300">Usuarios Activos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
