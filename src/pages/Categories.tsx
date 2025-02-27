import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { Helmet } from 'react-helmet-async';
import type { Article } from '../types';
import config from '../config.json';

interface CategoriesProps {
    articles: Article[];
}

export function Categories({ articles }: CategoriesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

    // Extract unique categories from articles
    const categories = Array.from(new Set(articles.map(article => article.category)));

    useEffect(() => {
        // Check URL for category parameter
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');

        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, []);

    useEffect(() => {
        // Filter articles based on selected category
        if (selectedCategory) {
            setFilteredArticles(articles.filter(article => article.category === selectedCategory));
        } else {
            setFilteredArticles(articles);
        }
    }, [selectedCategory, articles]);

    const handleCategoryClick = (category: string) => {
        // Update URL with selected category
        const url = new URL(window.location.href);
        url.searchParams.set('category', category);
        window.history.pushState({}, '', url);

        setSelectedCategory(category);
    };

    const handleShowAll = () => {
        // Remove category parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('category');
        window.history.pushState({}, '', url);

        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Catégories - {config.siteTitle}</title>
                <meta name="description" content={`Explorez les articles par catégorie sur ${config.siteTitle}`} />
            </Helmet>

            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Catégories</h1>

                {/* Category filters */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleShowAll}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                selectedCategory === null
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Toutes les catégories
                        </button>

                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    selectedCategory === category
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedCategory ? (
                    // Display articles for selected category
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedCategory}</h2>
                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map(article => (
                                    <ArticleCard key={article._id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-600">Aucun article trouvé dans cette catégorie.</p>
                            </div>
                        )}
                    </section>
                ) : (
                    // Display all categories with their articles
                    <>
                        {categories.map(category => {
                            const categoryArticles = articles.filter(article => article.category === category);

                            return categoryArticles.length > 0 ? (
                                <section key={category} className="mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryArticles.map(article => (
                                            <ArticleCard key={article._id} article={article} />
                                        ))}
                                    </div>
                                </section>
                            ) : null;
                        })}
                    </>
                )}
            </main>

            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-gray-600">
                        <p>© 2025 {config.siteTitle}. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}