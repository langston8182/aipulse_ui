import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration structure we want to generate
const defaultConfig = {
  articlesPerPage: 6,
  featuredArticles: 1,
  allowComments: true,
  allowNewsletterSubscription: true,
  siteTitle: "AI Pulse News",
  siteDescription: "Votre source d'actualités sur l'intelligence artificielle, le machine learning et les technologies émergentes.",
  contactEmail: "contact@aipulsenews.com",
  categories: [
    'Apprentissage Automatique',
    'Apprentissage Profond',
    'Traitement du Langage Naturel',
    'Vision par Ordinateur',
    'IA & Robotique',
    'Réseaux de Neurones',
    'IA Quantique',
    'Éthique de l\'IA',
    'Apprentissage par Renforcement',
    'IA & Santé'
  ],
  adminWeb: "https://aipulsenews.com",
  adminGitHub: "https://github.com/aipulsenews",
  adminLinkedIn: "https://linkedin.com/in/username"
};

// Helper function to convert AWS parameter to config value
function convertParameter(name, value) {
  // Remove /ai-pulse/ prefix
  const key = name.replace('/ai-pulse/', '');
  // Convert value based on parameter name
  switch (key) {
    case 'articlesPerPage':
    case 'featuredArticles':
      return parseInt(value) || defaultConfig.articlesPerPage;
    case 'allowComments':
      return value === 'true';
    case 'allowNewsletterSubscription':
      return value === 'true';
    case 'categories':
      try {
        // Parse JSON and remove quotes if it's an array
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(cat => cat.replace(/^"(.*)"$/, '$1'));
        }
        return parsed;
      } catch {
        // If not JSON, split by comma and trim
        return value.split(',').map(cat => cat.trim());
      }
    default:
      return value;
  }
}

// Helper function to map AWS parameter names to config keys
function mapParameterToConfigKey(name) {
  const mapping = {
    'articlesPerPage': 'articlesPerPage',
    'featuredArticles': 'featuredArticles',
    'allowComments': 'allowComments',
    'allowNewsletterSubscription': 'allowNewsletterSubscription',
    'siteTitle': 'siteTitle',
    'siteDescription': 'siteDescription',
    'contactEmail': 'contactEmail',
    'categories': 'categories',
    'adminWeb': 'adminWeb',
    'adminGitHub': 'adminGitHub',
    'adminLinkedIn': 'adminLinkedIn'
  };

  const key = name.replace('/ai-pulse/', '');
  return mapping[key] || key;
}

async function main() {
  try {
    let config = { ...defaultConfig };

    // Only try to fetch from API if credentials are available
      console.log('Fetching parameters from API...');
      try {
        const response = await fetch('https://aipulse-api.cyrilmarchive.com/admin/parameters', {
          method: 'GET',
        });

        if (response.ok) {
          const parameters = await response.json();

          // Update config with API values
          parameters.forEach(param => {
            const configKey = mapParameterToConfigKey(param.name);
            const value = convertParameter(param.name, param.value);
            if (configKey in config) {
              config[configKey] = value;
            }
          });
          
          console.log('✅ Parameters successfully fetched from API');
        } else {
          console.warn('⚠️ Could not fetch parameters from API, using defaults');
        }
      } catch (error) {
        console.warn('⚠️ Error fetching from API, using defaults:', error.message);
      }

    // Write configuration to file
    const configPath = path.join(__dirname, '..', 'src', 'config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log("file : ", JSON.stringify(config, null, 2))
    console.log('✅ Configuration written to config.json');

  } catch (error) {
    console.error('❌ Error writing configuration:', error);
    process.exit(1);
  }
}

main();