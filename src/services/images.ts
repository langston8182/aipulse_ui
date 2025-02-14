import type { S3Image } from '../types';

const API_BASE_URL = 'https://aipulse-api.cyrilmarchive.com';

export async function listS3Images(): Promise<S3Image[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const images = await response.json();
    // Add unique id to each image
    return images;
  } catch (error) {
    console.error('Error listing S3 images:', error);
    throw new Error('Failed to list S3 images');
  }
}

export async function uploadS3Image(file: File): Promise<S3Image> {
  try {
    // Générer un nom de fichier unique
    const generateFileName = (originalName: string) => {
      const timestamp = Date.now();
      const extension = originalName.substring(originalName.lastIndexOf('.'));
      return `${timestamp}${extension}`;
    };

    const uniqueFileName = generateFileName(file.name);

    // Convertir le fichier en base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);
    
    const base64Content = await base64Promise;
    
    // Envoi à l'API
    const response = await fetch(`${API_BASE_URL}/admin/images`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: uniqueFileName,  // Utilisation du nom de fichier unique
        fileContent: base64Content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const image = await response.json();
    return {
      ...image,
      id: `${uniqueFileName}`
    };
  } catch (error) {
    console.error('Error uploading S3 image:', error);
    throw new Error('Failed to upload S3 image');
  }
}


export async function deleteS3Image(fileName: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/images/${encodeURIComponent(fileName)}`, {
      credentials: 'include',
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting S3 image:', error);
    throw new Error('Failed to delete S3 image');
  }
}