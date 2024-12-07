"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheck, HiX } from "react-icons/hi";

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
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleOptionSelect = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || showFeedback) return;
    const isCorrect = selectedOption === question.correct_answer;
    setShowFeedback(true);
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
              >
                {showFeedback && option === question.correct_answer && (
                  <HiCheck className="mr-2 h-4 w-4 text-green-500" />
                )}
                {showFeedback && option === selectedOption && option !== question.correct_answer && (
                  <HiX className="mr-2 h-4 w-4 text-red-500" />
                )}
                {option}
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
              disabled={!selectedOption}
              className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white"
            >
              Verificar Respuesta
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#FF5F13] to-[#FBB041] text-white"
            >
              Siguiente Pregunta
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;
