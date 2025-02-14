import React, { useEffect, useState, useRef } from 'react';
import { handleAuthCallback } from '../services/auth';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const isAuthenticating = useRef(false);

  useEffect(() => {
    const authenticate = async () => {
      if (isAuthenticating.current) {
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('No authentication code provided');
        return;
      }

      try {
        isAuthenticating.current = true; // Bloque la réexécution
        await handleAuthCallback(code);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        isAuthenticating.current = true; // Ne jamais remettre à `false`
      }
    };

    authenticate();
  }, []); // ✅ Dépendances vides pour éviter plusieurs exécutions

  if (error) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
  );
}