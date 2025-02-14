import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminArticleList } from '../components/AdminArticleList';
import { Plus, AlertTriangle } from 'lucide-react';
import type { Article } from '../types';
import { getArticles, deleteArticle as deleteArticleApi, updateArticle } from '../services/articles';
import config from '../config.json';

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteArticle, setDeleteArticle] = useState<Article | null>(null);
  const [featuredArticleId, setFeaturedArticleId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        // Trier les articles par date de publication (du plus récent au plus ancien)
        const sortedArticles = data.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sortedArticles);
        
        // Trouver l'article mis en avant
        const featured = sortedArticles.find(article => article.featured);
        if (featured) {
          setFeaturedArticleId(featured._id);
        }
        
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCreateArticle = () => {
    window.location.href = '/admin/articles/edit';
  };

  const handleEditArticle = (article: Article) => {
    window.location.href = `/admin/articles/edit?id=${article._id}`;
  };

  const handleDeleteArticle = (articleId: string) => {
    const article = articles.find(a => a._id === articleId);
    if (article) {
      setDeleteArticle(article);
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      // Si l'article est déjà featured, on le retire
      if (article._id === featuredArticleId) {
        await updateArticle(article._id, { ...article, featured: false });
        setFeaturedArticleId(undefined);
        setArticles(articles.map(a => 
          a._id === article._id ? { ...a, featured: false } : a
        ));
      } 
      // Sinon, on retire le featured de l'ancien article et on le met sur le nouveau
      else {
        if (featuredArticleId) {
          const oldFeatured = articles.find(a => a._id === featuredArticleId);
          if (oldFeatured) {
            await updateArticle(oldFeatured._id, { ...oldFeatured, featured: false });
          }
        }
        await updateArticle(article._id, { ...article, featured: true });
        setFeaturedArticleId(article._id);
        setArticles(articles.map(a => 
          a._id === article._id ? { ...a, featured: true } : { ...a, featured: false }
        ));
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const confirmDelete = async () => {
    if (deleteArticle) {
      try {
        await deleteArticleApi(deleteArticle._id);
        setArticles(articles.filter(a => a._id !== deleteArticle._id));
        setDeleteArticle(null);
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
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
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Erreur : {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600">Gérer vos articles {config.siteTitle}</p>
          </div>
          <button
            onClick={handleCreateArticle}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvel Article</span>
          </button>
        </div>

        {/* Modal de confirmation de suppression */}
        {deleteArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Supprimer l'article</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer "{deleteArticle.title}" ? Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteArticle(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des articles */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <AdminArticleList
            articles={articles}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
            onToggleFeatured={handleToggleFeatured}
            featuredArticleId={featuredArticleId}
          />
        </div>
      </main>
    </div>
  );
}