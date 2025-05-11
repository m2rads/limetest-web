/**
 * Loads and formats the GitHub private key from environment variables
 * Handles both direct key content and base64-encoded keys
 */
export function loadGitHubPrivateKey(): string | null {
  try {
    const base64Key = process.env.GITHUB_APP_PRIVATE_KEY_BASE64;
    if (base64Key) {
      const decodedKey = Buffer.from(base64Key, 'base64').toString('utf-8');
      if (decodedKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
        return decodedKey;
      }
      return `-----BEGIN RSA PRIVATE KEY-----\n${decodedKey}\n-----END RSA PRIVATE KEY-----`;
    }
    
    const rawKey = process.env.GITHUB_APP_PRIVATE_KEY;
    if (!rawKey) {
      console.error('GitHub App private key not found in environment variables');
      return null;
    }
    const formattedKey = rawKey.replace(/\\n/g, '\n');
    if (formattedKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      return formattedKey;
    }

    return `-----BEGIN RSA PRIVATE KEY-----\n${formattedKey}\n-----END RSA PRIVATE KEY-----`;
  } catch (error) {
    console.error('Error loading GitHub private key:', error);
    return null;
  }
} 