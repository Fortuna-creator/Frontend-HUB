import { useState } from 'react';
import { VscMail, VscLock } from 'react-icons/vsc';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
}

const LoginForm = ({ onForgotPasswordClick }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password, rememberMe);
    if (result.success && result.user) {
      // Get redirect destination from URL params, or use default
      const redirectTo = searchParams.get('redirect');
      
      if (result.user.role === 'Balai') {
        navigate(redirectTo || '/dashboard-balai');
      } else {
        // Warga: redirect to intended destination (konsultasi, balai detail, etc) or home
        navigate(redirectTo || '/');
      }
    } else {
      setError('Email atau kata sandi salah.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <VscMail className="h-5 w-5 text-gray-400" />
        </span>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full py-3 pl-10 pr-3 bg-gray-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#BFAF7A]" 
        />
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <VscLock className="h-5 w-5 text-gray-400" />
        </span>
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full py-3 pl-10 pr-3 bg-gray-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#BFAF7A]" 
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#BFAF7A] focus:ring-[#BFAF7A] cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 cursor-pointer">
          Ingat saya selama 7 hari
        </label>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button 
        type="submit" 
        className="w-full bg-[#D4C191] text-white font-bold py-3 rounded-md hover:bg-[#C8B68A] transition-colors"
      >
        Masuk
      </button>
      <button 
        type="button" 
        onClick={onForgotPasswordClick} 
        className="w-full text-center text-sm text-gray-500 hover:underline"
      >
        Lupa kata sandi?
      </button>
    </form>
  );
};

export default LoginForm;