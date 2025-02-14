import React, { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Save, Globe, Mail, LayoutList, Users, MessageSquare, Newspaper, Tag, Plus, X, Github, Linkedin } from 'lucide-react';
import { saveParameters } from '../services/parameters';
import config from '../config.json';

interface Settings {
  articlesPerPage: number;
  featuredArticles: number;
  allowComments: boolean;
  allowNewsletterSubscription: boolean;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  categories: string[];
  adminWeb: string;
  adminGitHub: string;
  adminLinkedIn: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(config);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
          ? value === '' ? prev[name as keyof Settings] : Math.max(0, parseInt(value) || 0)
        : value
    }));
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      setCategoryError('La catégorie ne peut pas être vide');
      return;
    }

    if (settings.categories.includes(newCategory.trim())) {
      setCategoryError('Cette catégorie existe déjà');
      return;
    }

    setSettings(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()]
    }));
    setNewCategory('');
    setCategoryError(null);
  };

  const removeCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Convert settings to Parameter array format
      const parameters = [
        { name: 'articlesPerPage', value: settings.articlesPerPage.toString() },
        { name: 'featuredArticles', value: settings.featuredArticles.toString() },
        { name: 'allowComments', value: settings.allowComments.toString() },
        { name: 'allowNewsletterSubscription', value: settings.allowNewsletterSubscription.toString() },
        { name: 'siteTitle', value: settings.siteTitle },
        { name: 'siteDescription', value: settings.siteDescription },
        { name: 'contactEmail', value: settings.contactEmail },
        { name: 'categories', value: JSON.stringify(settings.categories) },
        { name: 'adminWeb', value: settings.adminWeb },
        { name: 'adminGitHub', value: settings.adminGitHub },
        { name: 'adminLinkedIn', value: settings.adminLinkedIn }
      ];

      await saveParameters(parameters);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure your AI Pulse News website</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-gray-500" />
                  Site Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    placeholder="Enter site title"
                  />
                </div>
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 resize-none"
                    placeholder="Enter site description"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="adminWeb" className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      id="adminWeb"
                      name="adminWeb"
                      value={settings.adminWeb}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="adminGitHub" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      id="adminGitHub"
                      name="adminGitHub"
                      value={settings.adminGitHub}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="adminLinkedIn" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      id="adminLinkedIn"
                      name="adminLinkedIn"
                      value={settings.adminLinkedIn}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Management */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-gray-500" />
                  Categories Management
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                        placeholder="Add a new category"
                      />
                      {categoryError && (
                        <p className="mt-1 text-sm text-red-600">{categoryError}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addCategory}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {settings.categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full group hover:bg-gray-200"
                    >
                      <span className="text-sm text-gray-700">{category}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <LayoutList className="h-5 w-5 mr-2 text-gray-500" />
                  Content Display
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="articlesPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                      Articles per Page
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="articlesPerPage"
                        name="articlesPerPage"
                        min="1"
                        max="24"
                        value={settings.articlesPerPage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="featuredArticles" className="block text-sm font-medium text-gray-700 mb-1">
                      Featured Articles
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="featuredArticles"
                        name="featuredArticles"
                        min="0"
                        max="5"
                        value={settings.featuredArticles}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  Features
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Comments</p>
                      <p className="text-sm text-gray-500">Allow users to comment on articles</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowComments"
                      checked={settings.allowComments}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <div className="flex items-center space-x-3">
                    <Newspaper className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Newsletter</p>
                      <p className="text-sm text-gray-500">Enable newsletter subscription</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowNewsletterSubscription"
                      checked={settings.allowNewsletterSubscription}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end space-x-4 sticky bottom-6">
              <div className="bg-white px-6 py-4 rounded-xl shadow-sm flex items-center justify-end space-x-4 w-full">
                {error && (
                  <span className="text-red-600 font-medium">{error}</span>
                )}
                {saved && (
                  <span className="text-green-600 font-medium flex items-center">
                    <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Settings saved successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}