import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { ArticleForm } from '../components/ArticleForm';
import { ArrowLeft } from 'lucide-react';
import type { ArticleFormData } from '../types';
import { getArticle, createArticle, updateArticle } from '../services/articles';

interface EditArticleProps {
  articleId: string | null;
}

export function EditArticle({ articleId }: EditArticleProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<ArticleFormData | undefined>();

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        try {
          const article = await getArticle(articleId);
          const { _id, publishedAt, ...formData } = article;
          setInitialData(formData);
        } catch (error) {
          setError((error as Error).message);
        }
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      if (articleId) {
        await updateArticle(articleId, data);
      } else {
        await createArticle(data);
      }
      window.location.href = '/admin/articles';
    } catch (error) {
      setError((error as Error).message);
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
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retour
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
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux Articles</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {articleId ? 'Modifier l\'Article' : 'Nouvel Article'}
            </h1>
            <ArticleForm
              onSubmit={handleSubmit}
              initialData={initialData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}