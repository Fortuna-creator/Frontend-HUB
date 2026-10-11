import { useState, useEffect } from 'react';
import { VscClose, VscWarning } from 'react-icons/vsc';
import { useAuth } from './useAuth';

/**
 * TokenExpirationWarning Component
 * Shows a warning banner when user's session is about to expire
 * Allows them to refresh the session or logout
 */
export default function TokenExpirationWarning() {
  const { isTokenExpiring, secondsUntilExpiry, logout } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when warning starts showing
  useEffect(() => {
    if (isTokenExpiring) {
      // Reset dismissed state when token starts expiring
      const timer = setTimeout(() => setIsDismissed(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isTokenExpiring]);

  if (!isTokenExpiring || isDismissed) {
    return null;
  }

  const minutes = Math.floor(secondsUntilExpiry / 60);
  const seconds = secondsUntilExpiry % 60;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-lg p-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-start gap-3">
        <VscWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-semibold text-amber-900 mb-1">
            Sesi Anda Akan Berakhir
          </h3>

          {/* Time remaining */}
          <p className="text-sm text-amber-800 mb-3">
            Waktu tersisa:{' '}
            <span className="font-mono font-bold text-amber-700">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </p>

          {/* Message */}
          <p className="text-xs text-amber-700 mb-4">
            Untuk keamanan akun Anda, sesi ini akan berakhir jika tidak ada aktivitas. 
            Harap simpan pekerjaan Anda sebelum terlambat.
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Simple refresh: page reload to get new token
                // In production, could implement token refresh endpoint
                window.location.reload();
              }}
              className="flex-1 px-3 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700 transition-colors"
            >
              Perpanjang Sesi
            </button>
            <button
              onClick={logout}
              className="flex-1 px-3 py-2 bg-amber-100 text-amber-900 text-sm font-semibold rounded hover:bg-amber-200 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-600 hover:text-amber-800 shrink-0"
          aria-label="Tutup"
        >
          <VscClose className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-amber-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-1000"
          style={{
            width: `${(secondsUntilExpiry / (15 * 60)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
