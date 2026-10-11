import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

// ── API Initialization ──────────────────────────────────────────────────────
import { initializeApi } from './api/config';

// ── Unified Auth ────────────────────────────────────────────────────────────
import { AuthProvider } from './Warga/components/Auth/authContext';
import { ProtectedRoute, PublicRoute, BalaiPublicRoute, BalaiProtectedRoute } from './Warga/components/Auth/RouteGuards';
import TokenExpirationWarning from './Warga/components/Auth/TokenExpirationWarning';

// ── Notifications ──────────────────────────────────────────────────────────
import { NotificationProvider } from './Balai/context/NotificationContext';

// ── Warga Pages ─────────────────────────────────────────────────────────────
import LandingPage from './Warga/pages/LandingPage';
import Login from './Warga/pages/auth/Login';
import Register from './Warga/pages/auth/Register';
import KonsultasiPage from './Warga/pages/KonsultasiPage';
import InboxPage from './Warga/pages/InboxPage';
import BalaiDetailPage from './Warga/pages/BalaiDetailPage';

// ── Balai Pages ─────────────────────────────────────────────────────────────
import DashboardKonsulOffline from './Balai/pages/DashboardKonsulOffline';

function AppContent() {
  useEffect(() => {
    // Initialize API layer on app mount
    initializeApi();
  }, []);

  return (
    <>
      <Routes>
        {/* ── Rute Publik Umum ─────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Warga: Rute Tamu (belum login) ───────────────────────── */}
        <Route element={<PublicRoute />}>
          <Route path="/masuk" element={<Login />} />
          <Route path="/daftar" element={<Register />} />
        </Route>

        {/* ── Balai: Rute Tamu (belum login) - MUST come before /balai/:regionId ─────── */}
        <Route element={<BalaiPublicRoute />}>
          <Route path="/balai/masuk" element={<Login />} />
        </Route>

        {/* ── Balai Detail untuk Warga - MUST come after /balai/masuk ───────────────── */}
        <Route path="/balai/:regionId" element={<BalaiDetailPage />} />

        {/* ── Warga: Rute Terproteksi ───────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/profile" element={<div className="p-20 text-center font-bold text-[#244860]">Halaman Profil Saya</div>} /> */}
          <Route path="/konsultasi" element={<KonsultasiPage />} />
          <Route path="/kotak-masuk" element={<InboxPage />} />
        </Route>

        {/* ── Balai: Rute Terproteksi ───────────────────────────────── */}
        <Route element={<BalaiProtectedRoute />}>
          <Route path="/dashboard-balai" element={<DashboardKonsulOffline />} />
          {/* <Route path="/balai/profile" element={<div className="p-20 text-center font-bold text-[#244860]">Halaman Profil Petugas</div>} /> */}
        </Route>

        {/* ── Fallback 404 ──────────────────────────────────────────── */}
        <Route path="*" element={<div className="p-20 text-center font-bold">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>

      {/* Token Expiration Warning - visible when token is about to expire */}
      <TokenExpirationWarning />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
