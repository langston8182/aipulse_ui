const API_BASE_URL = 'https://aipulse-api.cyrilmarchive.com';
const AWS_LOGIN_URL = 'https://auth.cyrilmarchive.com/login?client_id=6adlt0qa98ki88abf5bkt8oone&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fwww.ai-pulse-news.com%2Fauth%2Fcallback';

interface UserInfo {
  given_name: string;
  family_name: string;
}

export function redirectToLogin(): void {
  window.location.href = AWS_LOGIN_URL;
}

export async function handleAuthCallback(code: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/callback?code=${code}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    // Attendre que la réponse soit complète
    await response.json();

    // Maintenant que l'authentification est terminée et que les cookies sont définis,
    // on peut récupérer les informations utilisateur
    window.location.href = '/admin/dashboard';
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function getUserInfo(): Promise<UserInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/userinfo`, {
      credentials: 'include',
      method: 'POST',
    });
    console.log('response : ', response)
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
}