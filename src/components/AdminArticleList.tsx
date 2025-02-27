import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Article } from '../types';

interface AdminArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (articleId: string) => void;
}

export function AdminArticleList({ articles, onEdit, onDelete }: AdminArticleListProps) {
  return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Auteur</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Publié le</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Aucun article trouvé
                </td>
              </tr>
          ) : (
              articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-10 w-14 rounded overflow-hidden bg-gray-100">
                        <img
                            src={article.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{article.title}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {article.category}
                  </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{article.author}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(article)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier l'article"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onDelete(article._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer l'article"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
}