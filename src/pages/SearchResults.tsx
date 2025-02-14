import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import type { Article } from '../types';
import { getArticles } from '../services/articles';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Erreur : {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const searchResults = articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.summary.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Résultats pour "{query}"
        </h1>
        <p className="text-gray-600 mb-8">
          {searchResults.length} {searchResults.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>

        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun article ne correspond à votre recherche.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 AI Pulse News. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}