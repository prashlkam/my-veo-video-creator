import React, { useState } from 'react';
import { SparklesIcon, UserIcon, LockIcon } from './Icons';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password.');
      return;
    }
    // Simple mock authentication: any non-empty username/password is valid
    setError('');
    onLoginSuccess();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4 text-indigo-400">
                <SparklesIcon />
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome to Veo Video Creator</h1>
            <p className="mt-2 text-gray-400">Sign in to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <UserIcon />
             </div>
             <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <LockIcon />
             </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
