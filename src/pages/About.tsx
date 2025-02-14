import React, { useState } from 'react';
import { Header } from '../components/Header';
import { BrainCircuit, Mail, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { subscribeToNewsletter } from '../services/newsletter';
import config from '../config.json';

export function About() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await subscribeToNewsletter(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <BrainCircuit className="h-12 w-12 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">À propos de {config.siteTitle}</h1>
              </div>

              <div className="prose prose-indigo max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  {config.siteDescription}
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos Catégories</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {config.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
                <div className="space-y-3">
                  <a href={`mailto:${config.contactEmail}`} className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                    <Mail className="h-5 w-5" />
                    <span>{config.contactEmail}</span>
                  </a>
                  {config.adminWeb && (
                    <a 
                      href={config.adminWeb} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 group"
                    >
                      <Globe className="h-5 w-5" />
                      <span>{new URL(config.adminWeb).hostname}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {config.adminGitHub && (
                    <a 
                      href={config.adminGitHub} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 group"
                    >
                      <Github className="h-5 w-5" />
                      <span>{config.adminGitHub.replace('https://github.com/', '')}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {config.adminLinkedIn && (
                    <a 
                      href={config.adminLinkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 group"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>

                {config.allowNewsletterSubscription && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Newsletter</h2>
                    <p className="text-gray-600 mb-6">
                      Abonnez-vous à notre newsletter pour recevoir les dernières actualités et analyses sur l'intelligence artificielle.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Votre adresse email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                      
                      {success && (
                        <p className="text-sm text-green-600">
                          Merci pour votre inscription ! Vous recevrez bientôt nos actualités.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Inscription en cours...' : 'S\'abonner'}
                      </button>
                    </form>
                  </>
                )}
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