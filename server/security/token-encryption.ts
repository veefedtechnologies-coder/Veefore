import crypto from 'crypto';

/**
 * CRITICAL SECURITY SERVICE: Social Media Token Encryption
 * 
 * Implements AES-256-GCM encryption for social media access tokens at rest
 * to prevent credential theft and meet security compliance requirements.
 * 
 * Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - Secure key derivation with salt
 * - IV (Initialization Vector) for each encryption
 * - Encrypted data integrity verification
 */

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits (correct for GCM mode)
const SALT_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16;  // 128 bits

interface EncryptedToken {
  encryptedData: string;
  iv: string;
  salt: string;
  tag: string;
}

export class TokenEncryptionService {
  private masterKey: string;

  constructor() {
    // P1-6.2: Enhanced key management integration
    // Get master key from environment - CRITICAL for production security
    this.masterKey = process.env.TOKEN_ENCRYPTION_KEY || this.generateMasterKey();
    
    if (!process.env.TOKEN_ENCRYPTION_KEY) {
      // CRITICAL: Fail fast in production environments for security
      if (process.env.NODE_ENV === 'production') {
        console.error('🚨 CRITICAL SECURITY ERROR: TOKEN_ENCRYPTION_KEY is required in production');
        console.error('💀 Exiting to prevent insecure operation');
        process.exit(1);
      }
      // Only warn once in development, not on every startup
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Auto-generating temporary encryption key');
      }
    }
  }

  /**
   * Generate a secure master key for development/testing
   * NOTE: In production, use a proper key management service (AWS KMS, HashiCorp Vault, etc.)
   */
  private generateMasterKey(): string {
    return crypto.randomBytes(KEY_LENGTH).toString('hex');
  }

  /**
   * Derive encryption key from master key using PBKDF2
   */
  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(this.masterKey, salt, 100000, KEY_LENGTH, 'sha256');
  }

  /**
   * Encrypt a social media access token
   * @param token - Plain text access token to encrypt
   * @returns Encrypted token data with metadata
   */
  public encryptToken(token: string): EncryptedToken {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: must be a non-empty string');
      }

      // Generate random salt and IV for this encryption
      const salt = crypto.randomBytes(SALT_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);
      
      // Derive encryption key from master key + salt
      const key = this.deriveKey(salt);
      
      // SECURITY FIX: Create cipher with proper AES-256-GCM using IV
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      cipher.setAutoPadding(true);
      
      // Encrypt the token
      let encryptedData = cipher.update(token, 'utf8', 'base64');
      encryptedData += cipher.final('base64');
      
      // Get authentication tag for integrity verification
      const tag = cipher.getAuthTag();

      return {
        encryptedData,
        iv: iv.toString('base64'),
        salt: salt.toString('base64'),
        tag: tag.toString('base64')
      };
    } catch (error) {
      console.error('🚨 TOKEN ENCRYPTION ERROR:', error);
      throw new Error('Failed to encrypt token');
    }
  }

  /**
   * Decrypt a social media access token
   * @param encryptedToken - Encrypted token data with metadata
   * @returns Plain text access token
   */
  public decryptToken(encryptedToken: EncryptedToken): string {
    try {
      if (!encryptedToken || !encryptedToken.encryptedData) {
        throw new Error('Invalid encrypted token data');
      }

      const { encryptedData, iv, salt, tag } = encryptedToken;

      // Convert base64 strings back to buffers
      const ivBuffer = Buffer.from(iv, 'base64');
      const saltBuffer = Buffer.from(salt, 'base64');
      const tagBuffer = Buffer.from(tag, 'base64');
      
      // Derive the same encryption key
      const key = this.deriveKey(saltBuffer);
      
      // SECURITY FIX: Create decipher with proper AES-256-GCM using IV
      const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
      decipher.setAuthTag(tagBuffer);
      
      // Decrypt the token
      let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
      decryptedData += decipher.final('utf8');
      
      return decryptedData;
    } catch (error) {
      console.error('🚨 TOKEN DECRYPTION ERROR:', error);
      throw new Error('Failed to decrypt token - token may be corrupted or key changed');
    }
  }

  /**
   * Validate that an encrypted token can be successfully decrypted
   * @param encryptedToken - Encrypted token to validate
   * @returns True if token is valid and can be decrypted
   */
  public validateEncryptedToken(encryptedToken: EncryptedToken): boolean {
    try {
      this.decryptToken(encryptedToken);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Re-encrypt a token with a new salt/IV (for key rotation)
   * @param encryptedToken - Existing encrypted token
   * @returns Newly encrypted token with fresh cryptographic parameters
   */
  public rotateTokenEncryption(encryptedToken: EncryptedToken): EncryptedToken {
    const plainToken = this.decryptToken(encryptedToken);
    return this.encryptToken(plainToken);
  }

  /**
   * Securely compare two tokens without exposing timing information
   * @param token1 - First encrypted token
   * @param token2 - Second encrypted token
   * @returns True if tokens contain the same plaintext value
   */
  public secureTokenCompare(token1: EncryptedToken, token2: EncryptedToken): boolean {
    try {
      const plain1 = this.decryptToken(token1);
      const plain2 = this.decryptToken(token2);
      
      // Use constant-time comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(plain1, 'utf8'),
        Buffer.from(plain2, 'utf8')
      );
    } catch {
      return false;
    }
  }

  /**
   * Generate a summary of encryption status for monitoring
   */
  public getEncryptionStatus(): {
    algorithm: string;
    keyLength: number;
    hasEnvironmentKey: boolean;
    version: string;
  } {
    return {
      algorithm: ALGORITHM,
      keyLength: KEY_LENGTH * 8, // Convert to bits
      hasEnvironmentKey: !!process.env.TOKEN_ENCRYPTION_KEY,
      version: '1.0.0'
    };
  }
}

// Export singleton instance
export const tokenEncryption = new TokenEncryptionService();

// Export types for use in storage layer
export type { EncryptedToken };