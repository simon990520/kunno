"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ref, get } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { toast } from "sonner";
import { generateQuiz } from "@/services/quiz";
import QuizSelector from "../_components/QuizSelector";
import QuizQuestion from "../_components/QuizQuestion";
import QuizSummary from "../_components/QuizSummary";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const QuizPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState({ correctAnswers: 0, incorrectAnswers: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({ status: '', message: '' });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadSubjectsAndNotes();
    }
  }, [user]);

  const loadSubjectsAndNotes = async () => {
    try {
      const subjectsRef = ref(realtimeDb, 'subjects');
      const snapshot = await get(subjectsRef);
      
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const subjectsList = [];
        const notesList = [];

        Object.entries(subjectsData).forEach(([id, data]) => {
          subjectsList.push({ id, ...data });
          if (data.notes) {
            Object.entries(data.notes).forEach(([noteId, noteData]) => {
              notesList.push({
                id: noteId,
                subjectId: id,
                ...noteData
              });
            });
          }
        });

        setSubjects(subjectsList);
        setNotes(notesList);
      }
    } catch (error) {
      console.error("Error loading subjects and notes:", error);
      toast.error("Error al cargar las materias y apuntes");
    }
  };

  const handleStartQuiz = async (selectedSubjects, selectedNotes) => {
    setLoading(true);
    try {
      const quizData = await generateQuiz(
        selectedSubjects, 
        selectedNotes,
        (progress) => setLoadingStatus(progress)
      );
      setQuiz(quizData.quiz);
      setCurrentQuestionIndex(0);
      setResults({ correctAnswers: 0, incorrectAnswers: 0 });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Error al generar el quiz");
    } finally {
      setLoading(false);
      setLoadingStatus({ status: '', message: '' });
    }
  };

  const handleAnswer = (isCorrect) => {
    setResults(prev => ({
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1)
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setResults({ correctAnswers: 0, incorrectAnswers: 0 });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quiz Dinámico</h1>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
            </div>
            <h2 className="text-lg font-medium">{loadingStatus.message}</h2>
            <div className="w-full max-w-md">
              <Progress 
                value={
                  loadingStatus.status === 'starting' ? 20 :
                  loadingStatus.status === 'preparing' ? 40 :
                  loadingStatus.status === 'generating' ? 60 :
                  loadingStatus.status === 'processing' ? 80 :
                  loadingStatus.status === 'completed' ? 100 : 0
                } 
                className="h-2"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quiz Dinámico</h1>
        <QuizSelector
          subjects={subjects}
          notes={notes}
          onStart={handleStartQuiz}
        />
      </div>
    );
  }

  if (currentQuestionIndex >= quiz.length) {
    return (
      <div className="p-6">
        <QuizSummary results={results} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <QuizQuestion
        question={quiz[currentQuestionIndex]}
        onAnswer={(isCorrect) => {
          handleAnswer(isCorrect);
          setTimeout(handleNextQuestion, 2000);
        }}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={quiz.length}
        correctAnswers={results.correctAnswers}
        incorrectAnswers={results.incorrectAnswers}
      />
    </div>
  );
};

export default QuizPage;
