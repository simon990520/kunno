"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineRefresh } from "react-icons/hi";
import { motion } from "framer-motion";

const QuizSummary = ({ results, onRetry }) => {
  const totalQuestions = results.correctAnswers + results.incorrectAnswers;
  const score = (results.correctAnswers / totalQuestions) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto"
          >
            {score >= 70 ? (
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[#FF5F13] to-[#FBB041] rounded-full flex items-center justify-center">
                <HiOutlineAcademicCap className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <HiOutlineAcademicCap className="h-12 w-12 text-gray-500" />
              </div>
            )}
          </motion.div>
          <h2 className="text-2xl font-bold">¡Quiz Completado!</h2>
          <p className="text-gray-500">
            Has completado el quiz. Aquí están tus resultados:
          </p>
        </div>

        <div className="space-y-4">
          {/* Score Progress */}
          <motion.div 
            className="space-y-2"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex justify-between text-sm">
              <span>Puntuación Total</span>
              <span className="font-semibold">{Math.round(score)}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center p-4 bg-green-50 rounded-lg"
            >
              <div className="font-semibold text-green-600">
                {results.correctAnswers}
              </div>
              <div className="text-sm text-gray-500">Respuestas Correctas</div>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center p-4 bg-red-50 rounded-lg"
            >
              <div className="font-semibold text-red-600">
                {results.incorrectAnswers}
              </div>
              <div className="text-sm text-gray-500">Respuestas Incorrectas</div>
            </motion.div>
          </div>

          {/* Performance Analysis */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineChartBar className="text-orange-500" />
              <h3 className="font-semibold">Análisis de Desempeño</h3>
            </div>
            <p className="text-sm text-gray-600">
              {score >= 90
                ? "¡Excelente trabajo! Dominas estos temas a la perfección."
                : score >= 70
                ? "¡Buen trabajo! Tienes un buen entendimiento de los temas."
                : score >= 50
                ? "Vas por buen camino, pero hay espacio para mejorar."
                : "Te recomendamos repasar los temas nuevamente para mejorar tu comprensión."}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center pt-4"
          >
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white"
            >
              <HiOutlineRefresh className="mr-2 h-4 w-4" />
              Intentar Nuevo Quiz
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuizSummary;
