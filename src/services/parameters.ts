import type { Parameter } from '../types';

const API_BASE_URL = 'https://aipulse-api.cyrilmarchive.com';

export async function getParameters(): Promise<Parameter[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/parameters`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching parameters:', error);
    throw new Error('Failed to fetch parameters');
  }
}

export async function saveParameters(parameters: Parameter[]): Promise<void> {
  try {
    // Add prefix to parameter names if not present
    const formattedParameters = parameters.map(param => ({
      name: param.name.startsWith('/ai-pulse/') ? param.name : `/ai-pulse/${param.name}`,
      value: param.value
    }));

    const response = await fetch(`${API_BASE_URL}/admin/parameters`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parameters: formattedParameters
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving parameters:', error);
    throw new Error('Failed to save parameters');
  }
}