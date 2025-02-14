import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Settings, BrainCircuit, Image, Mail, LogOut } from 'lucide-react';
import { getUserInfo, logout } from '../services/auth';

export function AdminHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const path = window.location.pathname;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUserName(`${userInfo.given_name} ${userInfo.family_name}`);
      }
    };

    fetchUserInfo();
  }, []);

  const isActive = (route: string) => {
    return path === route;
  };

  const getLinkClasses = (route: string) => {
    const baseClasses = "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200";
    return isActive(route)
        ? `${baseClasses} bg-indigo-50 text-indigo-600 font-medium`
        : `${baseClasses} text-gray-700 hover:text-indigo-600 hover:bg-indigo-50`;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
            >
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">AI Pulse News Admin</span>
            </a>

            <nav className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <a href="/admin/dashboard" className={getLinkClasses('/admin/dashboard')}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
                <a href="/admin/articles" className={getLinkClasses('/admin/articles')}>
                  <FileText className="h-5 w-5" />
                  <span>Articles</span>
                </a>
                <a href="/admin/media" className={getLinkClasses('/admin/media')}>
                  <Image className="h-5 w-5" />
                  <span>Media</span>
                </a>
                <a href="/admin/newsletter" className={getLinkClasses('/admin/newsletter')}>
                  <Mail className="h-5 w-5" />
                  <span>Newsletter</span>
                </a>
                <a href="/admin/settings" className={getLinkClasses('/admin/settings')}>
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </div>

              <div className="pl-4 border-l border-gray-200 flex items-center space-x-4">
                {userName && (
                    <span className="text-sm font-medium text-gray-700">
                  Bonjour {userName}
                </span>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors duration-200"
                    title="Se déconnecter"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
  );
}