import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Clock, ArrowLeft, Calendar, User } from 'lucide-react';
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-xl"></div>
              <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent"></div>
            </div>
            <p className="mt-4 text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
    );
  }

  if (error || !article) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">Erreur : {error || 'Article non trouvé'}</p>
            <button
                onClick={handleBack}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full hover:from-primary-700 hover:to-primary-600 transition-colors duration-200 shadow-sm"
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
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Retour aux articles</span>
          </button>

          <article className="max-w-4xl mx-auto">
            {/* Article header */}
            <div className="mb-8">
              <div className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-sm mb-4">
                {article.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary-500" />
                  <span>Par {article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                  </time>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary-500" />
                  <span>{article.readTime} min de lecture</span>
                </div>
              </div>
              <div className="flex justify-start md:justify-end mb-6">
                <SocialShare
                    url={articleUrl}
                    title={article.title}
                    summary={article.summary}
                />
              </div>
            </div>

            {/* Featured image with skeleton loader */}
            <div className="relative w-full mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-[21/9] relative">
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    loading="eager"
                />
              </div>
            </div>

            {/* Article content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </article>
        </main>

        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-lg"></div>
                  <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">AI Pulse News</span>
              </div>
              <div className="flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Accueil</a>
                <a href="/categories" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Catégories</a>
                <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">À propos</a>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="text-center text-gray-500 text-sm">
                <p>© 2025 AI Pulse News. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}