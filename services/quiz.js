import { generateContent } from "@/configs/AiModel";

export const generateQuiz = async (selectedSubjects, selectedNotes, onProgress) => {
  try {
    onProgress({ status: 'starting', message: 'Iniciando generación del quiz...' });
    
    // Preparar el contenido para el modelo
    const content = prepareContent(selectedSubjects, selectedNotes);
    
    onProgress({ status: 'preparing', message: 'Preparando el contenido...' });
    
    onProgress({ status: 'generating', message: 'Generando preguntas inteligentes...' });
    
    const prompt = `Actúa como un generador de quizzes y crea un quiz con 10 preguntas basado en este contenido: ${content}

IMPORTANTE: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional antes o después:

{
  "quiz": [
    {
      "question": "Pregunta clara y concisa",
      "options": [
        "Primera opción",
        "Segunda opción",
        "Tercera opción",
        "Cuarta opción"
      ],
      "correct_answer": "Opción correcta (debe ser exactamente igual a una de las opciones)",
      "explanation": "Explicación breve de por qué esta es la respuesta correcta"
    }
  ]
}

Reglas:
1. Devuelve SOLO el JSON, sin texto adicional
2. Asegúrate que correct_answer sea EXACTAMENTE igual a una de las options
3. Usa preguntas claras y concisas
4. Incluye 4 opciones para cada pregunta
5. Evita caracteres especiales o símbolos que puedan romper el JSON
6. La explicación debe ser breve pero informativa`;

    const text = await generateContent(prompt);
    
    onProgress({ status: 'processing', message: 'Procesando las respuestas...' });

    // Buscar el JSON en la respuesta
    let jsonStr = text;
    
    // Si hay texto adicional, intentar extraer solo el JSON
    if (text.includes('{') && text.includes('}')) {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}') + 1;
      jsonStr = text.slice(start, end);
    }

    // Intentar parsear el JSON
    let parsedQuiz;
    try {
      parsedQuiz = JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing JSON:', jsonStr);
      throw new Error('El formato de la respuesta no es válido');
    }

    // Validar la estructura del quiz
    if (!parsedQuiz.quiz || !Array.isArray(parsedQuiz.quiz)) {
      throw new Error('Estructura del quiz inválida');
    }

    // Validar y limpiar cada pregunta
    parsedQuiz.quiz = parsedQuiz.quiz.map(question => {
      // Validar que todos los campos requeridos existen
      if (!question.question || !question.options || !question.correct_answer || !question.explanation) {
        throw new Error('Pregunta incompleta en el quiz');
      }

      // Validar que hay exactamente 4 opciones
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error('Cada pregunta debe tener exactamente 4 opciones');
      }

      // Validar que la respuesta correcta está en las opciones
      if (!question.options.includes(question.correct_answer)) {
        throw new Error('La respuesta correcta debe ser una de las opciones');
      }

      return {
        question: String(question.question).trim(),
        options: question.options.map(opt => String(opt).trim()),
        correct_answer: String(question.correct_answer).trim(),
        explanation: String(question.explanation).trim()
      };
    });

    onProgress({ status: 'completed', message: '¡Quiz listo!' });
    
    return parsedQuiz;
  } catch (error) {
    console.error('Error generando el quiz:', error);
    throw new Error('Error al generar el quiz. Por favor, intenta de nuevo.');
  }
};

function prepareContent(subjects, notes) {
  // Combinar la información de las materias y notas seleccionadas
  const content = subjects.map(subject => {
    const subjectNotes = notes
      .filter(note => note.subjectId === subject.id)
      .map(note => note.content)
      .join('\\n');
    
    return `${subject.name}:\\n${subjectNotes}`;
  }).join('\\n\\n');

  return content;
}
