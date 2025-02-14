import React from 'react';
import { Header } from '../components/Header';
import { CheckCircle } from 'lucide-react';
import config from '../config.json';

export function Unsubscribe() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Désinscription confirmée
                </h1>
                <p className="text-gray-600 mb-8">
                  Vous avez été désinscrit avec succès de la newsletter {config.siteTitle}. 
                  Nous ne vous enverrons plus d'emails concernant nos nouveaux articles.
                </p>
                <a
                  href="/"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 {config.siteTitle}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}