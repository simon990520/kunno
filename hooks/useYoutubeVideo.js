'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { scrapeYoutubeVideo, validateYoutubeUrl, extractVideoId } from '@/services/youtube-scraper';

export function useYoutubeVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const processVideo = useCallback(async (url) => {
    if (!url) {
      setError('URL no proporcionada');
      toast.error('Por favor ingresa una URL de YouTube');
      return null;
    }

    if (!validateYoutubeUrl(url)) {
      setError('URL inválida');
      toast.error('URL de YouTube inválida');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await scrapeYoutubeVideo(url);
      if (!data) {
        throw new Error('No se pudo obtener la información del video');
      }

      setVideoData(data);
      toast.success('Video procesado exitosamente');
      return data;
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message);
      toast.error('Error al procesar el video');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetVideo = useCallback(() => {
    setVideoData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    videoData,
    error,
    processVideo,
    resetVideo
  };
}
