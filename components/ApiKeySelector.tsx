import React from 'react';
import { KeyIcon } from './Icons';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      onKeySelected();
    } catch (e) {
      console.error("Could not open API key dialog:", e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 mb-4">
          <KeyIcon />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
        <p className="text-gray-400 mb-6">
          To use the Veo video generation model, you need to select an API key. This will be used for your requests.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Select API Key
        </button>
        <p className="text-xs text-gray-500 mt-4">
          For more information on billing, visit{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            ai.google.dev/gemini-api/docs/billing
          </a>.
        </p>
      </div>
    </div>
  );
};
