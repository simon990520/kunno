import { ref, get, set, push } from 'firebase/database';
import { realtimeDb } from '@/configs/firebaseConfig';

export async function saveQuizStats(userId, stats) {
  try {
    // Guardar estadísticas del quiz actual
    const quizStatsRef = ref(realtimeDb, `users/${userId}/quizStats`);
    const newQuizRef = push(quizStatsRef);
    await set(newQuizRef, {
      ...stats,
      timestamp: Date.now()
    });

    // Actualizar estadísticas generales
    const generalStatsRef = ref(realtimeDb, `users/${userId}/generalStats`);
    const snapshot = await get(generalStatsRef);
    const currentStats = snapshot.exists() ? snapshot.val() : {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      totalTime: 0,
      subjects: {}
    };

    // Actualizar estadísticas generales
    const updatedStats = {
      totalQuizzes: currentStats.totalQuizzes + 1,
      totalQuestions: currentStats.totalQuestions + stats.totalQuestions,
      correctAnswers: currentStats.correctAnswers + stats.correctAnswers,
      totalTime: currentStats.totalTime + (stats.averageResponseTime * stats.totalQuestions),
      lastQuizDate: new Date().toISOString(),
      subjects: { ...currentStats.subjects }
    };

    // Actualizar estadísticas por materia
    if (stats.subject) {
      if (!updatedStats.subjects[stats.subject]) {
        updatedStats.subjects[stats.subject] = {
          totalQuizzes: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          totalTime: 0
        };
      }

      updatedStats.subjects[stats.subject].totalQuizzes++;
      updatedStats.subjects[stats.subject].totalQuestions += stats.totalQuestions;
      updatedStats.subjects[stats.subject].correctAnswers += stats.correctAnswers;
      updatedStats.subjects[stats.subject].totalTime += (stats.averageResponseTime * stats.totalQuestions);
    }

    await set(generalStatsRef, updatedStats);

    return stats;
  } catch (error) {
    console.error('Error saving quiz stats:', error);
    throw error;
  }
}

export async function getQuizStats(userId) {
  try {
    const quizStatsRef = ref(realtimeDb, `users/${userId}/quizStats`);
    const snapshot = await get(quizStatsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const stats = snapshot.val();
    return Object.keys(stats).map(key => ({
      id: key,
      ...stats[key]
    }));
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    throw error;
  }
}

export async function getGeneralStats(userId) {
  try {
    const statsRef = ref(realtimeDb, `users/${userId}/generalStats`);
    const snapshot = await get(statsRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val();
  } catch (error) {
    console.error('Error getting general stats:', error);
    throw error;
  }
}

export async function getSubjectProgress(userId) {
  try {
    const generalStatsRef = ref(realtimeDb, `users/${userId}/generalStats`);
    const snapshot = await get(generalStatsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const { subjects } = snapshot.val();
    
    return Object.entries(subjects).map(([subject, stats]) => ({
      subject,
      totalQuizzes: stats.totalQuizzes,
      totalQuestions: stats.totalQuestions,
      correctAnswers: stats.correctAnswers,
      averageAccuracy: (stats.correctAnswers / stats.totalQuestions) * 100,
      averageResponseTime: stats.totalTime / stats.totalQuestions,
    }));
  } catch (error) {
    console.error('Error getting subject progress:', error);
    throw error;
  }
}

export async function getLearningStreak(userId) {
  try {
    const statsRef = ref(realtimeDb, `users/${userId}/generalStats`);
    const snapshot = await get(statsRef);
    
    if (!snapshot.exists()) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const stats = snapshot.val();
    const lastQuizDate = new Date(stats.lastQuizDate);
    const today = new Date();
    const diffDays = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));

    // Si han pasado más de 1 día, la racha se rompe
    if (diffDays > 1) {
      return { currentStreak: 0, longestStreak: stats.longestStreak || 0 };
    }

    const currentStreak = stats.currentStreak || 1;
    const longestStreak = Math.max(currentStreak, stats.longestStreak || 0);

    // Actualizar racha si es necesario
    if (diffDays === 1) {
      await set(statsRef, {
        ...stats,
        currentStreak: currentStreak + 1,
        longestStreak
      });
    }

    return { 
      currentStreak: stats.currentStreak || 0, 
      longestStreak: stats.longestStreak || 0 
    };
  } catch (error) {
    console.error('Error getting learning streak:', error);
    throw error;
  }
}
