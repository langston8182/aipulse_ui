import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import type { Article } from '../types';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const handleReadArticle = () => {
    window.location.href = `/article/${article._id}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="lg:flex">
        <div className="lg:w-1/2">
          <div className="h-[400px] w-full">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="lg:w-1/2 p-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min de lecture</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h2>
          
          <p className="text-gray-600 mb-6 line-clamp-3">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Par {article.author}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </p>
              </div>
            </div>
            <button 
              onClick={handleReadArticle}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              <span className="text-sm font-medium">Lire la suite</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}