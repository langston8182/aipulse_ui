import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, BrainCircuit, X, ChevronDown } from 'lucide-react';
import type { Article } from '../types';
import { getArticles } from '../services/articles';
import config from '../config.json';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        // Extract unique categories from articles
        const uniqueCategories = Array.from(new Set(data.map(article => article.category)));
        setCategories(uniqueCategories);
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

  // Get top 5 categories to display in dropdown
  const topCategories = categories.slice(0, 5);

  return (
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg group-hover:bg-primary-600/30 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">{config.siteTitle}</span>
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
                    className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                {isSearchFocused && searchQuery.length >= 3 && (
                    <div className="absolute mt-2 w-full bg-white rounded-xl shadow-soft border border-gray-100 max-h-[400px] overflow-y-auto">
                      {searchResults.length > 0 ? (
                          <div className="py-2">
                            {searchResults.map((article) => (
                                <button
                                    key={article._id}
                                    onClick={() => handleArticleClick(article._id)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                        src={article.imageUrl}
                                        alt=""
                                        className="w-12 h-12 object-cover rounded-lg"
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
              <nav className="hidden md:flex space-x-1">
                <a href="/" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md transition-colors duration-200">Récents</a>

                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md transition-colors duration-200">
                    <span>Catégories</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="py-2 bg-white rounded-xl shadow-soft border border-gray-100">
                      {topCategories.length > 0 ? (
                          topCategories.map((category) => (
                              <a
                                  key={category}
                                  href={`/categories?category=${encodeURIComponent(category)}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-150"
                              >
                                {category}
                              </a>
                          ))
                      ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            Chargement des catégories...
                          </div>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <a
                          href="/categories"
                          className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-gray-50 transition-colors duration-150"
                      >
                        Toutes les catégories
                      </a>
                    </div>
                  </div>
                </div>

                <a href="/about" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md transition-colors duration-200">À propos</a>
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
                  className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-full hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm transition-all duration-200"
              >
                Se connecter
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Récents</a>
                  <a href="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Catégories</a>
                  <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">À propos</a>
                  <button
                      onClick={handleSignIn}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Se connecter
                  </button>
                </div>

                {/* Mobile search */}
                <div className="px-2 pb-3">
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher des articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>

                  {isSearchFocused && searchQuery.length >= 3 && searchResults.length > 0 && (
                      <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[300px] overflow-y-auto">
                        {searchResults.map((article) => (
                            <button
                                key={article._id}
                                onClick={() => handleArticleClick(article._id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                            >
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {article.title}
                              </p>
                            </button>
                        ))}
                      </div>
                  )}
                </div>
              </div>
          )}
        </div>
      </header>
  );
}