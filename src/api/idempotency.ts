/**
 * Idempotency Utilities
 * Prevents duplicate requests from reaching the backend
 * Stores request state in localStorage for resilience
 */

// Simple UUID generator (no external dependency)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for browsers without crypto
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface IdempotencyRecord {
  key: string;
  endpoint: string;
  userId: string;
  action: string;
  timestamp: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  responseData?: unknown;
  errorData?: unknown;
}

const IDEMPOTENCY_STORAGE_PREFIX = 'idempotency_';
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a unique idempotency key for a request
 * Format: {userId}-{action}-{timestamp}-{uuid}
 */
export function generateIdempotencyKey(userId: string, action: string): string {
  const timestamp = Date.now();
  const uuid = generateUUID().substring(0, 8); // Short UUID
  return `${userId}-${action}-${timestamp}-${uuid}`;
}

/**
 * Generate a shorter idempotency key for non-auth operations
 * Useful when userId is unknown
 */
export function generateAnonIdempotencyKey(action: string): string {
  const timestamp = Date.now();
  const uuid = generateUUID().substring(0, 12);
  return `${action}-${timestamp}-${uuid}`;
}

/**
 * Store an idempotency record locally
 */
export function storeIdempotencyRecord(record: IdempotencyRecord): void {
  const key = `${IDEMPOTENCY_STORAGE_PREFIX}${record.key}`;
  localStorage.setItem(key, JSON.stringify(record));
}

/**
 * Retrieve an idempotency record from local storage
 */
export function getIdempotencyRecord(idempotencyKey: string): IdempotencyRecord | null {
  const key = `${IDEMPOTENCY_STORAGE_PREFIX}${idempotencyKey}`;
  const data = localStorage.getItem(key);
  
  if (!data) return null;
  
  const record: IdempotencyRecord = JSON.parse(data);
  
  // Check if record has expired
  if (Date.now() - record.timestamp > IDEMPOTENCY_TTL) {
    localStorage.removeItem(key);
    return null;
  }
  
  return record;
}

/**
 * Mark an idempotency request as success and store the response
 */
export function markIdempotencySuccess(
  idempotencyKey: string,
  responseData: unknown
): void {
  const record = getIdempotencyRecord(idempotencyKey);
  if (record) {
    record.status = 'SUCCESS';
    record.responseData = responseData;
    storeIdempotencyRecord(record);
  }
}

/**
 * Mark an idempotency request as failed and store the error
 */
export function markIdempotencyFailed(
  idempotencyKey: string,
  errorData: unknown
): void {
  const record = getIdempotencyRecord(idempotencyKey);
  if (record) {
    record.status = 'FAILED';
    record.errorData = errorData;
    storeIdempotencyRecord(record);
  }
}

/**
 * Check if a request is currently being processed (PENDING)
 */
export function isRequestPending(idempotencyKey: string): boolean {
  const record = getIdempotencyRecord(idempotencyKey);
  return record?.status === 'PENDING';
}

/**
 * Check if a request already succeeded
 */
export function getSuccessfulResponse(idempotencyKey: string): unknown | null {
  const record = getIdempotencyRecord(idempotencyKey);
  if (record?.status === 'SUCCESS') {
    return record.responseData;
  }
  return null;
}

/**
 * Clean up old idempotency records (run periodically)
 */
export function cleanupExpiredIdempotencyRecords(): void {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  
  keys.forEach((key) => {
    if (key.startsWith(IDEMPOTENCY_STORAGE_PREFIX)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const record: IdempotencyRecord = JSON.parse(data);
          if (now - record.timestamp > IDEMPOTENCY_TTL) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Ignore parse errors, just skip
      }
    }
  });
}

/**
 * Clear all idempotency records (use with caution)
 */
export function clearAllIdempotencyRecords(): void {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(IDEMPOTENCY_STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Initialize idempotency system (call on app load)
 */
export function initializeIdempotency(): void {
  cleanupExpiredIdempotencyRecords();
}
