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
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleOptionSelect = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (!selectedOption || showFeedback) return;
    setIsLoading(true);
    
    // Simular un pequeño delay para mostrar el preloader
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isCorrect = selectedOption === question.correct_answer;
    setShowFeedback(true);
    setIsLoading(false);
    onAnswer(isCorrect);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Pregunta {currentQuestion} de {totalQuestions}</span>
          <span>{correctAnswers} correctas · {incorrectAnswers} incorrectas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="outline"
                className={`w-full justify-start text-left ${
                  selectedOption === option
                    ? "border-orange-500"
                    : ""
                } ${
                  showFeedback && option === question.correct_answer
                    ? "bg-green-50 border-green-500 text-green-700"
                    : showFeedback && option === selectedOption
                    ? "bg-red-50 border-red-500 text-red-700"
                    : ""
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
              >
                <div className="flex items-center w-full">
                  {showFeedback && option === question.correct_answer && (
                    <HiCheck className="mr-2 h-4 w-4 text-green-500" />
                  )}
                  {showFeedback && option === selectedOption && option !== question.correct_answer && (
                    <HiX className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  {!showFeedback && selectedOption === option && (
                    <div className="mr-2 h-4 w-4 rounded-full border-2 border-orange-500" />
                  )}
                  {option}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 p-4 rounded-lg bg-gray-50"
            >
              <p className="text-sm text-gray-600">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption || isLoading}
              className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white min-w-[160px]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </div>
              ) : (
                <>
                  Verificar Respuesta
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white"
            >
              Siguiente Pregunta
              <HiOutlineChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;
