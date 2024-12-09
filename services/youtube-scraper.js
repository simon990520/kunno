export async function scrapeYoutubeVideo(url) {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }

    const data = await response.json();
    
    return {
      title: data.title,
      description: data.title, // oEmbed no proporciona descripción
      channelName: data.author_name,
      thumbnail: data.thumbnail_url,
      videoId,
      url: url
    };
  } catch (error) {
    console.error('Error scraping YouTube video:', error);
    throw new Error('Failed to scrape YouTube video');
  }
}

export function validateYoutubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
}

export function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    let videoId = '';

    if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    } else {
      videoId = urlObj.searchParams.get('v');
    }

    return videoId;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
}
