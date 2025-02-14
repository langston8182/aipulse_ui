import React, { useEffect, useState } from 'react';
import { getUserInfo, redirectToLogin } from '../services/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                redirectToLogin();
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
}