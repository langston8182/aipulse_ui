import type { AnalyticsEvent, AnalyticsData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { extractIdFromSlug } from '../utils/slug';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Détecte le type d'appareil
function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// Détecte le navigateur
function getBrowser(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Firefox/')) {
        return 'Firefox';
    } else if (ua.includes('Chrome/') && !ua.includes('Edg/') && !ua.includes('OPR/')) {
        return 'Chrome';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
        return 'Safari';
    } else if (ua.includes('Edg/')) {
        return 'Edge';
    } else if (ua.includes('OPR/')) {
        return 'Opera';
    } else {
        return 'Unknown';
    }
}

// Détecte le système d'exploitation
function getOS(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Win')) {
        return 'Windows';
    } else if (ua.includes('Mac')) {
        return 'macOS';
    } else if (ua.includes('Linux')) {
        return 'Linux';
    } else if (ua.includes('Android')) {
        return 'Android';
    } else if (ua.includes('like Mac') || ua.includes('iPhone') || ua.includes('iPad')) {
        return 'iOS';
    } else if (ua.includes('CrOS')) {
        return 'ChromeOS';
    } else {
        return 'Unknown';
    }
}

// Crée un identifiant de session unique
function getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
}

// Vérifie si nous sommes sur une page d'article
function isArticlePage(): boolean {
    return window.location.pathname.startsWith('/article/');
}

// Vérifie si nous sommes dans la partie admin
function isAdminPage(): boolean {
    return window.location.pathname.startsWith('/admin');
}

// Vérifie si nous sommes sur la page d'accueil
function isHomePage(): boolean {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
}

// Extrait l'ID de l'article de l'URL
function getArticleId(): string | undefined {
    if (!isArticlePage()) return undefined;

    const slug = window.location.pathname.split('/')[2];
    return extractIdFromSlug(slug);
}

// Suit les clics sur la page
let clickCount = 0;
document.addEventListener('click', () => {
    if (isArticlePage()) {
        clickCount++;
    }
});

const initialSocialShares = {
    facebook: 0,
    linkedin: 0,
    x: 0
};

let socialShares = { ...initialSocialShares };

export function trackSocialShare(platform: 'facebook' | 'linkedin' | 'x'): void {
    if (!isArticlePage() || isAdminPage() || isHomePage()) return;

    // Réinitialiser socialShares à chaque appel
    socialShares = { ...initialSocialShares };

    // Mettre à jour la plateforme partagée
    socialShares[platform] = 1;
    
    void sendAnalyticsEvent({
        eventType: 'share',
        hashedIp: getSessionId(),
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        articleId: getArticleId(),
        referrer: document.referrer || undefined,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        country: 'FR',
        actions: {
            shares: { ...socialShares },
            clicks: clickCount
        }
    });
}

export function initAnalytics(): void {
    try {
        // N'initialise les analytics que sur les pages d'articles
        if (!isArticlePage() || isAdminPage() || isHomePage()) return;

        // Envoie un événement initial de vue de page
        void sendAnalyticsEvent({
            eventType: 'pageView',
            hashedIp: getSessionId(),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            articleId: getArticleId(),
            referrer: document.referrer || undefined,
            deviceType: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            country: 'FR',
            actions: {
                shares: {
                    facebook: 0,
                    linkedin: 0,
                    x: 0
                },
                clicks: 0
            }
        });

        // Envoie un dernier événement avant de quitter la page
        window.addEventListener('beforeunload', () => {
            if (!isArticlePage() || isAdminPage() || isHomePage()) return;

            void sendAnalyticsEvent({
                eventType: 'pageView',
                hashedIp: getSessionId(),
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                articleId: getArticleId(),
                referrer: document.referrer || undefined,
                deviceType: getDeviceType(),
                browser: getBrowser(),
                os: getOS(),
                country: 'FR',
                actions: {
                    shares: { ...socialShares },
                    clicks: clickCount
                }
            });
        });
    } catch (error) {
        console.error('Error initializing analytics:', error);
    }
}

export async function sendAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
    if (!API_BASE_URL) {
        console.warn('API_BASE_URL is not defined. Analytics event not sent.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending analytics event:', error);
    }
}

export async function getAnalytics(): Promise<AnalyticsData> {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
}