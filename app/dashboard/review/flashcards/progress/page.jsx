"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ref, get } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from "framer-motion";
import {
  HiOutlineTrendingUp,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineChartBar
} from "react-icons/hi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FlashcardsProgressPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const flashcardsRef = ref(realtimeDb, `users/${user.id}/flashcards`);
      const snapshot = await get(flashcardsRef);
      
      if (snapshot.exists()) {
        setFlashcards(Object.values(snapshot.val()));
      }
    } catch (error) {
      console.error("Error loading flashcards progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (flashcards.length === 0) return {
      total: 0,
      mastered: 0,
      reviewing: 0,
      new: 0,
      masteredPercentage: 0,
      reviewingPercentage: 0,
      newPercentage: 0,
      byTopic: {},
      byDifficulty: {
        basic: 0,
        intermediate: 0,
        advanced: 0
      }
    };

    const stats = flashcards.reduce((acc, card) => {
      // Conteo por estado
      acc[card.status] = (acc[card.status] || 0) + 1;
      
      // Conteo por tema
      acc.byTopic[card.topic] = (acc.byTopic[card.topic] || 0) + 1;
      
      // Conteo por dificultad
      acc.byDifficulty[card.difficulty] = (acc.byDifficulty[card.difficulty] || 0) + 1;
      
      return acc;
    }, { byTopic: {}, byDifficulty: { basic: 0, intermediate: 0, advanced: 0 } });

    const total = flashcards.length;

    return {
      total,
      mastered: stats.mastered || 0,
      reviewing: stats.reviewing || 0,
      new: stats.new || 0,
      masteredPercentage: ((stats.mastered || 0) / total) * 100,
      reviewingPercentage: ((stats.reviewing || 0) / total) * 100,
      newPercentage: ((stats.new || 0) / total) * 100,
      byTopic: stats.byTopic,
      byDifficulty: stats.byDifficulty
    };
  };

  const stats = calculateStats();

  const statusChartData = {
    labels: ['Dominadas', 'En Revisión', 'Nuevas'],
    datasets: [
      {
        data: [stats.mastered, stats.reviewing, stats.new],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const topicsChartData = {
    labels: Object.keys(stats.byTopic),
    datasets: [
      {
        label: 'Flashcards por Tema',
        data: Object.values(stats.byTopic),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progreso de Flashcards</h1>
      
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <HiOutlineChartBar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Flashcards</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <HiOutlineTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Dominadas</h3>
                <p className="text-2xl font-bold">{stats.mastered}</p>
              </div>
            </div>
            <Progress value={stats.masteredPercentage} className="mt-4 h-2" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <HiOutlineClock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">En Revisión</h3>
                <p className="text-2xl font-bold">{stats.reviewing}</p>
              </div>
            </div>
            <Progress value={stats.reviewingPercentage} className="mt-4 h-2" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HiOutlineAcademicCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Nuevas</h3>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
            </div>
            <Progress value={stats.newPercentage} className="mt-4 h-2" />
          </Card>
        </motion.div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Flashcards</h3>
            <div className="h-[300px] flex items-center justify-center">
              <Pie
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Flashcards por Tema</h3>
            <div className="h-[300px]">
              <Bar
                data={topicsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FlashcardsProgressPage;
