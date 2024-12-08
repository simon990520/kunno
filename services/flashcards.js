import { generateContent } from "@/configs/AiModel";

export const generateFlashcards = async (selectedSubjects, selectedNotes, userId) => {
  try {
    const content = prepareContent(selectedSubjects, selectedNotes);
    
    const prompt = `Actúa como un experto profesor y crea un conjunto de tarjetas de estudio basadas en este contenido. IMPORTANTE: Usa EXACTAMENTE el mismo idioma que está en el contenido proporcionado.

Contenido para analizar: ${content}

IMPORTANTE: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional antes o después:

{
  "flashcards": [
    {
      "front": "Concepto o término clave a aprender",
      "back": "Explicación detallada con ejemplos",
      "topic": "Tema específico",
      "difficulty": "basic|intermediate|advanced"
    }
  ]
}

Reglas para generar el contenido:
1. SIEMPRE usa el mismo idioma que está en el contenido proporcionado
2. El frente (front) debe ser un concepto clave, definición o principio importante
3. El reverso (back) debe incluir:
   - Explicación clara y detallada
   - Al menos un ejemplo práctico
   - Conexiones con otros conceptos cuando sea relevante
4. Crea al menos 10 flashcards variadas
5. Asegúrate de cubrir los conceptos más importantes
6. Incluye una mezcla de dificultades
7. Evita preguntas tipo examen, enfócate en presentar información valiosa
8. NO uses caracteres especiales que puedan romper el JSON
9. Asegúrate de que todo el contenido esté en el mismo idioma que los apuntes originales`;

    const text = await generateContent(prompt);

    // Limpiar y extraer el JSON
    let jsonStr = text.trim();
    
    // Buscar el JSON entre llaves
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}') + 1;
    
    if (start === -1 || end === -1) {
      console.error('No se encontró un objeto JSON válido en la respuesta:', text);
      throw new Error('La respuesta no contiene un JSON válido');
    }
    
    jsonStr = jsonStr.slice(start, end);

    // Intentar parsear el JSON
    let parsedFlashcards;
    try {
      parsedFlashcards = JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing JSON:', {
        error: error.message,
        jsonStr: jsonStr
      });
      throw new Error('El formato de la respuesta no es válido');
    }

    // Validar la estructura
    if (!parsedFlashcards || typeof parsedFlashcards !== 'object') {
      throw new Error('La respuesta no es un objeto JSON válido');
    }

    if (!parsedFlashcards.flashcards || !Array.isArray(parsedFlashcards.flashcards)) {
      throw new Error('La respuesta no contiene un array de flashcards válido');
    }

    if (parsedFlashcards.flashcards.length === 0) {
      throw new Error('No se generaron flashcards');
    }

    // Procesar y validar cada flashcard
    const processedFlashcards = parsedFlashcards.flashcards.map((flashcard, index) => {
      // Validar campos requeridos
      if (!flashcard.front || typeof flashcard.front !== 'string') {
        throw new Error(`Flashcard ${index + 1}: El campo 'front' es inválido`);
      }
      if (!flashcard.back || typeof flashcard.back !== 'string') {
        throw new Error(`Flashcard ${index + 1}: El campo 'back' es inválido`);
      }
      if (!flashcard.topic || typeof flashcard.topic !== 'string') {
        throw new Error(`Flashcard ${index + 1}: El campo 'topic' es inválido`);
      }

      // Validar y normalizar la dificultad
      const validDifficulties = ['basic', 'intermediate', 'advanced'];
      const difficulty = String(flashcard.difficulty || 'intermediate').toLowerCase();
      if (!validDifficulties.includes(difficulty)) {
        console.warn(`Flashcard ${index + 1}: Dificultad inválida '${difficulty}', usando 'intermediate'`);
      }

      // Crear la flashcard procesada
      return {
        id: generateId(),
        front: String(flashcard.front).trim(),
        back: String(flashcard.back).trim(),
        topic: String(flashcard.topic).trim(),
        difficulty: validDifficulties.includes(difficulty) ? difficulty : 'intermediate',
        status: 'new',
        lastReviewed: null,
        nextReview: null,
        reviewCount: 0,
        userId
      };
    });
    
    return processedFlashcards;
  } catch (error) {
    console.error('Error generando flashcards:', error);
    throw new Error(`Error al generar las flashcards: ${error.message}`);
  }
};

function prepareContent(subjects, notes) {
  return subjects.map(subject => {
    const subjectNotes = notes
      .filter(note => note.subjectId === subject.id)
      .map(note => note.content)
      .join('\\n');
    
    return `${subject.name}:\\n${subjectNotes}`;
  }).join('\\n\\n');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calculateNextReview(status, reviewCount) {
  const now = new Date();
  let nextReview = new Date(now);

  switch (status) {
    case 'new':
      nextReview.setMinutes(now.getMinutes() + 10);
      break;
    case 'reviewing':
      switch (reviewCount) {
        case 1:
          nextReview.setHours(now.getHours() + 1);
          break;
        case 2:
          nextReview.setDate(now.getDate() + 1);
          break;
        case 3:
          nextReview.setDate(now.getDate() + 3);
          break;
        case 4:
          nextReview.setDate(now.getDate() + 7);
          break;
        default:
          nextReview.setDate(now.getDate() + 14);
      }
      break;
    case 'mastered':
      nextReview.setMonth(now.getMonth() + 1);
      break;
  }

  return nextReview;
}
