import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AnalyticCard } from '../components/analytics/AnalyticCard';
import { TopArticles } from '../components/analytics/TopArticles';
import { Users, Eye, Share2, Globe } from 'lucide-react';
import { getAnalytics } from '../services/analytics';
import { getArticle } from '../services/articles';
import type { AnalyticsData, Article } from '../types';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topArticles, setTopArticles] = useState<Array<{
    id: string;
    title: string;
    views: number;
    change: number;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);

        // Fetch article details for top 5 articles
        const articlesDetails = await Promise.all(
            data.top5Articles.map(async (article) => {
              try {
                const details = await getArticle(article.articleId);
                return {
                  id: article.articleId,
                  title: details.title,
                  views: article.count,
                  change: 0 // Nous n'avons pas cette donnée pour le moment
                };
              } catch (error) {
                console.error(`Error fetching article ${article.articleId}:`, error);
                return {
                  id: article.articleId,
                  title: 'Article non trouvé',
                  views: article.count,
                  change: 0
                };
              }
            })
        );

        setTopArticles(articlesDetails);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error || !analytics) {
    return (
        <div className="min-h-screen bg-gray-100">
          <AdminHeader />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600">Erreur : {error || 'Impossible de charger les analytics'}</p>
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Vue d'ensemble des analytics de votre plateforme</p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <AnalyticCard
                title="Visiteurs Totaux"
                value={analytics.totalVisitors.toLocaleString()}
                icon={<Users className="h-6 w-6 text-indigo-600" />}
            />
            <AnalyticCard
                title="Articles Vus"
                value={analytics.totalArticlesSeen.toLocaleString()}
                icon={<Eye className="h-6 w-6 text-indigo-600" />}
            />
            <AnalyticCard
                title="Partages Sociaux"
                value={analytics.totalShares.total.toLocaleString()}
                icon={<Share2 className="h-6 w-6 text-indigo-600" />}
            />
            <AnalyticCard
                title="Pays Distincts"
                value={analytics.distinctCountries.toLocaleString()}
                icon={<Globe className="h-6 w-6 text-indigo-600" />}
            />
          </div>

          {/* Top Articles */}
          <div className="grid grid-cols-1 gap-6">
            <TopArticles articles={topArticles} />
          </div>
        </main>
      </div>
  );
}