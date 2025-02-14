import React from 'react';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import type { Article } from '../types';

interface CategoriesProps {
  articles: Article[];
}

export function Categories({ articles }: CategoriesProps) {
  const categories = Array.from(new Set(articles.map(article => article.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>

        {categories.map(category => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.category === category)
                .map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 AI News Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}