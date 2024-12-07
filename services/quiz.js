import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateQuiz(subjects, notes) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extraer el JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo generar el quiz correctamente");
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
