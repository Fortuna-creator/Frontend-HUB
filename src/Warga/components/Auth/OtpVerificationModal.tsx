import { useState, useEffect } from 'react';
import { VscLoading, VscCheck, VscClose } from 'react-icons/vsc';

interface OtpVerificationModalProps {
  email: string;
  onVerified: (response: any) => void;
  onCancel: () => void;
}

export default function OtpVerificationModal({ email, onVerified, onCancel }: OtpVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Dynamic import to avoid circular dependency
      const { verifyOtp } = await import('../../../api/service');
      
      const response = await verifyOtp(email, otp);
      
      // Backend returns user data with status='VERIFIED' when successful
      // Token is stored in HttpOnly cookie (not in response body)
      if (response.status === 'VERIFIED') {
        setSuccess(true);
        setTimeout(() => {
          onVerified(response);
        }, 1500);
      } else {
        setError('Kode OTP tidak valid');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verifikasi OTP gagal';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);

    try {
      const { resendOtp } = await import('../../../api/service');
      await resendOtp(email);
      setResendTimer(60); // 60 second cooldown
      setOtp('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Pengiriman ulang OTP gagal';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={loading || success}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <VscClose className="w-5 h-5" />
        </button>

        {!success ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#244860] mb-2">Verifikasi Email</h2>
              <p className="text-sm text-gray-600">
                Kami telah mengirim kode OTP ke <strong>{email}</strong>
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kode OTP (6 digit)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(value.slice(0, 6));
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#244860] disabled:bg-gray-100"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#244860] text-white font-bold py-3 rounded-lg uppercase text-sm tracking-widest hover:bg-[#1a3547] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <VscLoading className="animate-spin" />}
                {loading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>

              {/* Resend Button */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Tidak menerima kode?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resendTimer > 0}
                  className="text-[#244860] font-semibold hover:underline disabled:opacity-50 text-sm"
                >
                  {resendTimer > 0 ? `Kirim ulang dalam ${resendTimer}s` : 'Kirim ulang kode'}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Jangan bagikan kode OTP ini kepada siapa pun
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <VscCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Terverifikasi!</h3>
            <p className="text-sm text-gray-600">Email Anda telah diverifikasi dengan berhasil</p>
          </div>
        )}
      </div>
    </div>
  );
}
