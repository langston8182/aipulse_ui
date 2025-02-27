import React from 'react';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import type { Article } from '../types';
import { slugify } from '../utils/slug';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const handleReadArticle = () => {
    const slug = `${slugify(article.title)}-${article._id}`;
    window.location.href = `/article/${slug}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
      <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-accent-500/5 pointer-events-none"></div>
        <div className="lg:flex">
          <div className="lg:w-1/2 relative overflow-hidden">
            <div className="aspect-video lg:aspect-auto lg:h-full">
              <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-sm">
              {article.category}
            </span>
            </div>
          </div>
          <div className="lg:w-1/2 p-6 lg:p-8">
            <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-primary-500" />
                <span>{article.readTime} min de lecture</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary-500" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h2>

            <p className="text-gray-600 mb-6">
              {article.summary}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {article.author.charAt(0)}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Par {article.author}
                </p>
              </div>
              <button
                  onClick={handleReadArticle}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full hover:from-primary-700 hover:to-primary-600 transition-colors duration-200 shadow-sm group"
              >
                <span className="text-sm font-medium">Lire l'article</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}