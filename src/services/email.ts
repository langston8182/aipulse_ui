import type { Article, EmailRequest } from '../types';
import { getNewsletterSubscribers } from './newsletter';
import config from '../config.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function sendEmail(emailRequest: EmailRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/email`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailRequest)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendNewArticleNotification(article: Article): Promise<void> {
  try {
    // Get subscribers with their tokens
    const subscribers = await getNewsletterSubscribers();
    
    // Only send if there are subscribers
    if (subscribers.length > 0) {
      const articleUrl = `${window.location.origin}/article/${article._id}`;
      
      // Ensure subscribers is an array of subscriber objects
      const validSubscribers = subscribers
        .filter(subscriber => subscriber && typeof subscriber === 'object' && subscriber.email && subscriber.confirm_token);
      
      // Send individual emails to each subscriber
      for (const subscriber of validSubscribers) {
        const emailRequest: EmailRequest = {
          to: subscriber.email,
          subject: `Nouvel article sur ${config.siteTitle}`,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4F46E5; margin-bottom: 24px;">Nouvel article sur ${config.siteTitle}</h1>
              
              <div style="margin-bottom: 24px;">
                <img src="${article.imageUrl}" 
                     alt="${article.title}" 
                     style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;"
                />
              </div>
              
              <h2 style="color: #1F2937; margin-bottom: 16px;">
                ${article.title}
              </h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                ${article.summary}
              </p>
              
              <div style="margin: 24px 0; text-align: center;">
                <a href="${articleUrl}" 
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Lire l'article
                </a>
              </div>
              
              <div style="color: #6B7280; font-size: 14px; margin-top: 32px;">
                <p style="margin-bottom: 8px;">
                  Catégorie : ${article.category}<br>
                  Temps de lecture estimé : ${article.readTime} minutes
                </p>
                <p style="margin-bottom: 16px;">
                  Par ${article.author}
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
              
              <div style="text-align: center; margin-bottom: 24px;">
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 12px;">
                  Vous recevez cet email car vous êtes abonné à la newsletter de ${config.siteTitle}.
                </p>
                <a href="${API_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${encodeURIComponent(subscriber.confirm_token)}" 
                   style="color: #6B7280; font-size: 14px; text-decoration: underline;">
                  Se désabonner de la newsletter
                </a>
              </div>
              
              <p style="color: #6B7280; font-size: 14px; text-align: center;">
                © 2025 ${config.siteTitle}. Tous droits réservés.
              </p>
            </div>
          `,
          textBody: `
Nouvel article sur ${config.siteTitle}

${article.title}

${article.summary}

Lire l'article : ${articleUrl}

Catégorie : ${article.category}
Temps de lecture estimé : ${article.readTime} minutes
Par ${article.author}

---

Vous recevez cet email car vous êtes abonné à la newsletter de ${config.siteTitle}.
Pour vous désabonner, visitez ce lien : ${API_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${encodeURIComponent(subscriber.token)}

© 2025 ${config.siteTitle}. Tous droits réservés.
          `
        };

        await sendEmail(emailRequest);
      }
    }
  } catch (error) {
    console.error('Error sending article notification:', error);
    throw new Error('Failed to send article notification');
  }
}