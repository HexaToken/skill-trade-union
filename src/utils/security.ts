// Security utilities for credit operations
// Handles rate limiting, validation, and security measures

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  
  // Rate limit settings (matches API contract)
  private readonly READ_LIMIT = 60; // 60 requests per minute for reads
  private readonly WRITE_LIMIT = 20; // 20 requests per minute for writes
  private readonly WINDOW_MS = 60 * 1000; // 1 minute window

  checkLimit(key: string, isWrite = false): boolean {
    const limit = isWrite ? this.WRITE_LIMIT : this.READ_LIMIT;
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return true;
    }

    if (entry.count >= limit) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  }

  getRetryAfter(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, Math.ceil((entry.resetTime - now) / 1000));
  }
}

export const rateLimiter = new RateLimiter();

// Validate credit amounts to prevent negative values and overflow
export function validateCreditAmount(amount: number): boolean {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }
  
  // Ensure positive amount
  if (amount <= 0) {
    return false;
  }
  
  // Prevent overflow (max 1 million credits per transaction)
  if (amount > 1000000) {
    return false;
  }
  
  // Ensure reasonable precision (max 2 decimal places)
  if (amount % 0.01 !== 0) {
    return false;
  }
  
  return true;
}

// Sanitize user input for transaction metadata
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Only allow string, number, boolean values
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      // Limit string length to prevent abuse
      if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

// Generate secure idempotency keys
export function generateSecureIdempotencyKey(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = typeof navigator !== 'undefined' ? 
    btoa(navigator.userAgent).substring(0, 8) : 'server';
  
  return `idem_${timestamp}_${random}_${userAgent}`;
}

// Validate transaction signatures (for webhook security)
export function validateTransactionSignature(
  payload: string, 
  signature: string, 
  secret: string
): boolean {
  try {
    // In a real implementation, you'd use crypto.createHmac
    // This is a simplified version for demo
    const expectedSignature = btoa(payload + secret);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

// Detect suspicious patterns in transaction requests
export function detectSuspiciousActivity(
  userId: string,
  amount: number,
  recentTransactions: Array<{ amount: number; timestamp: string }>
): { isSuspicious: boolean; reason?: string } {
  
  // Check for rapid succession of large transactions
  const recentLarge = recentTransactions.filter(tx => {
    const isRecent = Date.now() - new Date(tx.timestamp).getTime() < 5 * 60 * 1000; // 5 minutes
    const isLarge = tx.amount > 100;
    return isRecent && isLarge;
  });
  
  if (recentLarge.length > 3) {
    return {
      isSuspicious: true,
      reason: 'Multiple large transactions in short timeframe'
    };
  }
  
  // Check for unusually large single transaction
  if (amount > 500) {
    return {
      isSuspicious: true,
      reason: 'Unusually large transaction amount'
    };
  }
  
  // Check for rapid succession of any transactions
  const veryRecentTx = recentTransactions.filter(tx => {
    return Date.now() - new Date(tx.timestamp).getTime() < 30 * 1000; // 30 seconds
  });
  
  if (veryRecentTx.length > 5) {
    return {
      isSuspicious: true,
      reason: 'Too many transactions in rapid succession'
    };
  }
  
  return { isSuspicious: false };
}

// Secure local storage for sensitive data
export class SecureStorage {
  private static prefix = 'skillswap_secure_';
  
  static set(key: string, value: any, expiryMinutes = 60): void {
    try {
      const item = {
        value,
        expiry: Date.now() + (expiryMinutes * 60 * 1000),
        checksum: btoa(JSON.stringify(value)).substring(0, 8), // Simple checksum
      };
      
      localStorage.setItem(
        this.prefix + key, 
        btoa(JSON.stringify(item)) // Base64 encode for basic obfuscation
      );
    } catch (error) {
      console.warn('Failed to store secure data:', error);
    }
  }
  
  static get(key: string): any {
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return null;
      
      const item = JSON.parse(atob(stored));
      
      // Check expiry
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }
      
      // Verify checksum
      const expectedChecksum = btoa(JSON.stringify(item.value)).substring(0, 8);
      if (item.checksum !== expectedChecksum) {
        this.remove(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.warn('Failed to retrieve secure data:', error);
      return null;
    }
  }
  
  static remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
  
  static clear(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Prevent double-submission of forms
export class SubmissionGuard {
  private static pending: Set<string> = new Set();
  
  static async guard<T>(
    key: string, 
    operation: () => Promise<T>,
    timeoutMs = 30000
  ): Promise<T> {
    if (this.pending.has(key)) {
      throw new Error('Operation already in progress');
    }
    
    this.pending.add(key);
    
    const timeout = setTimeout(() => {
      this.pending.delete(key);
    }, timeoutMs);
    
    try {
      const result = await operation();
      return result;
    } finally {
      clearTimeout(timeout);
      this.pending.delete(key);
    }
  }
  
  static isPending(key: string): boolean {
    return this.pending.has(key);
  }
  
  static clear(): void {
    this.pending.clear();
  }
}

export default {
  rateLimiter,
  validateCreditAmount,
  sanitizeMetadata,
  generateSecureIdempotencyKey,
  validateTransactionSignature,
  detectSuspiciousActivity,
  SecureStorage,
  SubmissionGuard,
};
