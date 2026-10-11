import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Consultation } from '../../types/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale/id';

// ─── Shared Types ──────────────────────────────────────────────────────────
interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    consultation: Consultation | null;
    isProcessing?: boolean;
}

interface CompletionModalProps extends BaseModalProps {
    onSubmit: (id: string, consultationId: string) => void;
}

interface CancellationModalProps extends BaseModalProps {
    onSubmit: (id: string, reason: string) => void;
}

interface ActionModalProps extends BaseModalProps {
    onConfirm: (id: string) => void;
    onReject?: (id: string) => void;
}

// ─── Helper: Format date (YYYY-MM-DD → "Rabu, 7 Februari 2026") ───────────
const formatTanggal = (dateStr: string) => {
    try {
        return format(new Date(dateStr), 'EEEE, d MMMM yyyy', { locale: localeId });
    } catch {
        return dateStr;
    }
};

// ─── Helper: Shared "Data Pengguna" block ─────────────────────────────────
const DataPengguna = ({ consultation, statusLabel }: { consultation: Consultation; statusLabel: string }) => (
    <div className="space-y-1">
        <h4 className="font-bold text-[#2d5a3d] text-base mb-4">Data Pengguna</h4>

        <table className="w-full text-sm text-gray-800">
            <tbody>
                <DataRow label="Nama Lengkap" value={consultation.user.name} />
                <DataRow label="Nomor Telepon" value={consultation.user.phone} />
                <DataRow label="Email" value={consultation.user.email} />
                <DataRow label="Lokasi Balai" value={consultation.balaiLocation} />
                <DataRow label="Tanggal Konsultasi" value={formatTanggal(consultation.date)} />
                <DataRow label="Jam Konsultasi" value={consultation.timeSlot} />
            </tbody>
        </table>

        <p className="text-sm text-gray-800 pt-4">
            Status : <span className="font-medium">[{statusLabel}]</span>
        </p>
    </div>
);

const DataRow = ({ label, value }: { label: string; value: string }) => (
    <tr className="align-top">
        <td className="py-0.5 w-40 font-normal text-gray-700">{label}</td>
        <td className="py-0.5 pr-1 w-4">:</td>
        <td className="py-0.5">{value}</td>
    </tr>
);

// ─── Shared Button styles ─────────────────────────────────────────────────
const btnGreen = 'flex-1 bg-[#3d6b4f] hover:bg-[#2f5640] text-white font-medium py-2.5 px-6 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed';
const btnRed = 'flex-1 bg-[#9A2A1A] hover:bg-[#7d2215] text-white font-medium py-2.5 px-6 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed';

// ═══════════════════════════════════════════════════════════════════════════
// 1. Pending Confirmation Modal — "Untuk Konfirmasi"
// ═══════════════════════════════════════════════════════════════════════════
export const PendingConfirmationModal: React.FC<ActionModalProps> = ({
    isOpen, onClose, consultation, onConfirm, onReject, isProcessing
}) => {
    if (!consultation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Untuk Konfirmasi">
            <div className="space-y-6">
                <DataPengguna consultation={consultation} statusLabel="Menunggu Konfirmasi" />

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => onConfirm(consultation.id)}
                        disabled={isProcessing}
                        className={btnGreen}
                    >
                        {isProcessing ? 'Memproses...' : 'Terima Reservasi'}
                    </button>
                    {onReject && (
                        <button
                            onClick={() => onReject(consultation.id)}
                            disabled={isProcessing}
                            className={btnRed}
                        >
                            Tolak
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. Confirmed Detail Modal — "Sudah Konfirmasi"
//    Tombol "Selesai" hanya aktif jika waktu konsultasi sudah tiba
// ═══════════════════════════════════════════════════════════════════════════
export const ConfirmedDetailModal: React.FC<ActionModalProps> = ({
    isOpen, onClose, consultation, onConfirm, onReject, isProcessing
}) => {
    if (!consultation) return null;

    // Cek apakah waktu konsultasi sudah tiba
    const isTimeReached = (() => {
        try {
            const [startHour] = consultation.timeSlot.split('.').map(Number);
            const consultDate = new Date(consultation.date);
            consultDate.setHours(startHour, 0, 0, 0);
            return new Date() >= consultDate;
        } catch {
            return true; // fallback: izinkan
        }
    })();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isTimeReached ? 'Sudah Konfirmasi' : 'Sudah Konfirmasi tapi belum jam nya'}
        >
            <div className="space-y-6">
                <DataPengguna consultation={consultation} statusLabel="Telah di Konfirmasi" />

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => onConfirm(consultation.id)}
                        disabled={isProcessing || !isTimeReached}
                        className={btnGreen}
                    >
                        {isProcessing ? 'Memproses...' : 'Selesai'}
                    </button>
                    {onReject && (
                        <button
                            onClick={() => onReject(consultation.id)}
                            disabled={isProcessing}
                            className={btnRed}
                        >
                            Batalkan
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. Completion Modal — "Selesai Konsultasi"
// ═══════════════════════════════════════════════════════════════════════════
export const CompletionModal: React.FC<CompletionModalProps> = ({
    isOpen, onClose, consultation, onSubmit, isProcessing
}) => {
    const [verificationId, setVerificationId] = useState('');

    if (!consultation) return null;

    const handleSubmit = () => {
        if (verificationId.trim()) {
            onSubmit(consultation.id, verificationId);
            setVerificationId('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Selesai Konsultasi ${consultation.id}`}>
            <div className="space-y-5 text-sm text-gray-800">
                <p>
                    Konsultasi dengan <strong>{consultation.user.name}</strong> telah selesai.
                </p>
                <p>
                    Silakan masukkan Nomor Registrasi yang diberikan kepada pengguna untuk verifikasi:
                </p>

                <div className="space-y-2">
                    <p className="font-semibold">Nomor Registrasi :</p>
                    <div className="flex items-center gap-1 text-gray-600">
                        <span>[</span>
                        <input
                            type="text"
                            value={verificationId}
                            onChange={(e) => setVerificationId(e.target.value)}
                            disabled={isProcessing}
                            className="flex-1 border-0 border-b border-gray-400 focus:border-[#2d5a3d] outline-none py-1 bg-transparent text-gray-800 placeholder-gray-300 disabled:bg-transparent"
                            placeholder="________________________"
                        />
                        <span>]</span>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!verificationId.trim() || isProcessing}
                        className="bg-[#3d6b4f] hover:bg-[#2f5640] text-white font-medium py-2.5 px-6 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Memverifikasi...' : 'Selesaikan Konsultasi'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. Cancellation Modal — "Pembatalan Konsultasi"
// ═══════════════════════════════════════════════════════════════════════════
export const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen, onClose, consultation, onSubmit, isProcessing
}) => {
    const [reason, setReason] = useState('');

    if (!consultation) return null;

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(consultation.id, reason);
            setReason('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pembatalan Konsultasi">
            <div className="space-y-5 text-sm text-gray-800">
                <p>Apakah Anda yakin ingin membatalkan / menolak konsultasi ini?</p>

                <table className="w-full">
                    <tbody>
                        <DataRow label="Nama Lengkap" value={consultation.user.name} />
                        <DataRow label="Tanggal Konsultasi" value={formatTanggal(consultation.date)} />
                        <DataRow label="Jam Konsultasi" value={consultation.timeSlot} />
                    </tbody>
                </table>

                <div className="space-y-2 pt-1">
                    <p className="font-semibold">Alasan Pembatalan :</p>
                    <div className="flex items-center gap-1 text-gray-600">
                        <span>[</span>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isProcessing}
                            className="flex-1 border-0 border-b border-gray-400 focus:border-red-500 outline-none py-1 bg-transparent text-gray-800 placeholder-gray-300 disabled:bg-transparent"
                            placeholder="________________________"
                        />
                        <span>]</span>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim() || isProcessing}
                        className="bg-[#9A2A1A] hover:bg-[#7d2215] text-white font-medium py-2.5 px-6 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Memproses...' : 'Batalkan Konsultasi'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. Success Modal — ringkasan setelah konsultasi selesai diverifikasi
// ═══════════════════════════════════════════════════════════════════════════
export const SuccessModal: React.FC<BaseModalProps> = ({ isOpen, onClose, consultation }) => {
    if (!consultation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Konsultasi Selesai">
            <div className="space-y-5 text-sm text-gray-800">
                <p>
                    Konsultasi dengan <strong>{consultation.user.name}</strong> telah selesai diverifikasi.
                </p>

                <table className="w-full">
                    <tbody>
                        <DataRow label="Nama Lengkap" value={consultation.user.name} />
                        <DataRow label="Tanggal Konsultasi" value={formatTanggal(consultation.date)} />
                        <DataRow label="Jam Konsultasi" value={consultation.timeSlot} />
                        {consultation.consultationId && (
                            <DataRow label="Nomor Registrasi" value={consultation.consultationId} />
                        )}
                    </tbody>
                </table>

                <p className="pt-2">
                    Status : <span className="font-medium text-[#2d5a3d]">[Selesai]</span>
                </p>

                <div className="pt-2">
                    <button
                        onClick={onClose}
                        className="bg-[#244860] hover:bg-[#1e3a50] text-white font-medium py-2.5 px-6 rounded transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. Cancellation Summary Modal — Ringkasan setelah konsultasi dibatalkan
// ═══════════════════════════════════════════════════════════════════════════
export const CancellationSummaryModal: React.FC<BaseModalProps> = ({ isOpen, onClose, consultation }) => {
    if (!consultation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Konsultasi Dibatalkan">
            <div className="space-y-5 text-sm text-gray-800">
                <p>
                    Konsultasi dengan <strong>{consultation.user.name}</strong> telah dibatalkan.
                </p>

                <table className="w-full">
                    <tbody>
                        <DataRow label="Nama Lengkap" value={consultation.user.name} />
                        <DataRow label="Nomor Telepon" value={consultation.user.phone} />
                        <DataRow label="Email" value={consultation.user.email} />
                        <DataRow label="Lokasi Balai" value={consultation.balaiLocation} />
                        <DataRow label="Tanggal Konsultasi" value={formatTanggal(consultation.date)} />
                        <DataRow label="Jam Konsultasi" value={consultation.timeSlot} />
                    </tbody>
                </table>

                {consultation.cancellationReason && (
                    <div className="pt-1">
                        <p className="font-semibold mb-1">Alasan Pembatalan :</p>
                        <p className="text-gray-600 bg-gray-50 border border-gray-100 rounded px-3 py-2">
                            {consultation.cancellationReason}
                        </p>
                    </div>
                )}

                <p className="pt-1">
                    Status : <span className="font-medium text-[#9A2A1A]">[Dibatalkan]</span>
                </p>

                <div className="pt-2">
                    <button
                        onClick={onClose}
                        className="bg-[#244860] hover:bg-[#1a3547] text-white font-medium py-2.5 px-6 rounded transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </Modal>
    );
};
