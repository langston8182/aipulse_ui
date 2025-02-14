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
import { AuthCallback } from './pages/AuthCallback';
import { Pagination } from './components/Pagination';
import { redirectToLogin } from './services/auth';
import type { Article } from './types';
import { getArticles } from './services/articles';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
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
  const articleId = searchParams.get('id');

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
    const articleId = path.split('/')[2];
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

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Erreur : {error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {articles.length > 0 && (
              <section className="mb-12">
                <FeaturedArticle article={articles[0]} />
              </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Derniers Articles</h2>
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
            <div className="text-center text-gray-600">
              <p>© 2024 AI Pulse News. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;