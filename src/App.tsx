import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { FeaturedArticle } from './components/FeaturedArticle';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import { AdminArticles } from './pages/AdminArticles';
import AdminSettings from './pages/AdminSettings';
import { AdminMedia } from './pages/AdminMedia';
import { AdminNewsletter } from './pages/AdminNewsletter';
import { EditArticle } from './pages/EditArticle';
import { ArticleDetail } from './pages/ArticleDetail';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import { SearchResults } from './pages/SearchResults';
import { Unsubscribe } from './pages/Unsubscribe';
import { NewsletterConfirm } from './pages/NewsletterConfirm';
import { AuthCallback } from './pages/AuthCallback';
import { Pagination } from './components/Pagination';
import { redirectToLogin } from './services/auth';
import { initAnalytics } from './services/analytics';
import { extractIdFromSlug } from './utils/slug';
import type { Article } from './types';
import { getArticles } from './services/articles';
import config from './config.json';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = config.articlesPerPage || 6;

  useEffect(() => {
    // Initialise le suivi analytics
    initAnalytics();

    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        const sortedArticles = data.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q');

  // Redirection vers AWS Login si on accède à /admin
  useEffect(() => {
    if (path === '/admin') {
      redirectToLogin();
    }
  }, [path]);

  // Admin routes
  if (path.startsWith('/admin/')) {
    // Protéger toutes les routes admin
    if (path === '/admin/articles') {
      return <ProtectedRoute><AdminArticles /></ProtectedRoute>;
    }
    if (path === '/admin/articles/edit') {
      const articleId = searchParams.get('id');
      return <ProtectedRoute><EditArticle articleId={articleId} /></ProtectedRoute>;
    }
    if (path === '/admin/media') {
      return <ProtectedRoute><AdminMedia /></ProtectedRoute>;
    }
    if (path === '/admin/newsletter') {
      return <ProtectedRoute><AdminNewsletter /></ProtectedRoute>;
    }
    if (path === '/admin/settings') {
      return <ProtectedRoute><AdminSettings /></ProtectedRoute>;
    }
    if (path === '/admin/dashboard') {
      return <ProtectedRoute><AdminDashboard /></ProtectedRoute>;
    }
  }

  // Route de callback
  if (path === '/auth/callback') {
    return <AuthCallback />;
  }

  // Public routes
  if (path.startsWith('/article/')) {
    const slug = path.split('/')[2];
    const articleId = extractIdFromSlug(slug);
    return <ArticleDetail articleId={articleId} />;
  }

  if (path === '/categories') {
    return <Categories articles={articles} />;
  }

  if (path === '/about') {
    return <About />;
  }

  if (path === '/search' && query) {
    return <SearchResults query={query} articles={articles} />;
  }

  if (path === '/unsubscribe') {
    return <Unsubscribe />;
  }

  if (path === '/newsletter/confirm') {
    return <NewsletterConfirm />;
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-xl"></div>
              <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent"></div>
            </div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">Erreur : {error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full hover:from-primary-700 hover:to-primary-600 transition-colors duration-200 shadow-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
    );
  }

  // Calculate pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(1).slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil((articles.length - 1) / articlesPerPage);

  return (
      <HelmetProvider>
        <Helmet>

            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="AI Pulse News - Votre source d'actualités sur l'intelligence artificielle, le machine learning et les technologies émergentes." />
            <meta name="keywords" content="AI, intelligence artificielle, machine learning, deep learning, actualités tech, IA" />
            <meta name="author" content="AI Pulse News" />
            <meta name="robots" content="index, follow" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://aipulsenews.com/" />
            <meta property="og:title" content="AI Pulse News - Actualités IA" />
            <meta property="og:description" content="Découvrez les dernières actualités et analyses sur l'intelligence artificielle et les technologies émergentes." />
            <meta property="og:image" content="https://aipulsenews.com/og-image.jpg" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://aipulsenews.com/" />
            <meta property="twitter:title" content="AI Pulse News - Actualités IA" />
            <meta property="twitter:description" content="Découvrez les dernières actualités et analyses sur l'intelligence artificielle et les technologies émergentes." />
            <meta property="twitter:image" content="https://aipulsenews.com/og-image.jpg" />
            <title>AI Pulse News - Actualités IA</title>
        </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero section with featured article */}
          {articles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="mr-3 relative">
                    <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">À la une</h1>
                </div>
                <FeaturedArticle article={articles[0]} />
              </section>
          )}

          {/* Latest articles section */}
          <section>
            <div className="flex items-center mb-6">
              <div className="mr-3 relative">
                <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Derniers Articles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          </section>
        </main>

        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg"></div>
                  <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">{config.siteTitle}</span>
              </div>
              <div className="flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Accueil</a>
                <a href="/categories" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Catégories</a>
                <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">À propos</a>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="text-center text-gray-500 text-sm">
                <p>© 2025 {config.siteTitle}. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      </HelmetProvider>
  );
}

export default App;