"use client";
import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

const getVideos = async (query) => {
  try {
    const params = {
      part: "snippet",
      q: query,
      maxResults: 1,
      type: "video",
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY, // Asegúrate de que la clave esté configurada en el entorno
    };

    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, { params });
    return response.data.items;
  } catch (error) {
    console.error("Error al obtener videos de YouTube:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export default {
  getVideos,
};
