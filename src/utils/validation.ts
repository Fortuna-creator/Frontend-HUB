/**
 * Input Validation & Sanitization Utility
 * Prevents invalid data and basic injection attacks
 */

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

export interface PasswordStrength {
  valid: boolean;
  score: number; // 0-5: very weak to very strong
  errors: string[];
  suggestions: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check length
  if (password.length < 8) {
    errors.push('Minimal 8 karakter');
  } else if (password.length >= 8) {
    score++;
    if (password.length >= 12) score++;
  }

  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Minimal 1 huruf besar (A-Z)');
    suggestions.push('Tambahkan huruf besar');
  } else {
    score++;
  }

  // Check lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Minimal 1 huruf kecil (a-z)');
    suggestions.push('Tambahkan huruf kecil');
  } else {
    score++;
  }

  // Check numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Minimal 1 angka (0-9)');
    suggestions.push('Tambahkan angka');
  } else {
    score++;
  }

  // Check special characters
  if (!/[!@#$%^&*()_+=[\]{};':"\\|,.< >/?-]/.test(password)) {
    errors.push('Minimal 1 karakter spesial (!@#$%^&* dll)');
    suggestions.push('Tambahkan karakter spesial (!@#$%^&*)');
  } else {
    score++;
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Kata sandi terlalu umum');
    suggestions.push('Gunakan kata sandi yang lebih unik');
    score = 0;
  }

  // Normalize score to 0-5
  score = Math.min(score, 5);

  return {
    valid: errors.length === 0,
    score,
    errors,
    suggestions,
  };
}

export function getPasswordStrengthLabel(score: number): string {
  const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat', 'Excellent'];
  return labels[score] || 'Tidak Valid';
}

export function getPasswordStrengthColor(score: number): string {
  const colors = ['#dc2626', '#f97316', '#eab308', '#84cc16', '#22c55e', '#059669'];
  return colors[score] || '#gray';
}

// ═══════════════════════════════════════════════════════════════════════════
// INPUT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validators = {
  // Full name: 3-50 chars, letters, spaces, hyphens, apostrophes only
  name: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Nama tidak boleh kosong' };
    if (value.length < 3) return { valid: false, error: 'Nama minimal 3 karakter' };
    if (value.length > 50) return { valid: false, error: 'Nama maksimal 50 karakter' };
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      return { valid: false, error: 'Nama hanya boleh berisi huruf, spasi, tanda hubung, dan tanda kutip' };
    }
    return { valid: true };
  },

  // Email: standard email format
  email: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Email tidak boleh kosong' };
    // RFC 5322 simplified
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { valid: false, error: 'Format email tidak valid' };
    }
    if (value.length > 254) {
      return { valid: false, error: 'Email terlalu panjang' };
    }
    return { valid: true };
  },

  // NIK: exactly 16 digits (Indonesian National ID)
  nik: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'NIK tidak boleh kosong' };
    if (!/^\d{16}$/.test(value)) {
      return { valid: false, error: 'NIK harus 16 angka' };
    }
    return { valid: true };
  },

  // Phone: Indonesian phone number formats
  phone: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Nomor telepon tidak boleh kosong' };
    // Accept: +62, 62, 0, followed by 9-12 digits
    if (!/^(\+62|62|0)[0-9]{9,12}$/.test(value)) {
      return { valid: false, error: 'Format nomor telepon tidak valid (contoh: +62812345678 atau 08123456789)' };
    }
    return { valid: true };
  },

  // Address: 10-500 chars, alphanumeric + basic punctuation
  address: (value: string): ValidationResult => {
    if (!value) return { valid: false, error: 'Alamat tidak boleh kosong' };
    if (value.length < 10) return { valid: false, error: 'Alamat minimal 10 karakter' };
    if (value.length > 500) return { valid: false, error: 'Alamat maksimal 500 karakter' };
    // Allow letters, numbers, spaces, common address characters
    if (!/^[a-zA-Z0-9\s,.\-/#()]+$/i.test(value)) {
      return { valid: false, error: 'Alamat mengandung karakter yang tidak diizinkan' };
    }
    return { valid: true };
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// INPUT SANITIZATION (XSS PREVENTION)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize HTML special characters to prevent XSS
 * Convert: < > " ' & to HTML entities
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Remove any HTML tags from input
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Trim whitespace and convert to safe format
 */
export function sanitizeField(input: string, type: 'text' | 'email' | 'number' = 'text'): string {
  let sanitized = input.trim();

  if (type === 'number') {
    sanitized = sanitized.replace(/[^0-9+-]/g, '');
  } else if (type === 'email') {
    sanitized = sanitized.toLowerCase();
  }

  // Remove HTML entities and tags
  sanitized = stripHtmlTags(sanitized);

  return sanitized;
}

// ═══════════════════════════════════════════════════════════════════════════
// FORM VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════════════════

export interface FormData {
  name: string;
  email: string;
  password: string;
  nik: string;
  phone: string;
  address: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: PasswordStrength;
  nik?: string;
  phone?: string;
  address?: string;
}

export function validateRegistrationForm(data: FormData): { valid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  // Validate each field
  const nameValidation = validators.name(data.name);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const emailValidation = validators.email(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) errors.password = passwordValidation;

  const nikValidation = validators.nik(data.nik);
  if (!nikValidation.valid) errors.nik = nikValidation.error;

  const phoneValidation = validators.phone(data.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;

  const addressValidation = validators.address(data.address);
  if (!addressValidation.valid) errors.address = addressValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
