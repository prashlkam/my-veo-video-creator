import React, { useState, useEffect, useCallback } from 'react';
import { generateVideoFromImage } from './services/geminiService';
import type { AspectRatio } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';
import { ImageUpload } from './components/ImageUpload';
import { VideoPlayer } from './components/VideoPlayer';
import { LoadingIndicator } from './components/LoadingIndicator';
import { GithubIcon, SparklesIcon } from './components/Icons';
import { LoginPage } from './components/LoginPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [checkingApiKey, setCheckingApiKey] = useState<boolean>(true);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  // FIX: Add state to store the MIME type of the uploaded image.
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    } catch (e) {
      console.error("Error checking API key:", e);
      setApiKeySelected(false);
    } finally {
      setCheckingApiKey(false);
    }
  }, []);

  useEffect(() => {
    // Only check for API key if the user is authenticated
    if (isAuthenticated) {
      checkApiKey();
    }
  }, [isAuthenticated, checkApiKey]);

  const handleImageSelect = (file: File | null) => {
    if (file) {
      // FIX: Store the MIME type from the file object.
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64((reader.result as string).split(',')[1]);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64(null);
      setImagePreview(null);
      // FIX: Clear the MIME type when the image is removed.
      setImageMimeType(null);
    }
  };

  const handleGenerateVideo = async () => {
    // FIX: Include imageMimeType in the check to ensure an image has been fully processed.
    if (!prompt || !imageBase64 || !imageMimeType) {
      setError('Please provide an image and a creative prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const fullPrompt = `Creative prompt: ${prompt}. Dialogue/Action context: ${transcript}`;
      // FIX: Pass the dynamic MIME type to the video generation service.
      const videoUrl = await generateVideoFromImage(fullPrompt, imageBase64, imageMimeType, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (e: any) {
      console.error('Video generation failed:', e);
      const errorMessageString = e.message || '';
      let displayMessage;

      if (errorMessageString.includes("exceeded your current quota") || errorMessageString.includes("RESOURCE_EXHAUSTED")) {
          displayMessage = "You have exceeded your API quota. Please check your plan and billing details. For more info, visit ai.google.dev/gemini-api/docs/rate-limits";
      } else if (errorMessageString.includes("Requested entity was not found.")) {
          displayMessage = "Your API key is invalid or not found. Please select a valid key.";
          setApiKeySelected(false); // Force re-selection of the key
      } else {
          displayMessage = errorMessageString || "An unknown error occurred during video generation. Please try again.";
      }
      
      setError(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  
  if (checkingApiKey) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingIndicator message="Verifying API Key..."/>
        </div>
      );
  }

  if (!apiKeySelected) {
    return <ApiKeySelector onKeySelected={async () => {
        // Assume key selection is successful and re-check
        await new Promise(resolve => setTimeout(resolve, 500)); // give time for the dialog to close
        await checkApiKey();
    }} />;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="w-full p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SparklesIcon/> Veo Video Creator
        </h1>
        <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon />
        </a>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="flex flex-col gap-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <ImageUpload onImageSelect={handleImageSelect} imagePreviewUrl={imagePreview} />
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Creative Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., The person is standing on a futuristic city rooftop at night, with rain and neon lights."
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="transcript" className="block text-sm font-medium text-gray-300 mb-2">Transcript / Actions</label>
              <textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="e.g., 'I've been waiting for you.' The character looks up towards the sky."
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows={3}
              />
               <p className="text-xs text-gray-500 mt-1">This guides the character's actions in the silent video.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
              <div className="flex gap-2">
                {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {ratio === '16:9' ? 'Landscape' : 'Portrait'} ({ratio})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={isLoading || !prompt || !imageBase64}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
              <SparklesIcon />
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex items-center justify-center min-h-[400px] lg:min-h-0">
            {isLoading && <LoadingIndicator />}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md text-center">{error}</div>}
            {!isLoading && !error && generatedVideoUrl && <VideoPlayer src={generatedVideoUrl} />}
            {!isLoading && !error && !generatedVideoUrl && (
              <div className="text-center text-gray-500">
                <p className="text-lg">Your generated video will appear here.</p>
                <p className="text-sm">Fill out the form and click "Generate Video".</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
