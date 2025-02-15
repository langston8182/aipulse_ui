import type { Article, ArticleFormData } from '../types';
import { sendNewArticleNotification } from './email';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    throw new Error('Impossible de récupérer les articles');
  }
}

export async function getArticle(id: string): Promise<Article> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    throw new Error('Impossible de récupérer l\'article');
  }
}

export async function createArticle(article: ArticleFormData): Promise<Article> {
  try {
    const articleWithDate = {
      ...article,
      publishedAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleWithDate),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const createdArticle = await response.json();

    // Notify subscribers
    await sendNewArticleNotification(createdArticle);

    return createdArticle;
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    throw new Error('Impossible de créer l\'article');
  }
}

export async function updateArticle(id: string, article: ArticleFormData): Promise<Article> {
  try {
    const articleWithDate = {
      ...article,
      publishedAt: new Date().toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleWithDate),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw new Error('Impossible de mettre à jour l\'article');
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw new Error('Impossible de supprimer l\'article');
  }
}