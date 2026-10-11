import { useState } from 'react';
import AuthLayout from '../../components/Auth/AuthLayout';
import LoginForm from '../../components/Auth/LoginForm';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';

type AuthView = 'login' | 'forgotPassword' | 'success';

const Login = () => {
  const [view, setView] = useState<AuthView>('login');

  const TITLES: Record<AuthView, string> = {
    login: 'MASUK',
    forgotPassword: 'KATA SANDI BARU',
    success: 'BERHASIL',
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-[#FDFBF5] rounded-xl border border-gray-200 shadow-2xl p-10 space-y-8">

        <h1 className="text-2xl font-black text-center text-[#244860] border-b border-gray-100 pb-6 uppercase tracking-tighter">
          {TITLES[view]}
        </h1>

        {view === 'login' && (
          <>
            <LoginForm onForgotPasswordClick={() => setView('forgotPassword')} />
          </>
        )}

        {view === 'forgotPassword' && (
          <ForgotPasswordForm onSuccess={() => setView('success')} />
        )}

        {view === 'success' && (
          <div className="text-center space-y-6">
            <p className="text-gray-600 font-medium text-sm">
              Tautan atur ulang kata sandi telah dikirim ke email Anda.
            </p>
            <button
              onClick={() => setView('login')}
              className="w-full bg-[#244860] text-white font-bold py-3 rounded-md uppercase text-xs tracking-widest"
            >
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;