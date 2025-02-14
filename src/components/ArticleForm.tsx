import React, { useState } from 'react';
import { Wand2, Eye, Edit2, Image, Link } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ArticleFormData, S3Image } from '../types';
import { listS3Images, uploadS3Image, deleteS3Image } from '../services/images';
import { callOpenAI } from '../services/openai';
import config from '../config.json';

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => void;
  initialData?: ArticleFormData;
}

const categories = config.categories;

export function ArticleForm({ onSubmit, initialData }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      category: '',
      author: 'Cyril Marchive', // Valeur par défaut
      readTime: 5
    }
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [s3Images, setS3Images] = useState<S3Image[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [suggestingReadTime, setSuggestingReadTime] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readTime' ? parseInt(value) || 0 : value
    }));
  };

  const openImageSelector = async () => {
    setLoadingImages(true);
    try {
      const images = await listS3Images();
      setS3Images(images);
      setShowImageSelector(true);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const selectImage = (image: S3Image) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: image.url
    }));
    setShowImageSelector(false);
  };

  const suggestCategory = async () => {
    try {
      setSuggestingCategory(true);
      const response = await callOpenAI(
        `Vous êtes un assistant qui catégorise les articles sur l'IA. Choisissez parmi ces catégories uniquement : ${categories.join(', ')}`,
        `Veuillez catégoriser cet article. Titre : ${formData.title}\nRésumé : ${formData.summary}\nContenu : ${formData.content}\n\nRépondez uniquement avec le nom de la catégorie, rien d'autre.`
      );
      
      const suggestedCategory = response.trim();
      if (categories.includes(suggestedCategory)) {
        setFormData(prev => ({
          ...prev,
          category: suggestedCategory
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suggestion de catégorie:', error);
      alert('Impossible de suggérer une catégorie. Veuillez réessayer ou sélectionner manuellement.');
    } finally {
      setSuggestingCategory(false);
    }
  };

  const suggestReadTime = async () => {
    try {
      setSuggestingReadTime(true);
      const response = await callOpenAI(
        "Vous êtes un assistant qui estime le temps de lecture des articles. Analysez le contenu et renvoyez uniquement un nombre représentant le temps de lecture estimé en minutes. Prenez en compte des facteurs comme la longueur du contenu, sa complexité et sa nature technique. Répondez uniquement avec le nombre, rien d'autre.",
        `Veuillez estimer le temps de lecture de cet article en minutes.\nTitre : ${formData.title}\nRésumé : ${formData.summary}\nContenu : ${formData.content}`
      );
      
      const suggestedTime = parseInt(response.trim());
      if (!isNaN(suggestedTime) && suggestedTime > 0) {
        setFormData(prev => ({
          ...prev,
          readTime: suggestedTime
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suggestion du temps de lecture:', error);
      alert('Impossible de suggérer un temps de lecture. Veuillez réessayer ou définir manuellement.');
    } finally {
      setSuggestingReadTime(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent caret-indigo-500"
          placeholder="Entrez le titre de l'article"
          required
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          value={formData.summary}
          onChange={handleChange}
          className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent caret-indigo-500 resize-y"
          placeholder="Entrez le résumé de l'article"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                !isPreviewMode 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit2 className="h-4 w-4" />
              <span>Éditer</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                isPreviewMode 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Aperçu</span>
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-gray-300">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${isPreviewMode ? '-50%' : '0'})`,
              width: '200%',
              height: '500px'
            }}
          >
            <div className="w-1/2 h-full">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-full px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 border-0 resize-none"
                placeholder="Écrivez le contenu de votre article ici (supporte le Markdown)"
                required
              />
            </div>
            <div className="w-1/2 h-full bg-white">
              <div className="h-full overflow-auto px-6 py-4 prose prose-indigo max-w-none">
                <ReactMarkdown>{formData.content || '*L\'aperçu apparaîtra ici*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent caret-indigo-500"
              placeholder="Entrez l'URL de l'image"
              required
              readOnly={!!formData.imageUrl}
            />
            {formData.imageUrl && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Effacer l'URL"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={openImageSelector}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <Image className="h-5 w-5" />
            <span>Choisir une image</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer pr-12"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={suggestCategory}
            disabled={suggestingCategory}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#0C3483] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Suggestion IA"
          >
            {suggestingCategory ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent caret-indigo-500"
          placeholder="Entrez le nom de l'auteur"
          required
        />
      </div>

      <div>
        <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">Temps de lecture (minutes)</label>
        <div className="relative">
          <input
            type="number"
            id="readTime"
            name="readTime"
            min="1"
            max="60"
            value={formData.readTime}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent caret-indigo-500 pr-12"
            required
          />
          <button
            type="button"
            onClick={suggestReadTime}
            disabled={suggestingReadTime}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#0C3483] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Suggestion IA"
          >
            {suggestingReadTime ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Enregistrer l'article
        </button>
      </div>

      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sélectionner une image</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loadingImages ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] p-4">
                {s3Images.map((image) => (
                  <button
                    key={image.ETag}
                    onClick={() => selectImage(image)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-indigo-500 focus:outline-none"
                  >
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}