import type { EmailRequest } from '../types';
import { generateToken } from '../utils/crypto';
import { sendEmail } from './email';
import config from '../config.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function subscribeToNewsletter(email: string): Promise<void> {
  try {
    // Generate a secure token for this subscription
    const token = generateToken();

    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token }),
    });

    if (!response.ok) {
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }

    // Generate the unsubscribe URL with email and token
    const unsubscribeUrl = `${API_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    
    // Send confirmation email
    const emailRequest: EmailRequest = {
      to: email,
      subject: `Confirmation d'inscription à la newsletter ${config.siteTitle}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5; margin-bottom: 24px;">Bienvenue sur ${config.siteTitle} !</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
            Nous sommes ravis de vous confirmer votre inscription à notre newsletter.
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
            Vous recevrez désormais nos derniers articles et actualités sur l'intelligence artificielle directement dans votre boîte mail.
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Si vous souhaitez vous désabonner à tout moment, il vous suffit de cliquer sur le lien ci-dessous :
          </p>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${unsubscribeUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Se désabonner
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; text-align: center;">
            © 2024 ${config.siteTitle}. Tous droits réservés.
          </p>
        </div>
      `,
      textBody: `
Bienvenue sur ${config.siteTitle} !

Nous sommes ravis de vous confirmer votre inscription à notre newsletter.

Vous recevrez désormais nos derniers articles et actualités sur l'intelligence artificielle directement dans votre boîte mail.

Si vous souhaitez vous désabonner à tout moment, utilisez ce lien :
${unsubscribeUrl}

© 2024 ${config.siteTitle}. Tous droits réservés.
      `
    };

    await sendEmail(emailRequest);
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