import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import type { Article } from '../types';
import { slugify } from '../utils/slug';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const handleReadMore = () => {
    const slug = `${slugify(article.title)}-${article._id}`;
    window.location.href = `/article/${slug}`;
  };

  return (
      <article
          className="bg-white rounded-xl shadow-sm overflow-hidden card-hover hover-glow"
          itemScope
          itemType="http://schema.org/Article"
      >
        <meta itemProp="datePublished" content={article.publishedAt} />
        <meta itemProp="author" content={article.author} />

        <div className="relative w-full">
          <div className="aspect-[16/9] overflow-hidden">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                itemProp="image"
                loading="lazy"
            />
          </div>
          <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-sm">
            {article.category}
          </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-primary-500" />
              <span>{article.readTime} min de lecture</span>
            </div>
            <span>•</span>
            <time dateTime={article.publishedAt} itemProp="datePublished" className="whitespace-nowrap">
              {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
            </time>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200" itemProp="headline">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2" itemProp="description">
            {article.summary}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm font-medium text-gray-900" itemProp="author">
              Par {article.author}
            </div>
            <button
                onClick={handleReadMore}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 group"
                aria-label={`Lire l'article : ${article.title}`}
            >
              <span className="text-sm font-medium">Lire la suite</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </article>
  );
}