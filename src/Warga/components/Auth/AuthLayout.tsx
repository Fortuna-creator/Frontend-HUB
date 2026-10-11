import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#EBEAE6]">
      {/* Auth Header */}
      <header className="bg-[#244860] py-4 px-8 shadow-md">
        <Link to="/" className="flex items-center space-x-4 max-w-7xl mx-auto hover:opacity-80 transition-opacity cursor-pointer">
          <div>
            <p className="text-white font-bold text-lg leading-tight">Website Reservasi Booking Balai</p>
          </div>
        </Link>
      </header>

      {/* Form Container */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        {children}
      </main>

      {/* Auth Footer */}
      <footer className="bg-[#244860] text-white py-8 px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6 text-[10px] font-medium">
          <div className="flex space-x-6 uppercase tracking-widest">
            <Link to="/kebijakan" className="hover:text-[#BFAF7A]">Kebijakan Privasi</Link>
            <Link to="/syarat" className="hover:text-[#BFAF7A]">Syarat Layanan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;