import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, BrainCircuit, X } from 'lucide-react';
import type { Article } from '../types';
import { getArticles } from '../services/articles';
import config from '../config.json';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const results = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, articles]);

  const handleSignIn = () => {
    window.location.href = '/admin';
  };

  const handleArticleClick = (articleId: string) => {
    window.location.href = `/article/${articleId}`;
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">{config.siteTitle}</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center flex-1 justify-center px-8">
            <div ref={searchRef} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              
              {isSearchFocused && searchQuery.length >= 3 && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((article) => (
                        <button
                          key={article._id}
                          onClick={() => handleArticleClick(article._id)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={article.imageUrl}
                              alt=""
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {article.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {article.category} • {article.author}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Aucun article trouvé
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-indigo-600">Récents</a>
              <a href="/categories" className="text-gray-700 hover:text-indigo-600">Catégories</a>
              <a href="/about" className="text-gray-700 hover:text-indigo-600">À propos</a>
            </nav>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
            <button 
              onClick={handleSignIn}
              className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Récents</a>
              <a href="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Catégories</a>
              <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">À propos</a>
              <button 
                onClick={handleSignIn}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}