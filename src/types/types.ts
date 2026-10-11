export type ConsultationStatus =
    | 'menunggu_konfirmasi'
    | 'terkonfirmasi'
    | 'selesai'
    | 'dibatalkan'
    | 'sedang_berjalan';

export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
}

export interface Consultation {
    id: string;
    user: User;
    balaiLocation: string;
    date: string; // ISO Date string YYYY-MM-DD
    timeSlot: string; // e.g., "09.00 - 10.00"
    status: ConsultationStatus;
    consultationId?: string; // The verification ID
    topic?: string;
    description?: string;
    cancellationReason?: string;
}
