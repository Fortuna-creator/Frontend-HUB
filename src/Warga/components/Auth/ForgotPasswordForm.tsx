import { useState } from 'react';
import { VscMail } from 'react-icons/vsc';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle dummy API call here
    console.log("Reset link requested for:", email);
    onSuccess(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi.
        </p>
      </div>

      <div className="relative">
        <VscMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        <input 
          type="email" 
          placeholder="Email Terdaftar"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full py-3 pl-12 pr-4 bg-gray-100 rounded-md text-sm border border-transparent focus:border-[#BFAF7A] outline-none transition-all" 
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#244860] text-white font-black py-4 rounded-full uppercase tracking-widest text-xs shadow-lg hover:bg-[#1a3547] transition-all"
      >
        Kirim Tautan
      </button>
    </form>
  );
};

export default ForgotPasswordForm;