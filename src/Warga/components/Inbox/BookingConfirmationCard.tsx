import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale/id';
import { VscCheck, VscWarning, VscEye, VscEyeClosed, VscCopy, VscLocation, VscCalendar } from 'react-icons/vsc';
import { IoMdTime } from "react-icons/io";
import type { BookingConfirmation } from '../../../api/types';
import { useState } from 'react';

interface BookingConfirmationCardProps {
  booking: BookingConfirmation;
  onCopyKey?: (key: string) => void;
}

export const BookingConfirmationCard = ({ booking, onCopyKey }: BookingConfirmationCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // In development: unlock session key for testing. In production: respect actual value
  const isDevMode = import.meta.env.DEV;
  const sessionKeyVisible = isDevMode || booking.sessionKeyVisible;

  const bookingDate = parseISO(booking.date);
  const formattedDate = format(bookingDate, 'dd MMMM yyyy', { locale: idLocale });
  const isConfirmed = booking.status === 'terkonfirmasi';
  const isOngoing = booking.status === 'sedang_berjalan';
  const isCompleted = booking.status === 'selesai';

  const handleCopyKey = () => {
    if (booking.sessionKey) {
      navigator.clipboard.writeText(booking.sessionKey);
      setCopied(true);
      onCopyKey?.(booking.sessionKey);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusDisplay = () => {
    if (isCompleted) return { label: 'Selesai', classes: 'bg-green-50 text-green-700 border-green-200' };
    if (isOngoing) return { label: 'Sedang Berjalan', classes: 'bg-[#244860]/10 text-[#244860] border-[#244860]/30' };
    // Changed to a crisp, professional slate for the confirmed state
    if (isConfirmed) return { label: 'Terkonfirmasi', classes: 'bg-slate-50 text-slate-700 border-slate-300' }; 
    return { label: booking.status, classes: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const status = getStatusDisplay();

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Decorative Branding Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#244860] to-[#BFAF7A]"></div>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#244860]">
              Jadwal Konsultasi
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Cek detail sesi dan lokasi Anda di bawah ini
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider whitespace-nowrap ${status.classes}`}>
            {status.label}
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-5 border-y border-gray-100 mb-6">
          <div className="flex items-start gap-3">
            <VscCalendar className="w-5 h-5 text-[#BFAF7A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Tanggal</p>
              <p className="font-semibold text-[#244860]">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IoMdTime className="w-5 h-5 text-[#BFAF7A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Waktu</p>
              <p className="font-semibold text-[#244860]">{booking.timeSlot} WIB</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <VscLocation className="w-5 h-5 text-[#BFAF7A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Lokasi</p>
              <p className="font-semibold text-[#244860]">{booking.balaiLocation}</p>
            </div>
          </div>
        </div>

        {/* Session Key Section */}
        {sessionKeyVisible && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <VscWarning className="w-5 h-5 text-[#BFAF7A] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#244860]">Kunci Sesi Rahasia</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Berikan kunci ini kepada konselor <strong className="text-[#244860]">hanya</strong> untuk mengakhiri sesi. Jangan bagikan sebelumnya.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border-2 border-[#244860] p-1.5 flex items-center justify-between">
              <div className="px-3 flex-1">
                {showKey ? (
                  <code className="text-xl font-mono font-bold text-[#244860] tracking-widest">
                    {booking.sessionKey}
                  </code>
                ) : (
                  <div className="flex items-center gap-1 h-7">
                    <span className="text-xl font-mono font-bold text-gray-300 tracking-widest">••••••••</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 border-l border-gray-100 pl-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-[#244860]"
                  title={showKey ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
                >
                  {showKey ? <VscEyeClosed className="w-5 h-5" /> : <VscEye className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleCopyKey}
                  className={`p-2 rounded-md transition-colors flex items-center justify-center ${
                    copied
                      ? 'bg-[#BFAF7A] text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-[#244860]'
                  }`}
                  title="Salin kunci"
                >
                  {copied ? <VscCheck className="w-5 h-5" /> : <VscCopy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                <VscCheck className="w-3 h-3" /> Disalin ke clipboard
              </p>
            )}
          </div>
        )}

        {/* Waiting for Key Message */}
        {!sessionKeyVisible && isConfirmed && (
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-[#244860] animate-pulse"></div>
            <p className="text-sm text-gray-600">
              Kunci sesi akan tersedia saat waktu konsultasi dimulai.
            </p>
          </div>
        )}

        {/* Completed Session Message */}
        {isCompleted && (
          <div className="flex items-start gap-3 py-3 px-4 bg-green-50/50 rounded-lg border border-green-100">
            <VscCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              Sesi konsultasi Anda telah selesai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};