"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  HiAcademicCap,
  HiLightningBolt,
  HiClock,
  HiTrendingUp,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from "react-icons/hi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const QuizStats = ({ stats }) => {
  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    averageResponseTime,
    subjectsProgress,
    history,
    streak,
    totalQuizzes
  } = stats;

  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Prepare data for the line chart
  const chartData = history?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    score: (entry.correctAnswers / (entry.correctAnswers + entry.incorrectAnswers)) * 100
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Precisión</h3>
              <HiAcademicCap className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Aciertos</span>
                <span className="font-medium">{accuracy.toFixed(1)}%</span>
              </div>
              <Progress value={accuracy} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Correctas: {correctAnswers}</span>
                <span>Incorrectas: {incorrectAnswers}</span>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Racha</h3>
              <HiLightningBolt className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{streak}</div>
              <p className="text-sm text-gray-500 mt-1">días consecutivos</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tiempo Promedio</h3>
              <HiClock className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {averageResponseTime ? `${averageResponseTime.toFixed(1)}s` : 'N/A'}
              </div>
              <p className="text-sm text-gray-500 mt-1">por pregunta</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Quizzes</h3>
              <HiOutlineBookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{totalQuizzes}</div>
              <p className="text-sm text-gray-500 mt-1">completados</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Progreso de Aprendizaje</h3>
            <HiOutlineChartBar className="w-6 h-6 text-orange-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#FF5F13"
                  strokeWidth={2}
                  dot={{ fill: "#FF5F13" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Subject Progress */}
      {subjectsProgress && Object.keys(subjectsProgress).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Progreso por Materia</h3>
              <HiTrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              {Object.entries(subjectsProgress).map(([subject, data]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{subject.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{data.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={data.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Correctas: {data.correctAnswers}</span>
                    <span>Total: {data.totalQuestions}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default QuizStats;
