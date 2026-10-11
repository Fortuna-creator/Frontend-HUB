import React from 'react';
import { User } from 'lucide-react';
import type { Consultation, ConsultationStatus } from '../../types/types';

interface ConsultationListProps {
    consultations: Consultation[];
    onSelect: (consultation: Consultation) => void;
}

// Meniru warna titik (dot) dari desain Figma
const getStatusDotColor = (status: ConsultationStatus) => {
    switch (status) {
        case 'selesai': return 'bg-[#4A6F56]'; // Hijau gelap (Selesai)
        case 'sedang_berjalan': return 'bg-[#F4D03F]'; // Kuning (Sedang Berjalan)
        case 'menunggu_konfirmasi': return 'bg-[#F39C12]'; // Oranye
        case 'terkonfirmasi': return 'bg-[#F4D03F]'; // Kuning (Telah di konfirmasi)
        case 'dibatalkan': return 'bg-[#E74C3C]'; // Merah
        default: return 'bg-gray-300';
    }
};

const getStatusLabel = (status: ConsultationStatus) => {
    switch (status) {
        case 'selesai': return 'Selesai';
        case 'sedang_berjalan': return 'Sedang Berjalan';
        case 'menunggu_konfirmasi': return 'Menunggu Konfirmasi';
        case 'terkonfirmasi': return 'Telah di Konfirmasi';
        case 'dibatalkan': return 'Dibatalkan';
        default: return status;
    }
};

export const ConsultationList: React.FC<ConsultationListProps> = ({ consultations, onSelect }) => {
    if (consultations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="font-medium text-sm">Tidak ada Aktivitas</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {consultations.map((consultation) => (
                <div
                    key={consultation.id}
                    // Desain baris mendatar dengan border bottom tipis
                    className="flex flex-col md:flex-row items-start md:items-center py-5 border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                    {/* Waktu (Kolom Paling Kiri) */}
                    <div className="w-full md:w-40 font-semibold text-gray-700 text-lg mb-3 md:mb-0 text-[#244860]">
                        {consultation.timeSlot}
                    </div>

                    {/* Info Detail (Kolom Tengah) */}
                    <div className="flex-1 flex flex-col gap-1.5 pl-0 md:pl-4 border-l-0 md:border-l border-transparent">

                        {/* Status dengan Titik Warna */}
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(consultation.status)}`}></span>
                            <span className="text-[13px] font-bold text-[#244860]">
                                {getStatusLabel(consultation.status)}
                            </span>
                        </div>

                        {/* Nama User */}
                        <div className="flex items-center gap-2 text-[13px] text-[#244860] ml-4">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-bold">{consultation.user.name}</span>
                        </div>

                        {/* ID Konsultasi */}
                        <div className="flex items-center gap-2 text-[12px] text-[#244860] ml-4">
                            <span className="bg-gray-100/80 px-1.5 py-0.5 rounded font-medium flex gap-1">
                                <span className="bg-gray-300 text-[10px] px-1 rounded flex items-center justify-center">ID</span>
                                Nomor Registrasi: <span className="font-mono">{consultation.consultationId || '-'}</span>
                            </span>
                        </div>
                    </div>

                    {/* Action (Kolom Paling Kanan) */}
                    <div className="mt-4 md:mt-0 flex-shrink-0 w-full md:w-auto flex justify-end">
                        <button
                            onClick={() => onSelect(consultation)}
                            className="px-5 py-1.5 border border-[#244860] rounded-full text-[12px] font-semibold text-[#244860] hover:bg-[#244860] hover:text-white transition-colors"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};