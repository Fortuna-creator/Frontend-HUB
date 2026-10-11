import { useState, useEffect, useRef } from 'react';
import { VscLoading, VscInbox, VscWarning } from 'react-icons/vsc';
import Navbar from '../../Warga/components/Shared/Navbar';
import Footer from '../../Warga/components/Shared/Footer';
import { BookingConfirmationCard } from '../../Warga/components/Inbox/BookingConfirmationCard';
import { useAuth } from '../../Warga/components/Auth/useAuth';
import { useGetBookingConfirmations } from '../../api/hooks';
import type { ConsultationStatus } from '../../api/types';

export default function InboxPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');
  const [debouncedFilter, setDebouncedFilter] = useState<ConsultationStatus | 'all'>('all');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce filter changes to prevent jitter
  useEffect(() => {
    filterTimeoutRef.current = setTimeout(() => {
      setDebouncedFilter(statusFilter);
    }, 300);

    return () => {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    };
  }, [statusFilter]);

  // Fetch booking confirmations with debounced filter
  const { data: confirmations, loading, error } = useGetBookingConfirmations(user?.id || '', {
    status: debouncedFilter,
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleCopyKey = (key: string) => {
    showNotification(`Kunci tersalin: ${key}`, 'success');
  };

  // Filter options
  const filterOptions = [
    { label: 'Semua', value: 'all' as const },
    { label: 'Terkonfirmasi', value: 'terkonfirmasi' as const },
    { label: 'Selesai', value: 'selesai' as const },
  ];

  return (
    <div className="bg-[#FDFBF5] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-[#244860] mb-2">Kotak Masuk Konsultasi</h1>
            <p className="text-gray-600 text-lg">
              Kelola dan pantau status konsultasi Anda. Kunci sesi akan ditampilkan saat konsultasi dimulai.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 border border-slate-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Filter Status:</p>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? 'bg-[#244860] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification */}
          {notification.message && (
            <div
              className={`rounded-lg p-4 mb-6 ${
                notification.type === 'success'
                  ? 'bg-green-100 border border-green-300 text-green-800'
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Content Area */}
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12">
              <VscLoading className="w-12 h-12 text-[#244860] animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Memuat konfirmasi konsultasi...</p>
            </div>
          ) : error ? (
            // Error State
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 flex items-start gap-4">
              <VscWarning className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Terjadi Kesalahan</h3>
                <p className="text-red-800">{error.message}</p>
              </div>
            </div>
          ) : confirmations && confirmations.length > 0 ? (
            // Confirmations List
            <div className="space-y-4">
              {confirmations.map((booking) => (
                <BookingConfirmationCard
                  key={booking.id}
                  booking={booking}
                  onCopyKey={handleCopyKey}
                />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <VscInbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Konfirmasi</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all'
                  ? 'Anda belum memiliki konsultasi yang dikonfirmasi. Lakukan pemesanan konsultasi terlebih dahulu.'
                  : `Tidak ada konsultasi dengan status "${statusFilter}" saat ini.`}
              </p>
              <a
                href="/konsultasi"
                className="inline-block px-6 py-3 bg-[#244860] text-white font-bold rounded-lg hover:bg-[#1a3547] transition-colors"
              >
                Pesan Konsultasi
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
