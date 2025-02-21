import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Settings, BrainCircuit, Image, Mail, LogOut, Menu, X } from 'lucide-react';
import { getUserInfo, logout } from '../services/auth';

export function AdminHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            {/* Logo */}
            <a
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
            >
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">AI Pulse News Admin</span>
              <span className="text-xl font-bold text-gray-900 sm:hidden">Admin</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
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
            </nav>

            {/* User Info & Logout (Desktop) */}
            <div className="hidden md:flex items-center space-x-4 pl-4 border-l border-gray-200">
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

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
              ) : (
                  <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200">
                <nav className="py-3 space-y-1">
                  <a
                      href="/admin/dashboard"
                      className={`block px-4 py-2 ${isActive('/admin/dashboard') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </div>
                  </a>
                  <a
                      href="/admin/articles"
                      className={`block px-4 py-2 ${isActive('/admin/articles') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5" />
                      <span>Articles</span>
                    </div>
                  </a>
                  <a
                      href="/admin/media"
                      className={`block px-4 py-2 ${isActive('/admin/media') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Image className="h-5 w-5" />
                      <span>Media</span>
                    </div>
                  </a>
                  <a
                      href="/admin/newsletter"
                      className={`block px-4 py-2 ${isActive('/admin/newsletter') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5" />
                      <span>Newsletter</span>
                    </div>
                  </a>
                  <a
                      href="/admin/settings"
                      className={`block px-4 py-2 ${isActive('/admin/settings') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </div>
                  </a>
                </nav>

                {/* User Info & Logout (Mobile) */}
                <div className="border-t border-gray-200 py-3 px-4">
                  {userName && (
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Bonjour {userName}
                      </div>
                  )}
                  <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
          )}
        </div>
      </header>
  );
}