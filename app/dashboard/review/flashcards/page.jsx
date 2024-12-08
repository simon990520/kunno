"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ref, get, set } from "firebase/database";
import { realtimeDb } from "@/configs/firebaseConfig";
import { generateFlashcards, calculateNextReview } from "@/services/flashcards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import FlashcardSelector from "../_components/FlashcardSelector";
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBookOpen
} from "react-icons/hi";
import { toast } from "sonner";

const FlashcardsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [flashcards, setFlashcards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({ status: '', message: '' });
  const [sessionStats, setSessionStats] = useState({
    mastered: 0,
    reviewing: 0,
    total: 0
  });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadSubjectsAndNotes();
      loadSavedFlashcards();
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

  const loadSavedFlashcards = async () => {
    try {
      const flashcardsRef = ref(realtimeDb, `users/${user.id}/flashcards`);
      const snapshot = await get(flashcardsRef);
      
      if (snapshot.exists()) {
        const savedFlashcards = snapshot.val();
        setFlashcards(savedFlashcards);
        updateSessionStats(savedFlashcards);
      }
    } catch (error) {
      console.error("Error loading flashcards:", error);
    }
  };

  const handleStartFlashcards = async (selectedSubjects, selectedNotes) => {
    setLoading(true);
    try {
      const flashcardsData = await generateFlashcards(
        selectedSubjects,
        selectedNotes,
        (progress) => setLoadingStatus(progress)
      );

      const flashcardsArray = Array.isArray(flashcardsData.flashcards) 
        ? flashcardsData.flashcards 
        : [];

      setFlashcards(flashcardsArray);
      setCurrentIndex(0);
      setIsFlipped(false);
      updateSessionStats(flashcardsArray);
      
      const flashcardsRef = ref(realtimeDb, `users/${user.id}/flashcards`);
      await set(flashcardsRef, flashcardsArray);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error("Error al generar las flashcards");
    } finally {
      setLoading(false);
      setLoadingStatus({ status: '', message: '' });
    }
  };

  const updateSessionStats = (cards) => {
    if (!Array.isArray(cards)) return;
    
    const stats = cards.reduce((acc, card) => ({
      mastered: acc.mastered + (card.status === 'mastered' ? 1 : 0),
      reviewing: acc.reviewing + (card.status === 'reviewing' ? 1 : 0),
      total: acc.total + 1
    }), { mastered: 0, reviewing: 0, total: 0 });

    setSessionStats(stats);
  };

  const handleCardStatus = async (status) => {
    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) return;

    const updatedFlashcards = [...flashcards];
    const currentCard = updatedFlashcards[currentIndex];
    
    currentCard.status = status;
    currentCard.reviewCount = (currentCard.reviewCount || 0) + 1;
    currentCard.lastReviewed = new Date().toISOString();
    currentCard.nextReview = calculateNextReview(status, currentCard.reviewCount).toISOString();

    setFlashcards(updatedFlashcards);
    updateSessionStats(updatedFlashcards);

    const flashcardsRef = ref(realtimeDb, `users/${user.id}/flashcards`);
    await set(flashcardsRef, updatedFlashcards);

    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Flashcards</h1>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
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

  if (!flashcards) {
    return <FlashcardSelector subjects={subjects} notes={notes} onStart={handleStartFlashcards} />;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <Button variant="outline" onClick={() => setFlashcards(null)}>
          Seleccionar Otro Contenido
        </Button>
      </div>

      {/* Progreso de la sesión */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Dominadas</div>
            <div className="text-2xl font-bold text-green-600">
              {sessionStats.mastered}
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">En Revisión</div>
            <div className="text-2xl font-bold text-orange-600">
              {sessionStats.reviewing}
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold">
              {sessionStats.total}
            </div>
          </div>
        </Card>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-2xl perspective">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all duration-500 min-h-[300px] ${
                isFlipped ? 'bg-blue-50' : ''
              }`}
              onClick={handleFlip}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <HiOutlineBookOpen className="w-4 h-4" />
                  <span>{currentCard.topic}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                    {currentCard.difficulty}
                  </span>
                </div>
                
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isFlipped ? 'back' : 'front'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {isFlipped ? (
                        <div className="prose prose-blue max-w-none">
                          {currentCard.back}
                        </div>
                      ) : (
                        <div className="text-xl font-medium">
                          {currentCard.front}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="text-sm text-gray-500 mt-4 text-center">
                  {isFlipped ? "Click para ver el concepto" : "Click para ver la explicación"}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <HiOutlineChevronLeft className="mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleCardStatus('reviewing')}
          >
            <HiOutlineRefresh className="mr-2" />
            Revisar
          </Button>
          <Button
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
            onClick={() => handleCardStatus('mastered')}
          >
            <HiOutlineCheck className="mr-2" />
            Dominado
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Siguiente
          <HiOutlineChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
