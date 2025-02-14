import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const handleReadMore = () => {
    window.location.href = `/article/${article._id}`;
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" itemScope itemType="http://schema.org/Article">
      <meta itemProp="datePublished" content={article.publishedAt} />
      <meta itemProp="author" content={article.author} />
      
      <div className="relative h-48 w-full">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          itemProp="image"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <Clock className="h-4 w-4" />
          <span>{article.readTime} min de lecture</span>
          <span>•</span>
          <time dateTime={article.publishedAt} itemProp="datePublished">
            {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
          </time>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2" itemProp="headline">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2" itemProp="description">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900" itemProp="author">
            Par {article.author}
          </div>
          <button 
            onClick={handleReadMore}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            aria-label={`Lire l'article : ${article.title}`}
          >
            <span className="text-sm font-medium">Lire la suite</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}