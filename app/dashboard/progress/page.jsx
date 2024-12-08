'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HiOutlineFire, HiOutlineClock, HiOutlineAcademicCap } from 'react-icons/hi2';
import { getQuizStats, getSubjectProgress, getLearningStreak } from '@/services/stats';
import LoadingProgress from './_components/LoadingProgress';

export default function ProgressPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [quizStats, subjects, streakData] = await Promise.all([
          getQuizStats(user.id),
          getSubjectProgress(user.id),
          getLearningStreak(user.id)
        ]);

        setStats(quizStats);
        setSubjectProgress(subjects);
        setStreak(streakData);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return <LoadingProgress />;
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-center">Inicia sesión para ver tu progreso</p>
        </Card>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const chartData = stats.map(quiz => ({
    date: new Date(quiz.completionDate).toLocaleDateString(),
    accuracy: (quiz.correctAnswers / quiz.totalQuestions) * 100
  }));

  // Calcular promedio general
  const overallAccuracy = stats.length > 0
    ? stats.reduce((acc, quiz) => 
        acc + (quiz.correctAnswers / quiz.totalQuestions) * 100, 0
      ) / stats.length
    : 0;

  // Calcular tiempo promedio general
  const averageTime = stats.length > 0
    ? stats.reduce((acc, quiz) => acc + quiz.averageResponseTime, 0) / stats.length
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tu Progreso</h1>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <HiOutlineFire className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Racha de Aprendizaje</p>
              <p className="text-2xl font-bold">{streak?.currentStreak || 0} días</p>
              <p className="text-xs text-gray-500">Mejor: {streak?.longestStreak || 0} días</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <HiOutlineClock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tiempo Promedio</p>
              <p className="text-2xl font-bold">{averageTime.toFixed(1)}s</p>
              <p className="text-xs text-gray-500">por pregunta</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <HiOutlineAcademicCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Precisión General</p>
              <p className="text-2xl font-bold">{overallAccuracy.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">promedio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Progreso */}
      {chartData.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Progreso en el Tiempo</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#FF5F13"
                  strokeWidth={2}
                  dot={{ fill: '#FF5F13' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Progreso por Materia */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Progreso por Materia</h2>
        <div className="space-y-4">
          {subjectProgress.map((subject) => (
            <div key={subject.subject}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{subject.subject}</span>
                <span className="text-sm text-gray-500">
                  {subject.correctAnswers}/{subject.totalQuestions} ({Math.round(subject.averageAccuracy)}%)
                </span>
              </div>
              <Progress value={subject.averageAccuracy} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Tiempo promedio: {subject.averageResponseTime.toFixed(1)}s</span>
                <span>Quizzes completados: {subject.totalQuizzes}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
