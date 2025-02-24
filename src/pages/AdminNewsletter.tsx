import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Mail, AlertTriangle, Loader, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { getNewsletterSubscribers, unsubscribeFromNewsletter } from '../services/newsletter';
import type { Subscriber } from '../types';

export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getNewsletterSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscribers();
    setRefreshing(false);
  };

  const handleUnsubscribe = async (subscriber: Subscriber) => {
    try {
      await unsubscribeFromNewsletter(subscriber.email);
      setSubscribers(subscribers.filter(s => s._id !== subscriber._id));
      setSelectedSubscriber(null);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingSubscribers = subscribers.filter(s => s.status === 'PENDING');
  const confirmedSubscribers = subscribers.filter(s => s.status === 'CONFIRMED');

  const SubscriberTable = ({ subscribers, title, icon: Icon, emptyMessage }: {
    subscribers: Subscriber[];
    title: string;
    icon: React.ElementType;
    emptyMessage: string;
  }) => (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Icon className="h-5 w-5 mr-2 text-gray-500" />
              {title}
            </h2>
            <span className="text-sm text-gray-500">
            {subscribers.length} abonné{subscribers.length !== 1 ? 's' : ''}
          </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {subscribers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{emptyMessage}</p>
              </div>
          ) : (
              subscribers.map((subscriber) => (
                  <div
                      key={subscriber._id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="text-gray-900">{subscriber.email}</span>
                          <p className="text-sm text-gray-500">
                            Inscrit le {formatDate(subscriber.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                        onClick={() => setSelectedSubscriber(subscriber)}
                        className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-700"
                    >
                      Désabonner
                    </button>
                  </div>
              ))
          )}
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
                <p className="text-gray-600">Gérer les abonnés à la newsletter</p>
              </div>
              <button
                  onClick={handleRefresh}
                  disabled={loading || refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <Loader className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Chargement des abonnés...</p>
                  </div>
                </div>
            ) : (
                <div className="space-y-8">
                  <SubscriberTable
                      subscribers={pendingSubscribers}
                      title="Abonnés en attente de confirmation"
                      icon={Clock}
                      emptyMessage="Aucun abonné en attente de confirmation"
                  />

                  <SubscriberTable
                      subscribers={confirmedSubscribers}
                      title="Abonnés confirmés"
                      icon={CheckCircle}
                      emptyMessage="Aucun abonné confirmé"
                  />
                </div>
            )}
          </div>
        </main>

        {/* Modal de confirmation */}
        {selectedSubscriber && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center space-x-3 text-red-600 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Confirmer le désabonnement</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir désabonner {selectedSubscriber.email} de la newsletter ?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setSelectedSubscriber(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={() => handleUnsubscribe(selectedSubscriber)}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Désabonner
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}