/**
 * API Service Layer
 * Handles all backend API calls with mock data fallback
 * 
 * USAGE:
 * - Set USE_MOCK=true to use mock data (for demo), false for real backend
 * - All endpoints automatically include idempotency keys for state-changing operations
 */

import * as Types from './types';
import {
  generateIdempotencyKey,
  storeIdempotencyRecord,
  getSuccessfulResponse,
  isRequestPending,
  markIdempotencySuccess,
  markIdempotencyFailed,
} from './idempotency';
import { MOCK_CONSULTATIONS } from '../Balai/data/mockData';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const USE_MOCK = false; // Toggle mock/real: TRUE = Demo with mock, FALSE = Real backend
const API_BASE_URL = 'http://localhost:8080/api'; // Update for real backend
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch wrapper with timeout, error handling, and idempotency
 * Handles both JSON and text responses
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { idempotencyKey?: string; userId?: string } = {}
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { idempotencyKey, userId, ...fetchOptions } = options;

  // Add headers
  const headers = new Headers(fetchOptions.headers || {});
  headers.set('Content-Type', 'application/json');

  // Add idempotency key if provided
  if (idempotencyKey) {
    headers.set('Idempotency-Key', idempotencyKey);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: 'include', // ✅ Browser automatically sends HttpOnly cookies
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    // Handle both JSON and text responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      // For non-JSON responses (text/plain, etc.), parse as text
      // and wrap in a message property to maintain type safety
      const text = await response.text();
      return { message: text } as T;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function simulateNetworkDelay(): Promise<void> {
  // No delay for mock data in demo mode - instant responses
  return Promise.resolve();
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH APIs
// ═══════════════════════════════════════════════════════════════════════════

export async function loginUser(
  request: Types.AuthLoginRequest
): Promise<Types.AuthLoginResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    // Mock validation
    if (!request.email || !request.password) {
      throw new Error('Email and password are required');
    }

    // Mock token (in real backend, JWT is returned)
    const mockToken = btoa(`${request.email}:${Date.now()}`);
    localStorage.setItem('auth_token', mockToken);

    // Use a fixed demo user ID so mock data matches
    const demoUserId = 'u-101';
    const demoUserName = request.email.split('@')[0];

    return {
      token: mockToken,
      user: {
        id: demoUserId, // Use fixed ID to match mock data
        username: demoUserName,
        email: request.email,
        role: 'Warga', // In mock, default to Warga
        fullName: 'Demo User',
        unit: undefined,
      },
    };
  }

  // Fetch raw response from backend
  const backendResponse = await apiFetch<Types.BackendAuthLoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  // Map backend response to frontend response format
  const normalizedResponse: Types.AuthLoginResponse = {
    token: backendResponse.token,
    balaiId: backendResponse.balaiId, // UUID for Balai staff
    user: {
      id: backendResponse.userId.toString(),
      username: backendResponse.email.split('@')[0], // Extract username from email
      email: backendResponse.email,
      // Map backend roles to frontend roles
      role: backendResponse.role === 'HOMEOWNER' ? 'Warga' : 'Balai',
      fullName: backendResponse.fullName,
      unit: undefined, // Can be populated from backend if available
      balaiId: backendResponse.balaiId, // UUID for Balai staff
    },
  };

  return normalizedResponse;
}

export async function registerUser(
  request: Types.AuthRegisterRequest
): Promise<Types.AuthRegisterResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();

    if (!request.username || !request.email || !request.password || !request.nik || !request.phone || !request.address) {
      throw new Error('Username, email, password, NIK, phone, and address are required');
    }

    return {
      message: 'User registered successfully',
      username: request.username,
      email: request.email,
      fullName: request.fullName,
      nik: request.nik,
      phone: request.phone,
      address: request.address,
      role: request.role,
    };
  }

  return apiFetch<Types.AuthRegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// OTP VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send OTP to user email for verification
 * Backend endpoint: POST /api/auth/send-otp
 */
export async function sendOtp(email: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return { message: 'OTP sent successfully to ' + email };
  }

  return apiFetch<{ message: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Resend OTP code to user email
 * Backend endpoint: POST /api/auth/resend-otp?email={email}
 */
export async function resendOtp(email: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return { message: 'OTP resent successfully to ' + email };
  }

  return apiFetch<{ message: string }>(`/auth/resend-otp?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });
}

/**
 * Verify OTP code submitted by user
 * Backend endpoint: POST /api/auth/verify-otp
 * Returns user data with JWT token if verification successful
 */
export async function verifyOtp(
  email: string,
  otpCode: string
): Promise<Types.BackendAuthLoginResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    // ⚠️ SECURITY: Only allow test OTP in development, never in production
    if (import.meta.env.DEV && otpCode === '123456') {
      console.warn('⚠️ DEVELOPMENT ONLY: Using test OTP 123456. Remove before production!');
      return { 
        userId: 1,
        fullName: 'Mock User',
        email,
        token: 'mock-jwt-token-after-otp-verification',
        role: 'HOMEOWNER',
        status: 'VERIFIED',
        activityStatus: 'ACTIVE',
        expiresIn: 3600,
      };
    }
    
    // Production/Mock mode: Accept valid 6-digit codes only
    if (otpCode.length === 6 && /^\d+$/.test(otpCode)) {
      return { 
        userId: 1,
        fullName: 'Mock User',
        email,
        token: 'mock-jwt-token-after-otp-verification',
        role: 'HOMEOWNER',
        status: 'VERIFIED',
        activityStatus: 'ACTIVE',
        expiresIn: 3600,
      };
    }
    
    throw new Error('Invalid OTP code');
  }

  return apiFetch<Types.BackendAuthLoginResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSULTATION APIs - WARGA (User)
// ═══════════════════════════════════════════════════════════════════════════

export async function bookConsultation(
  userId: string,
  request: Types.BookConsultationRequest
): Promise<Types.BookConsultationResponse> {
  const idempotencyKey = generateIdempotencyKey(userId, 'book-consultation');

  if (USE_MOCK) {
    // Check if already processing
    if (isRequestPending(idempotencyKey)) {
      throw new Error('Request already in progress');
    }

    // Check if already succeeded
    const cachedResponse = getSuccessfulResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse as Types.BookConsultationResponse;
    }

    // Mark as pending
    storeIdempotencyRecord({
      key: idempotencyKey,
      endpoint: '/consultations/book',
      userId,
      action: 'book-consultation',
      timestamp: Date.now(),
      status: 'PENDING',
    });

    try {
      await simulateNetworkDelay();

      const newConsultation: Types.ConsultationEntity = {
        id: `k-${Date.now()}`,
        user: {
          id: userId,
          name: 'User Name',
          phone: '0812-3456-7890',
          email: 'user@example.com',
        },
        balaiLocation: request.balaiId,
        balaiId: request.balaiId,
        date: request.date,
        timeSlot: request.timeSlot,
        status: 'menunggu_konfirmasi',
        topic: request.topic,
        description: request.description,
        createdAt: new Date().toISOString(),
      };

      const response: Types.BookConsultationResponse = {
        id: newConsultation.id,
        status: 'menunggu_konfirmasi',
        message: 'Consultation booked successfully. Waiting for Balai confirmation.',
        consultation: newConsultation,
      };

      markIdempotencySuccess(idempotencyKey, response);
      return response;
    } catch (error) {
      markIdempotencyFailed(idempotencyKey, error);
      throw error;
    }
  }

  return apiFetch<Types.BookConsultationResponse>('/consultations/book', {
    method: 'POST',
    body: JSON.stringify(request),
    idempotencyKey,
    userId,
  });
}

export async function getMyConsultations(
  userId: string,
  options?: Types.GetConsultationsRequest
): Promise<Types.GetConsultationsResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return MOCK_CONSULTATIONS.filter((c) => c.user.id === userId || !options?.status || options.status === 'all');
  }

  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.page) params.set('page', options.page.toString());
  if (options?.size) params.set('size', options.size.toString());

  return apiFetch<Types.GetConsultationsResponse>(`/consultations/me?${params.toString()}`, {
    method: 'GET',
    userId,
  });
}

export async function verifyConsultation(
  userId: string,
  consultationId: string,
  request: Types.VerifyConsultationRequest
): Promise<Types.VerifyConsultationResponse> {
  const idempotencyKey = generateIdempotencyKey(userId, `verify-${consultationId}`);

  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId);
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    return {
      verified: true,
      message: 'Consultation verified successfully',
      consultation,
    };
  }

  return apiFetch<Types.VerifyConsultationResponse>(
    `/consultations/${consultationId}/verify`,
    {
      method: 'POST',
      body: JSON.stringify(request),
      idempotencyKey,
      userId,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSULTATION APIs - BALAI (Admin)
// ═══════════════════════════════════════════════════════════════════════════

export async function getDashboardConsultations(
  balaiId: string,
  options?: Types.GetConsultationsRequest
): Promise<Types.GetConsultationsResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    let filtered = MOCK_CONSULTATIONS;
    
    if (options?.date) {
      filtered = filtered.filter((c) => c.date === options.date);
    }
    
    if (options?.status && options.status !== 'all') {
      filtered = filtered.filter((c) => c.status === options.status);
    }
    
    return filtered;
  }

  const params = new URLSearchParams();
  params.set('balaiId', balaiId);
  if (options?.date) params.set('date', options.date);
  if (options?.status && options.status !== 'all') params.set('status', options.status);
  if (options?.page) params.set('page', options.page.toString());
  if (options?.size) params.set('size', options.size.toString());

  return apiFetch<Types.GetConsultationsResponse>(
    `/dashboard/consultations?${params.toString()}`,
    { method: 'GET' }
  );
}

export async function confirmConsultation(
  balaiId: string,
  consultationId: string
): Promise<Types.ConfirmConsultationResponse> {
  const idempotencyKey = generateIdempotencyKey(balaiId, `confirm-${consultationId}`);

  if (USE_MOCK) {
    // Check if already processing
    if (isRequestPending(idempotencyKey)) {
      throw new Error('Request already in progress. Please wait...');
    }

    // Check if already succeeded (retry case)
    const cachedResponse = getSuccessfulResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse as Types.ConfirmConsultationResponse;
    }

    // Mark as pending
    storeIdempotencyRecord({
      key: idempotencyKey,
      endpoint: `/consultations/${consultationId}/confirm`,
      userId: balaiId,
      action: `confirm-${consultationId}`,
      timestamp: Date.now(),
      status: 'PENDING',
    });

    try {
      await simulateNetworkDelay();

      const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId);
      if (!consultation) {
        throw new Error('Consultation not found');
      }

      // Mock update
      consultation.status = 'terkonfirmasi';

      const response: Types.ConfirmConsultationResponse = {
        id: consultationId,
        status: 'terkonfirmasi',
        message: 'Consultation confirmed successfully',
        consultation,
      };

      markIdempotencySuccess(idempotencyKey, response);
      return response;
    } catch (error) {
      markIdempotencyFailed(idempotencyKey, error);
      throw error;
    }
  }

  const request: Types.ConfirmConsultationRequest = { idempotencyKey };
  return apiFetch<Types.ConfirmConsultationResponse>(
    `/consultations/${consultationId}/confirm`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
      idempotencyKey,
      userId: balaiId,
    }
  );
}

export async function rejectConsultation(
  balaiId: string,
  consultationId: string,
  reason: string
): Promise<Types.RejectConsultationResponse> {
  const idempotencyKey = generateIdempotencyKey(balaiId, `reject-${consultationId}`);

  if (USE_MOCK) {
    if (isRequestPending(idempotencyKey)) {
      throw new Error('Request already in progress. Please wait...');
    }

    const cachedResponse = getSuccessfulResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse as Types.RejectConsultationResponse;
    }

    storeIdempotencyRecord({
      key: idempotencyKey,
      endpoint: `/consultations/${consultationId}/reject`,
      userId: balaiId,
      action: `reject-${consultationId}`,
      timestamp: Date.now(),
      status: 'PENDING',
    });

    try {
      await simulateNetworkDelay();

      const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId);
      if (!consultation) {
        throw new Error('Consultation not found');
      }

      consultation.status = 'dibatalkan';
      consultation.cancellationReason = reason;

      const response: Types.RejectConsultationResponse = {
        id: consultationId,
        status: 'dibatalkan',
        message: 'Consultation rejected successfully',
        consultation,
      };

      markIdempotencySuccess(idempotencyKey, response);
      return response;
    } catch (error) {
      markIdempotencyFailed(idempotencyKey, error);
      throw error;
    }
  }

  const request: Types.RejectConsultationRequest = { idempotencyKey, reason };
  return apiFetch<Types.RejectConsultationResponse>(
    `/consultations/${consultationId}/reject`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
      idempotencyKey,
      userId: balaiId,
    }
  );
}

export async function completeConsultation(
  balaiId: string,
  consultationId: string,
  verificationId: string
): Promise<Types.CompleteConsultationResponse> {
  const idempotencyKey = generateIdempotencyKey(balaiId, `complete-${consultationId}`);

  if (USE_MOCK) {
    if (isRequestPending(idempotencyKey)) {
      throw new Error('Request already in progress. Please wait...');
    }

    const cachedResponse = getSuccessfulResponse(idempotencyKey);
    if (cachedResponse) {
      return cachedResponse as Types.CompleteConsultationResponse;
    }

    storeIdempotencyRecord({
      key: idempotencyKey,
      endpoint: `/consultations/${consultationId}/complete`,
      userId: balaiId,
      action: `complete-${consultationId}`,
      timestamp: Date.now(),
      status: 'PENDING',
    });

    try {
      await simulateNetworkDelay();

      const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId);
      if (!consultation) {
        throw new Error('Consultation not found');
      }

      consultation.status = 'selesai';
      consultation.consultationId = verificationId;

      const response: Types.CompleteConsultationResponse = {
        id: consultationId,
        status: 'selesai',
        message: 'Consultation completed successfully',
        consultation,
      };

      markIdempotencySuccess(idempotencyKey, response);
      return response;
    } catch (error) {
      markIdempotencyFailed(idempotencyKey, error);
      throw error;
    }
  }

  const request: Types.CompleteConsultationRequest = { idempotencyKey, verificationId };
  return apiFetch<Types.CompleteConsultationResponse>(
    `/consultations/${consultationId}/complete`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
      idempotencyKey,
      userId: balaiId,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING CONFIRMATION / INBOX APIs (Warga)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all booking confirmations (inbox) for a warga user
 * Shows confirmed bookings with session keys
 */
export async function getBookingConfirmations(
  userId: string,
  options?: Types.GetBookingConfirmationsRequest
): Promise<Types.GetBookingConfirmationsResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    // Filter consultations that are confirmed/completed for this user (only these have keys)
    let filtered = MOCK_CONSULTATIONS.filter(
      (c) => c.user.id === userId && (c.status === 'terkonfirmasi' || c.status === 'selesai')
    );

    if (options?.status && options.status !== 'all') {
      filtered = filtered.filter((c) => c.status === options.status);
    }

    // Map to BookingConfirmation with generated keys
    return filtered.map((consultation) => ({
      id: `bc-${consultation.id}`,
      consultationId: consultation.id,
      userId: consultation.user.id,
      balaiLocation: consultation.balaiLocation,
      balaiId: 'balai-1', // Default balai ID
      date: consultation.date,
      timeSlot: consultation.timeSlot,
      sessionKey: generateSessionKey(consultation.id), // Generated deterministically from consultationId
      sessionKeyVisible: consultation.status === 'terkonfirmasi' || consultation.status === 'selesai', // Visible after admin confirms
      status: consultation.status,
      confirmationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.page) params.set('page', options.page.toString());
  if (options?.size) params.set('size', options.size.toString());

  return apiFetch<Types.GetBookingConfirmationsResponse>(
    `/confirmations/inbox?${params.toString()}`,
    { method: 'GET', userId }
  );
}

/**
 * Get a single booking confirmation by ID
 */
export async function getBookingConfirmation(
  userId: string,
  confirmationId: string
): Promise<Types.GetBookingConfirmationResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    
    const consultationId = confirmationId.replace('bc-', '');
    const consultation = MOCK_CONSULTATIONS.find((c) => c.id === consultationId && c.user.id === userId);
    
    if (!consultation) {
      throw new Error('Booking confirmation not found');
    }

    return {
      booking: {
        id: confirmationId,
        consultationId: consultation.id,
        userId: consultation.user.id,
        balaiLocation: consultation.balaiLocation,
        balaiId: 'balai-1', // Default balai ID
        date: consultation.date,
        timeSlot: consultation.timeSlot,
        sessionKey: generateSessionKey(consultation.id),
        sessionKeyVisible: consultation.status === 'sedang_berjalan' || consultation.status === 'selesai',
        status: consultation.status,
        confirmationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: 'Booking confirmation retrieved successfully',
    };
  }

  return apiFetch<Types.GetBookingConfirmationResponse>(
    `/confirmations/inbox/${confirmationId}`,
    { method: 'GET', userId }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a deterministic session key from consultation ID
 * In production, this would come from the backend
 */
function generateSessionKey(consultationId: string): string {
  // Create a deterministic key from consultation ID
  const hash = consultationId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const key = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `PKP-${key.slice(0, 4)}-${key.slice(4, 8)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BALAI INFO APIs
// ═══════════════════════════════════════════════════════════════════════════

export async function getBalaiList(): Promise<Types.BalaiInfo[]> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return [
      {
        id: 'balai-1',
        name: 'Balai Jawa 1',
        location: 'Jakarta',
        phone: '+62-21-123-4567',
        email: 'balai1@pkp.go.id',
      },
      {
        id: 'balai-2',
        name: 'Balai Jawa 2',
        location: 'Bandung',
        phone: '+62-22-123-4567',
        email: 'balai2@pkp.go.id',
      },
      {
        id: 'balai-3',
        name: 'Balai Sumatera 1',
        location: 'Medan',
        phone: '+62-61-123-4567',
        email: 'balai3@pkp.go.id',
      },
    ];
  }

  return apiFetch<Types.BalaiInfo[]>('/balai/list', { method: 'GET' });
}

export async function getAvailableSlots(
  balaiId: string,
  date: string
): Promise<Types.GetAvailableSlotsResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return [
      { timeSlot: '07.00 - 08.00', available: true, bookedCount: 0, maxCapacity: 5 },
      { timeSlot: '09.00 - 10.00', available: true, bookedCount: 2, maxCapacity: 5 },
      { timeSlot: '11.00 - 12.00', available: false, bookedCount: 5, maxCapacity: 5 },
      { timeSlot: '13.00 - 14.00', available: true, bookedCount: 1, maxCapacity: 5 },
      { timeSlot: '15.00 - 16.00', available: true, bookedCount: 0, maxCapacity: 5 },
    ];
  }

  return apiFetch<Types.GetAvailableSlotsResponse>(
    `/balai/${balaiId}/available-slots?date=${date}`,
    { method: 'GET' }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS APIs
// ═══════════════════════════════════════════════════════════════════════════

export async function getDashboardStats(
  balaiId: string
): Promise<Types.DashboardStats> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    const today = new Date().toISOString().split('T')[0];
    const todayConsultations = MOCK_CONSULTATIONS.filter((c) => c.date === today);

    return {
      todayTotal: todayConsultations.length,
      todayPending: todayConsultations.filter((c) => c.status === 'menunggu_konfirmasi').length,
      todayConfirmed: todayConsultations.filter((c) => c.status === 'terkonfirmasi').length,
      todayCompleted: todayConsultations.filter((c) => c.status === 'selesai').length,
      todayRejected: todayConsultations.filter((c) => c.status === 'dibatalkan').length,
    };
  }

  return apiFetch<Types.DashboardStats>(`/dashboard/stats?balaiId=${balaiId}`, {
    method: 'GET',
  });
}
