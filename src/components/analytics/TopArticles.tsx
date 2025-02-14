import React from 'react';
import { TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface TopArticle {
  id: string;
  title: string;
  views: number;
  change: number;
}

interface TopArticlesProps {
  articles: TopArticle[];
}

export function TopArticles({ articles }: TopArticlesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Articles</h3>
      <div className="space-y-4">
        {articles.map(article => (
          <div key={article.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Eye className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.title}</p>
                <p className="text-sm text-gray-500">{article.views.toLocaleString()} views</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${article.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {article.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-medium">{Math.abs(article.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}