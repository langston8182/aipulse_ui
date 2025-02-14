export function generateToken(): string {
  // Generate 32 random bytes using the Web Crypto API
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  
  // Convert to hexadecimal string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}