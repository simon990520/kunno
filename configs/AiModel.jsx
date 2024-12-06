/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY no está configurada en el archivo .env.local');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
};

const courseLayoutChat = model.startChat({
  generationConfig,
});

const chapterContentChat = model.startChat({
  generationConfig,
});

export const GenerateCourseLayoutAI = {
  async sendMessage(prompt) {
    try {
      const msg = {
        contents: [{
          role: "user",
          parts: [{
            text: `
              Genera un curso educativo con la siguiente información:
              ${prompt}

              El resultado debe ser un objeto JSON con esta estructura exacta:
              {
                "course": {
                  "name": "Nombre del Curso",
                  "description": "Descripción detallada del curso",
                  "chapters": [
                    {
                      "name": "Nombre del Capítulo",
                      "about": "Descripción del capítulo",
                      "duration": "30"
                    }
                  ]
                }
              }
            `
          }]
        }]
      };

      const result = await courseLayoutChat.sendMessage(msg.contents[0].parts[0].text);
      return result;
    } catch (error) {
      console.error("Error en GenerateCourseLayoutAI:", error);
      throw error;
    }
  }
};

export const GenerateChapterContent_AI = {
  async sendMessage(prompt) {
    try {
      const msg = {
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }]
      };

      const result = await chapterContentChat.sendMessage(msg.contents[0].parts[0].text);
      return result;
    } catch (error) {
      console.error("Error en GenerateChapterContent_AI:", error);
      throw error;
    }
  }
};