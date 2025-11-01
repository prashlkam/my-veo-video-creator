import React, { useState, useEffect } from 'react';

const loadingMessages = [
  'Warming up the digital director...',
  'Composing the perfect shot...',
  'Rendering pixels into motion...',
  'This can take a few minutes, please wait...',
  'Applying cinematic magic...',
  'Almost there, the final cut is being prepared...'
];

interface LoadingIndicatorProps {
    message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0]);

  useEffect(() => {
    if (message) {
        setCurrentMessage(message);
        return;
    }
    const interval = setInterval(() => {
      setCurrentMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-lg font-semibold text-gray-300">{currentMessage}</p>
    </div>
  );
};
