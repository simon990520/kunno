"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheck, HiX, HiOutlineChevronRight } from "react-icons/hi";

const QuizQuestion = ({ 
  question, 
  onAnswer, 
  currentQuestion, 
  totalQuestions,
  correctAnswers,
  incorrectAnswers 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = async (option) => {
    if (answered || isLoading) return; // Prevenir múltiples selecciones
    
    setIsLoading(true);
    setSelectedAnswer(option);
    
    const correct = option === question.correct_answer;
    setIsCorrect(correct);
    
    // Pequeña pausa para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setShowFeedback(true);
    setAnswered(true);
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    onAnswer(isCorrect);
    // Resetear estados para la siguiente pregunta
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setAnswered(false);
  };

  const getOptionClassName = (option) => {
    const baseClass = "p-4 border rounded-lg transition-colors";
    
    if (!showFeedback) {
      return `${baseClass} ${!answered ? 'hover:bg-gray-50 cursor-pointer' : ''}`;
    }

    if (option === selectedAnswer) {
      return `${baseClass} ${
        option === question.correct_answer 
          ? 'bg-green-100 border-green-500' 
          : 'bg-red-100 border-red-500'
      }`;
    }

    if (option === question.correct_answer && showFeedback) {
      return `${baseClass} bg-green-100 border-green-500`;
    }

    return baseClass;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            Pregunta {currentQuestion} de {totalQuestions}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-green-600">
              <HiCheck className="w-5 h-5 mr-1" />
              {correctAnswers}
            </span>
            <span className="flex items-center text-red-600">
              <HiX className="w-5 h-5 mr-1" />
              {incorrectAnswers}
            </span>
          </div>
        </div>
        <Progress 
          value={(currentQuestion / totalQuestions) * 100} 
          className="h-2"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">{question.question}</h3>
        
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !answered && handleOptionClick(option)}
              className={getOptionClassName(option)}
            >
              {option}
              {isLoading && selectedAnswer === option && (
                <div className="float-right">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {showFeedback && selectedAnswer === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="float-right"
                >
                  {option === question.correct_answer ? (
                    <HiCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiX className="w-5 h-5 text-red-500" />
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className={`font-medium ${
              isCorrect ? "text-green-800" : "text-red-800"
            }`}>
              {isCorrect ? "¡Correcto!" : "Incorrecto"}
            </p>
            <p className="mt-2 text-gray-600">{question.explanation}</p>
          </motion.div>
        )}

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-end"
          >
            <Button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            >
              Siguiente Pregunta
              <HiOutlineChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default QuizQuestion;
