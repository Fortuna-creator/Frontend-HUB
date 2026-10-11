import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VscPerson, VscLock, VscCallOutgoing, VscMap, VscLoading, VscCheckAll, VscError } from 'react-icons/vsc';
import AuthLayout from '../../components/Auth/AuthLayout';
import OtpVerificationModal from '../../components/Auth/OtpVerificationModal';
import type { AuthRegisterRequest } from '../../../api/types';
import * as apiService from '../../../api/service';
import { validatePassword, getPasswordStrengthLabel, getPasswordStrengthColor, validateRegistrationForm, sanitizeField } from '../../../utils/validation';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(validatePassword(''));
  
  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate form before submission
      const validationResult = validateRegistrationForm({
        name,
        email,
        password,
        nik,
        phone,
        address,
      });

      if (!validationResult.valid) {
        const errors: Record<string, string> = {};
        Object.entries(validationResult.errors).forEach(([key, value]) => {
          if (typeof value === 'string') {
            errors[key] = value;
          } else if (value && typeof value === 'object' && 'errors' in value) {
            errors[key] = value.errors[0] || 'Validasi gagal';
          }
        });
        setFieldErrors(errors);
        setError('Mohon perbaiki kesalahan pada formulir');
        setLoading(false);
        return;
      }

      // Sanitize inputs before sending to backend
      const sanitizedData: AuthRegisterRequest = {
        username: sanitizeField(email.split('@')[0], 'text'),
        email: sanitizeField(email, 'email'),
        password, // Password should NOT be sanitized
        fullName: sanitizeField(name, 'text'),
        nik: sanitizeField(nik, 'number'),
        phone: sanitizeField(phone, 'number'),
        address: sanitizeField(address, 'text'),
        role: 'Warga',
      };

      // Register the user
      // Backend automatically sends OTP to email
      await apiService.registerUser(sanitizedData);

      // Registration successful - OTP was auto-sent to email
      // Show OTP verification modal
      setRegisteredEmail(email);
      setShowOtpModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrasi gagal';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Update password strength in real-time
    const strength = validatePassword(newPassword);
    setPasswordStrength(strength);
    
    // Clear password error if user is improving password
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleOtpVerified = async (response: { token: string | null; userId: number; fullName: string; email: string; role: string; status?: string; balaiId?: string | null; expiresIn?: number }) => {
    // OTP verified when status is VERIFIED (token is in HttpOnly cookie, not in response)
    if (response && response.status === 'VERIFIED') {
      try {
        // Create and store user object (token is stored as HttpOnly cookie by backend)
        const user = {
          id: response.userId.toString(),
          fullName: response.fullName,
          email: response.email,
          role: response.role === 'HOMEOWNER' ? 'Warga' : 'Balai',
          username: response.email.split('@')[0],
          balaiId: response.balaiId,
        };
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Calculate token expiration from expiresIn (Unix timestamp in milliseconds)
        if (response.expiresIn) {
          localStorage.setItem('auth_token_expires', response.expiresIn.toString());
        }
        
        // Redirect to home - auth context will pick up the stored user and HttpOnly cookie
        window.location.href = '/';
      } catch {
        setError('Gagal memproses verifikasi. Silakan coba login secara manual.');
        setShowOtpModal(false);
      }
    } else {
      setError('Verifikasi gagal. Status respond tidak VERIFIED. Silakan coba lagi.');
      setShowOtpModal(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-[#FDFBF5] rounded-lg border border-gray-300 shadow-lg p-1.5">
        <div className="relative bg-[#FDFBF5] rounded-md p-8 pt-12 space-y-6">

          <h1 className="text-3xl font-bold text-center text-gray-800 border-b border-gray-300 pb-4">
            Daftar
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} className={`w-full py-3 px-4 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${fieldErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
              {fieldErrors.name && <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><VscPerson className="h-5 w-5 text-gray-400" /></span>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className={`w-full py-3 pl-4 pr-10 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${fieldErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
              {fieldErrors.email && <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><VscLock className="h-5 w-5 text-gray-400" /></span>
              <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required disabled={loading} className={`w-full py-3 pl-4 pr-10 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${fieldErrors.password ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                {/* Strength Bar */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: i <= passwordStrength.score ? getPasswordStrengthColor(passwordStrength.score) : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>

                {/* Strength Label */}
                <p className="text-xs font-semibold" style={{ color: getPasswordStrengthColor(passwordStrength.score) }}>
                  Kekuatan Password: {getPasswordStrengthLabel(passwordStrength.score)}
                </p>

                {/* Error Messages */}
                {passwordStrength.errors.length > 0 && (
                  <div className="space-y-1">
                    {passwordStrength.errors.map((error, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-red-600 text-xs">
                        <VscError className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Success Messages */}
                {passwordStrength.valid && (
                  <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                    <VscCheckAll className="w-4 h-4 shrink-0" />
                    <span>Password memenuhi semua persyaratan!</span>
                  </div>
                )}
              </div>
            )}
            <div className="relative">
              <input type="text" placeholder="NIK (Nomor Induk Kependudukan)" value={nik} onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))} required maxLength={16} disabled={loading} className={`w-full py-3 px-4 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${fieldErrors.nik ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
              {fieldErrors.nik && <p className="text-red-600 text-xs mt-1">{fieldErrors.nik}</p>}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><VscCallOutgoing className="h-5 w-5 text-gray-400" /></span>
              <input type="tel" placeholder="No Telp (Nomor Telepon)" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))} required disabled={loading} className={`w-full py-3 pl-4 pr-10 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${fieldErrors.phone ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
              {fieldErrors.phone && <p className="text-red-600 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-0 top-3 flex items-start pr-3"><VscMap className="h-5 w-5 text-gray-400" /></span>
              <textarea placeholder="Alamat Domisili (Alamat Tempat Tinggal)" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} disabled={loading} className={`w-full py-3 pl-4 pr-10 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 transition-all disabled:opacity-50 resize-none ${fieldErrors.address ? 'border-red-500 focus:ring-red-400' : 'border-transparent focus:ring-[#BFAF7A]'}`} />
              {fieldErrors.address && <p className="text-red-600 text-xs mt-1">{fieldErrors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4C191] text-white font-bold py-3 rounded-full hover:bg-[#C8B68A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <VscLoading className="animate-spin" /> : null}
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </form>

          <div className="text-center text-xs text-gray-500 space-x-4">
            <Link to="/ketentuan" className="hover:underline">Ketentuan Layanan</Link>
            <Link to="/kebijakan" className="hover:underline">Kebijakan Privasi</Link>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-gray-600">Sudah punya akun? </span>
            <Link to="/masuk" className="text-[#BFAF7A] font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <OtpVerificationModal
          email={registeredEmail}
          onVerified={handleOtpVerified}
          onCancel={() => setShowOtpModal(false)}
        />
      )}
    </AuthLayout>
  );
};

export default Register;