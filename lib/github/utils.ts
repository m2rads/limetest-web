import fs from 'fs'
import path from 'path'

/**
 * Load the GitHub App private key from file or environment variable
 * @returns The GitHub App private key
 * @throws Error if private key cannot be loaded
 */
export function loadGitHubPrivateKey(): string {
  try {
    const privateKeyPath = path.join(process.cwd(), 'github-private-key.pem');
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    console.log('GitHub private key loaded from file');
    return privateKey;
  } catch (err) {
    console.log('Could not load GitHub private key from file, trying environment variable');    
    const privateKeyEnv = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKeyEnv) {
      throw new Error('GitHub App private key not found in file or environment variables');
    }
    
    console.log('GitHub private key loaded from environment variable');
    return privateKeyEnv;
  }
}