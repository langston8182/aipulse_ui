const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function subscribeToNewsletter(email: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    throw error;
  }
}

export async function getNewsletterSubscribers(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Impossible de récupérer la liste des abonnés');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    throw error;
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Impossible de désabonner cet email');
    }
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    throw error;
  }
}