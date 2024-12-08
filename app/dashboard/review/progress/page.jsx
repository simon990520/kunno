"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ref, get } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCheck,
  HiOutlineX
} from "react-icons/hi";
import { motion } from "framer-motion";

const QuizProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      // Cargar progreso general
      const progressRef = ref(realtimeDb, `users/${user.id}/progress`);
      const progressSnapshot = await get(progressRef);
      
      // Cargar historial de quizzes
      const historyRef = ref(realtimeDb, `users/${user.id}/quizHistory`);
      const historySnapshot = await get(historyRef);
      
      if (progressSnapshot.exists()) {
        setProgress(progressSnapshot.val());
      }
      
      if (historySnapshot.exists()) {
        const historyData = historySnapshot.val();
        
        // Convertir los timestamps a objetos Date para comparación
        const processedHistory = Object.entries(historyData)
          .map(([key, data]) => ({
            id: key,
            ...data,
            dateObj: new Date(data.timestamp),
            displayDate: new Date(data.timestamp).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }))
          // Ordenar por fecha, más reciente primero
          .sort((a, b) => b.dateObj - a.dateObj)
          // Eliminar duplicados basados en el timestamp (mantener solo el más reciente)
          .filter((quiz, index, self) => 
            index === self.findIndex((q) => 
              Math.abs(q.dateObj - quiz.dateObj) < 1000 // Considerar duplicados si están dentro de 1 segundo
            )
          )
          // Limpiar campos temporales
          .map(({ dateObj, ...quiz }) => quiz);

        setQuizHistory(processedHistory);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Progreso de Quiz</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const calculateStats = () => {
    if (!progress) return { averageScore: 0, totalQuizzes: 0, totalQuestions: 0 };
    
    return {
      averageScore: progress.averageScore || 0,
      totalQuizzes: progress.totalQuizzes || 0,
      totalQuestions: progress.totalQuestions || 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progreso de Quiz</h1>
      
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <HiOutlineTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Promedio General</h3>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={stats.averageScore} className="h-2" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HiOutlineAcademicCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Quizzes Completados</h3>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HiOutlineChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total de Preguntas</h3>
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Historial de Quizzes */}
      <h2 className="text-xl font-semibold mb-4">Historial de Quizzes</h2>
      <div className="space-y-4">
        {quizHistory.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineClock className="text-gray-400" />
                    <span className="text-sm text-gray-500">{quiz.displayDate}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-green-600">
                      <HiOutlineCheck className="mr-1" />
                      {quiz.correctAnswers}
                    </div>
                    <div className="flex items-center text-red-600">
                      <HiOutlineX className="mr-1" />
                      {quiz.incorrectAnswers}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Puntuación</div>
                    <div className="text-xl font-bold">{quiz.score.toFixed(1)}%</div>
                  </div>
                  <Progress value={quiz.score} className="w-32 h-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {quizHistory.length === 0 && (
          <Card className="p-6 text-center text-gray-500">
            No has completado ningún quiz todavía
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizProgressPage;
