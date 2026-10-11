/**
 * API Request/Response Types
 * Frontend contract for backend integration
 */

// ═══════════════════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AuthLoginRequest {
  email: string;
  password: string;
}

/**
 * Backend role enum mapping:
 * HOMEOWNER -> Warga (citizen/resident)
 * STAFF -> Balai (staff member)
 */
type BackendRole = 'HOMEOWNER' | 'STAFF';

/**
 * Internal: Actual response structure from backend
 * Note: token is null when using HttpOnly cookies (stored server-side)
 */
export interface BackendAuthLoginResponse {
  userId: number;
  fullName: string;
  email: string;
  token: string | null; // null when using HttpOnly cookies
  role: BackendRole;
  status?: string; // VERIFIED, ACTIVE, etc.
  activityStatus?: string;
  balaiId?: string | null; // UUID for Balai staff (STAFF role)
  expiresIn?: number;
}

/**
 * Frontend: Normalized response structure
 */
export interface AuthLoginResponse {
  token: string;
  balaiId?: string; // UUID for Balai staff (only present for STAFF role)
  user: {
    id: string;
    username: string;
    email: string;
    role: 'Warga' | 'Balai';
    fullName: string;
    unit?: string;
    balaiId?: string; // UUID for Balai staff
  };
}

export interface AuthRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  nik: string; // National ID Number
  phone: string; // No Telp (Phone Number)
  address: string; // Alamat Domisili (Domicile Address)
  role: 'Warga' | 'Balai';
  photo?: string;
}

export interface AuthRegisterResponse {
  message: string;
  username: string;
  email: string;
  fullName: string;
  nik: string;
  phone: string;
  address: string;
  role: 'Warga' | 'Balai';
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSULTATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ConsultationStatus =
  | 'menunggu_konfirmasi'
  | 'terkonfirmasi'
  | 'sedang_berjalan'
  | 'selesai'
  | 'dibatalkan';

export interface ConsultationUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

export interface ConsultationEntity {
  id: string;
  user: ConsultationUser;
  balaiLocation: string;
  balaiId?: string; // Backend will provide this
  date: string; // ISO Date string YYYY-MM-DD
  timeSlot: string; // e.g., "09.00 - 10.00"
  status: ConsultationStatus;
  consultationId?: string; // The verification ID
  topic?: string;
  description?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Consultation Booking ───────────────────────────────────────────────

export interface BookConsultationRequest {
  balaiId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "09.00 - 10.00"
  topic: string;
  description?: string;
}

export interface BookConsultationResponse {
  id: string;
  status: 'menunggu_konfirmasi';
  message: string;
  consultation: ConsultationEntity;
}

// ─── Get Consultations ─────────────────────────────────────────────────

export interface GetConsultationsRequest {
  status?: ConsultationStatus | 'all';
  page?: number;
  size?: number;
  date?: string; // YYYY-MM-DD (for Balai to filter by date)
  balaiId?: string; // For Balai to filter by their balai
}

export type GetConsultationsResponse = ConsultationEntity[];

// ─── Verify Consultation ────────────────────────────────────────────────

export interface VerifyConsultationRequest {
  verificationCode: string;
}

export interface VerifyConsultationResponse {
  verified: boolean;
  message: string;
  consultation: ConsultationEntity;
}

// ─── Confirm Consultation (Balai Action) ────────────────────────────────

export interface ConfirmConsultationRequest {
  idempotencyKey: string;
  notes?: string;
}

export interface ConfirmConsultationResponse {
  id: string;
  status: 'terkonfirmasi';
  message: string;
  consultation: ConsultationEntity;
}

// ─── Reject/Cancel Consultation (Balai Action) ──────────────────────────

export interface RejectConsultationRequest {
  idempotencyKey: string;
  reason: string;
}

export interface RejectConsultationResponse {
  id: string;
  status: 'dibatalkan';
  message: string;
  consultation: ConsultationEntity;
}

// ─── Complete Consultation (Balai Action) ────────────────────────────────

export interface CompleteConsultationRequest {
  idempotencyKey: string;
  verificationId: string;
}

export interface CompleteConsultationResponse {
  id: string;
  status: 'selesai';
  message: string;
  consultation: ConsultationEntity;
}

// ═══════════════════════════════════════════════════════════════════════════
// BALAI TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BalaiInfo {
  id: string;
  name: string;
  location: string;
  phone: string;
  email?: string;
  address?: string;
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface AvailableSlot {
  timeSlot: string;
  available: boolean;
  bookedCount: number;
  maxCapacity: number;
}

export interface GetAvailableSlotsRequest {
  date: string; // YYYY-MM-DD
}

export type GetAvailableSlotsResponse = AvailableSlot[];

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD/STATS TYPES (Balai Admin)
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  todayTotal: number;
  todayPending: number;
  todayConfirmed: number;
  todayCompleted: number;
  todayRejected: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface IdempotencyError extends ErrorResponse {
  idempotencyKey: string;
  status: 'PROCESSING' | 'FAILED' | 'CONFLICT';
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING CONFIRMATION / INBOX TYPES (Warga)
// ═══════════════════════════════════════════════════════════════════════════

export interface BookingConfirmation {
  id: string;
  consultationId: string; // Reference to the consultation
  userId: string;
  balaiLocation: string;
  balaiId: string;
  date: string; // ISO Date string YYYY-MM-DD
  timeSlot: string; // e.g., "09.00 - 10.00"
  sessionKey: string; // Confidential key for ending session
  sessionKeyVisible: boolean; // Whether to show the key to user (only visible after consultation starts)
  status: ConsultationStatus; // Status of the associated consultation
  confirmationDate: string; // When the balai confirmed this booking (ISO timestamp)
  createdAt: string;
  updatedAt: string;
}

export interface GetBookingConfirmationsRequest {
  status?: ConsultationStatus | 'all';
  page?: number;
  size?: number;
}

export type GetBookingConfirmationsResponse = BookingConfirmation[];

// ─── Get Single Booking Confirmation ────────────────────────────────────

export interface GetBookingConfirmationResponse {
  booking: BookingConfirmation;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
