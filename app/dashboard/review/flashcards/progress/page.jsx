"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ref, get } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCheck,
  HiOutlineCollection,
  HiOutlineChevronLeft
} from "react-icons/hi";
import { motion } from "framer-motion";

const FlashcardsProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [flashcardHistory, setFlashcardHistory] = useState([]);
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
      const progressRef = ref(realtimeDb, `users/${user.id}/flashcardsProgress`);
      const progressSnapshot = await get(progressRef);
      
      // Cargar historial de sesiones
      const historyRef = ref(realtimeDb, `users/${user.id}/flashcardSessions`);
      const historySnapshot = await get(historyRef);
      
      if (progressSnapshot.exists()) {
        setProgress(progressSnapshot.val());
      }
      
      if (historySnapshot.exists()) {
        const historyData = historySnapshot.val();
        
        const processedHistory = Object.entries(historyData)
          .map(([key, data]) => ({
            id: key,
            ...data,
            dateObj: new Date(data.timestamp || data.date),
            displayDate: new Date(data.timestamp || data.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }))
          .sort((a, b) => b.dateObj - a.dateObj)
          .filter((session, index, self) => 
            index === self.findIndex((s) => 
              Math.abs(s.dateObj - session.dateObj) < 1000
            )
          )
          .map(({ dateObj, ...session }) => session);

        setFlashcardHistory(processedHistory);
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
        <h1 className="text-2xl font-bold mb-6">Progreso de Flashcards</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const calculateStats = () => {
    if (!progress) return {
      totalSessions: 0,
      totalCards: 0,
      masteredCards: 0,
      averageCompletionRate: 0
    };
    
    return {
      totalSessions: progress.totalSessions || 0,
      totalCards: progress.totalCards || 0,
      masteredCards: progress.masteredCards || 0,
      averageCompletionRate: progress.averageCompletionRate || 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/review/flashcards">
          <Button variant="outline" size="sm" className="gap-2">
            <HiOutlineChevronLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Progreso de Flashcards</h1>
      </div>
      
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
                <h3 className="text-sm text-gray-500">Tasa de Éxito</h3>
                <p className="text-2xl font-bold">{stats.averageCompletionRate.toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={stats.averageCompletionRate} className="h-2" />
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
                <HiOutlineCollection className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Sesiones Completadas</h3>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
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
                <h3 className="text-sm text-gray-500">Tarjetas Dominadas</h3>
                <p className="text-2xl font-bold">{stats.masteredCards}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Historial de Sesiones */}
      <h2 className="text-xl font-semibold mb-4">Historial de Sesiones</h2>
      <div className="space-y-4">
        {flashcardHistory.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineClock className="text-gray-400" />
                    <span className="text-sm text-gray-500">{session.displayDate}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-green-600">
                      <HiOutlineCheck className="mr-1" />
                      {session.mastered} dominadas
                    </div>
                    <div>
                      {session.total} tarjetas totales
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tasa de Éxito</div>
                    <div className="text-xl font-bold">{session.completionRate?.toFixed(1)}%</div>
                  </div>
                  <Progress value={session.completionRate} className="w-32 h-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardsProgressPage;
