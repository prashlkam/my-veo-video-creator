import { GoogleGenAI } from '@google/genai';
import type { AspectRatio } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. The application will rely on the key selected via aistudio.openSelectKey().");
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateVideoFromImage = async (
  prompt: string,
  imageBase64: string,
  // FIX: Add mimeType parameter to handle different image formats.
  mimeType: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  // Create a new instance for each call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  console.log('Starting video generation with prompt:', prompt);

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: imageBase64,
      // FIX: Use the provided mimeType instead of a hardcoded value.
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  console.log('Video generation operation started:', operation);

  // Poll for the result
  while (operation && !operation.done) {
    await sleep(10000); // Wait 10 seconds between checks
    console.log('Polling for video generation status...');
    operation = await ai.operations.getVideosOperation({ operation: operation });
    console.log('Current operation status:', operation);
  }

  if (!operation || !operation.response?.generatedVideos?.[0]?.video?.uri) {
    throw new Error('Video generation failed or returned no result.');
  }

  const downloadLink = operation.response.generatedVideos[0].video.uri;
  console.log('Video generated. Fetching from URI:', downloadLink);

  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch video file: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  console.log('Video successfully fetched and converted to Object URL.');
  return videoUrl;
};
