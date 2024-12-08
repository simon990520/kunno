import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateQuiz(subjects, notes, onProgress) {
  try {
    if (onProgress) onProgress({ status: 'starting', message: 'Iniciando generación del quiz...' });
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (onProgress) onProgress({ status: 'preparing', message: 'Preparando contenido...' });

    const prompt = `Actúa como un creador de quizzes educativo avanzado. A partir de los siguientes datos:
    - Materias seleccionadas: ${subjects.map(s => s.name).join(", ")}
    - Apuntes relacionados: ${notes.map(n => n.title).join(", ")}
    
    Genera un quiz dinámico con las siguientes características:
    - 10 preguntas (pueden ser selección múltiple, verdadero/falso o preguntas abiertas)
    - Las preguntas deben abarcar un rango de dificultad de fácil a complejo
    - Proporciona una explicación breve para cada respuesta correcta
    - Las preguntas deben estar basadas en el contenido de los apuntes proporcionados
    
    Contenido de los apuntes:
    ${notes.map(n => `${n.title}: ${n.content}`).join("\n\n")}
    
    Formato requerido para la salida (JSON):
    {
      "quiz": [
        {
          "question": "Pregunta 1",
          "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
          "correct_answer": "Opción A",
          "explanation": "Explicación de por qué esta es la respuesta correcta."
        }
      ]
    }`;

    if (onProgress) onProgress({ status: 'generating', message: 'Generando preguntas...' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (onProgress) onProgress({ status: 'processing', message: 'Procesando respuestas...' });

    // Extraer el JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo generar el quiz correctamente");
    }

    // Limpiar el texto del JSON manteniendo caracteres especiales
    let cleanJson = jsonMatch[0]
      .replace(/[\n\r\t]/g, ' ') // Reemplazar saltos de línea y tabulaciones por espacios
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();

    try {
      const quizData = JSON.parse(cleanJson);
      
      // Validar la estructura del quiz
      if (!quizData.quiz || !Array.isArray(quizData.quiz)) {
        throw new Error("El formato del quiz no es válido");
      }

      // Validar cada pregunta
      quizData.quiz = quizData.quiz.map(q => {
        if (!q.question || !Array.isArray(q.options) || !q.correct_answer || !q.explanation) {
          throw new Error("Formato de pregunta inválido");
        }
        return {
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correct_answer: q.correct_answer.trim(),
          explanation: q.explanation.trim()
        };
      });

      if (onProgress) onProgress({ status: 'completed', message: '¡Quiz generado exitosamente!' });
      return quizData;
    } catch (parseError) {
      console.error("Error parsing quiz JSON:", parseError);
      throw new Error("El formato del quiz generado no es válido");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (onProgress) onProgress({ status: 'error', message: error.message });
    throw error;
  }
}
