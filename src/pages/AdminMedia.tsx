import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Upload, Trash2, ExternalLink, AlertTriangle, Copy, Check, Image, Link } from 'lucide-react';
import { listS3Images, uploadS3Image, deleteS3Image } from '../services/images';
import { getArticles } from '../services/articles';
import type { Article, S3Image } from '../types';

export function AdminMedia() {
  const [images, setImages] = useState<S3Image[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<S3Image | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    Promise.all([fetchImages(), fetchArticles()]);
  }, []);

  const fetchImages = async () => {
    try {
      const fetchedImages = await listS3Images();
      setImages(fetchedImages);
      setLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const isImageUsed = (imageUrl: string) => {
    return articles.some(article => article.imageUrl === imageUrl);
  };

  const getArticlesUsingImage = (imageUrl: string) => {
    return articles.filter(article => {
      return article.imageUrl === imageUrl
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      console.log("files : ", files[0])
      const uploadedImage = await uploadS3Image(files[0]);
      setImages(prev => [...prev, uploadedImage]);
    } catch (error) {
      setError(`Error uploading image: ${(error as Error).message}`);
    } finally {
      setUploading(false);
      fetchImages()
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]?.type.startsWith('image/')) {
      handleFileUpload(files);
    } else {
      setError('Please drop an image file');
    }
  }, []);

  const handleDelete = (image: S3Image) => {
    if (isImageUsed(image.url)) {
      setError('Cette image est utilisée dans un ou plusieurs articles et ne peut pas être supprimée.');
      return;
    }
    setSelectedImage(image);
  };

  const confirmDelete = async () => {
    if (!selectedImage) return;

    try {
      await deleteS3Image(selectedImage.Key.split('/')[1]);
      setImages(images.filter(img => img.Key !== selectedImage.Key));
      setSelectedImage(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      setError('Failed to copy URL');
    }
  };

  const getImageName = (image: S3Image) => {
    return image.Key || 'Untitled Image';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your images</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Images</h2>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
              </div>
              <label className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors duration-200">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragging ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-300'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <Image className={`h-12 w-12 mb-4 ${
                  isDragging ? 'text-indigo-500' : 'text-gray-400'
                }`} />
                <p className="text-sm text-gray-600 mb-1">
                  {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
                </p>
                <p className="text-xs text-gray-500">
                  or use the upload button above
                </p>
              </div>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-indigo-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {images.map((image) => {
              const usedInArticles = getArticlesUsingImage(image.url);
              const isUsed = usedInArticles.length > 0;

              return (
                <div key={image.ETag} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={getImageName(image)}
                    className="w-full h-full object-cover"
                  />
                  {isUsed && (
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-1 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
                        <Link className="h-3 w-3" />
                        <span>{usedInArticles.length} article{usedInArticles.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => copyToClipboard(image.url)}
                        className="p-2 text-white hover:text-indigo-200 transition-colors duration-200"
                        title="Copy URL"
                      >
                        {copiedUrl === image.url ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-indigo-200 transition-colors duration-200"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(image)}
                        className={`text-white transition-colors duration-200 ${
                          isUsed ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-400'
                        }`}
                        disabled={isUsed}
                        title={isUsed ? 'Image utilisée dans un article' : 'Supprimer l\'image'}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Delete Image</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}