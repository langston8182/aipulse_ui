import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Clock, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SocialShare } from '../components/SocialShare';
import type { Article } from '../types';
import { Helmet } from 'react-helmet-async';
import { getArticle } from '../services/articles';

interface ArticleDetailProps {
  articleId: string;
}

export function ArticleDetail({ articleId }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(articleId);
        setArticle(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
    );
  }

  if (error || !article) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Erreur : {error || 'Article non trouvé'}</p>
            <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retour
            </button>
          </div>
        </div>
    );
  }

  const articleUrl = `${window.location.origin}/article/${article._id}`;

  return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{article.title} - AI Pulse News</title>
          <meta name="description" content={article.summary} />
          <meta name="keywords" content={`${article.category}, AI, intelligence artificielle, ${article.title}`} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.summary} />
          <meta property="og:image" content={article.imageUrl} />
          <meta property="og:url" content={articleUrl} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={article.summary} />
          <meta name="twitter:image" content={article.imageUrl} />
          <link rel="canonical" href={articleUrl} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.summary,
              "image": article.imageUrl,
              "author": {
                "@type": "Person",
                "name": article.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "AI Pulse News",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${window.location.origin}/logo.png`
                }
              },
              "datePublished": article.publishedAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": articleUrl
              }
            })}
          </script>
        </Helmet>

        <Header />

        <main className="container mx-auto px-4 py-8">
          <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux articles</span>
          </button>

          <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative w-full">
              <div className="aspect-[16/9] md:aspect-[21/9]">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                />
              </div>
              <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
                {article.category}
              </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{article.readTime} min de lecture</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <time dateTime={article.publishedAt} className="whitespace-nowrap">
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                  </time>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">Par {article.author}</span>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SocialShare
                      url={articleUrl}
                      title={article.title}
                      summary={article.summary}
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>

              <div className="prose prose-indigo max-w-none prose-img:rounded-xl prose-img:w-full prose-img:object-cover sm:prose-base md:prose-lg">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            </div>
          </article>
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