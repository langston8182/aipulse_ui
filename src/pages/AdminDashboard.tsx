import React from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AnalyticCard } from '../components/analytics/AnalyticCard';
import { LineChart } from '../components/analytics/LineChart';
import { TopArticles } from '../components/analytics/TopArticles';
import { Users, Eye, Share2, Search, Globe, Clock } from 'lucide-react';

// Mock analytics data
const visitsData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 1000) + 500
}));

const searchImpressions = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 500) + 200
}));

const topArticles = [
  {
    id: '1',
    title: 'The Future of Large Language Models: Beyond GPT-4',
    views: 12500,
    change: 23
  },
  {
    id: '2',
    title: "Quantum Computing's Impact on AI: A New Frontier",
    views: 8900,
    change: 15
  },
  {
    id: '3',
    title: 'Ethical Considerations in AI Development',
    views: 7200,
    change: -5
  },
  {
    id: '4',
    title: 'Neural Networks in Computer Vision: 2024 Advances',
    views: 6800,
    change: 8
  },
  {
    id: '5',
    title: 'AI in Healthcare: Revolutionizing Medical Diagnosis',
    views: 5900,
    change: 12
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Analytics overview of your AI Pulse News platform</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticCard
            title="Total Visitors"
            value="25.4K"
            change={12}
            icon={<Users className="h-6 w-6 text-indigo-600" />}
          />
          <AnalyticCard
            title="Page Views"
            value="98.2K"
            change={8}
            icon={<Eye className="h-6 w-6 text-indigo-600" />}
          />
          <AnalyticCard
            title="Social Shares"
            value="3.2K"
            change={-3}
            icon={<Share2 className="h-6 w-6 text-indigo-600" />}
          />
          <AnalyticCard
            title="Search Impressions"
            value="45.8K"
            change={15}
            icon={<Search className="h-6 w-6 text-indigo-600" />}
          />
          <AnalyticCard
            title="Avg. Time on Site"
            value="4:32"
            change={5}
            icon={<Clock className="h-6 w-6 text-indigo-600" />}
          />
          <AnalyticCard
            title="Global Reach"
            value="82 countries"
            change={3}
            icon={<Globe className="h-6 w-6 text-indigo-600" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart
            data={visitsData}
            title="Daily Visitors (Last 30 Days)"
            color="#4F46E5"
          />
          <LineChart
            data={searchImpressions}
            title="Search Impressions (Last 30 Days)"
            color="#059669"
          />
        </div>

        {/* Top Articles */}
        <div className="grid grid-cols-1 gap-6">
          <TopArticles articles={topArticles} />
        </div>
      </main>
    </div>
  );
}