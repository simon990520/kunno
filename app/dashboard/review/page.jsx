"use client";

import { 
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineDocumentText
} from "react-icons/hi";
import Link from "next/link";
import { useState, useEffect } from "react";

const ReviewPage = () => {
  const [stats, setStats] = useState({
    quizzes: 0,
    flashcards: 0,
    subjects: 0
  });

  useEffect(() => {
    setStats({
      quizzes: Math.floor(Math.random() * 50) + 20,
      flashcards: Math.floor(Math.random() * 100) + 50,
      subjects: Math.floor(Math.random() * 10) + 5
    });
  }, []);

  const reviewOptions = [
    {
      title: "Quizzes",
      description: "Pon a prueba tu conocimiento con preguntas interactivas sobre tus materias",
      icon: HiOutlineAcademicCap,
      href: "/dashboard/review/quizzes",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Flashcards",
      description: "Repasa conceptos clave usando tarjetas de memoria",
      icon: HiOutlineLightBulb,
      href: "/dashboard/review/flashcards",
      color: "from-[#FF5F13] to-[#FBB041]",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-8 shadow-lg border border-orange-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <HiOutlineBookOpen className="text-orange-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Mejora tu <span className="text-orange-600">aprendizaje</span>
              </h2>
            </div>
            
            <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
              <HiOutlineDocumentText className="text-orange-500 text-xl mt-1" />
              <div>
                <p className="text-gray-600 leading-relaxed">
                  Refuerza tu conocimiento con diferentes métodos de repaso. 
                  Utiliza quizzes para evaluar tu comprensión y flashcards para memorizar conceptos clave.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    <HiOutlineAcademicCap className="text-orange-500" />
                    <span>{stats.quizzes}+ Quizzes disponibles</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    <HiOutlineLightBulb className="text-orange-500" />
                    <span>{stats.flashcards}+ Flashcards creadas</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    <HiOutlineChartBar className="text-orange-500" />
                    <span>{stats.subjects} Materias activas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Options */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Repasar</h1>
        <p className="text-gray-500">Elige un método para reforzar tu aprendizaje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.title}
              href={option.href}
              className="group relative overflow-hidden rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold">{option.title}</h2>
                </div>
                
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                <div className="flex items-center text-sm font-medium text-gray-800">
                  Comenzar
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewPage;
