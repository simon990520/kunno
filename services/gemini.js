import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function improveNote(noteContent, subject) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Como experto en educación y en la materia "${subject}", por favor mejora y enriquece el siguiente apunte académico. 
    Añade más detalles relevantes, ejemplos prácticos, y asegúrate de que la información sea precisa y esté bien estructurada.
    Mantén un tono académico pero comprensible.
    
    Apunte original:
    ${noteContent}
    
    Por favor, mejora este apunte manteniendo la siguiente estructura:
    1. Contenido principal (mejorado y expandido)
    2. Ejemplos prácticos
    3. Puntos clave a recordar
    4. Referencias o recursos adicionales (si aplica)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error al mejorar el apunte con Gemini:", error);
    throw new Error("No se pudo mejorar el apunte. Por favor, inténtalo de nuevo.");
  }
}
