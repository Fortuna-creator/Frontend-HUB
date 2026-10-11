import { useState, useRef, useEffect, type ReactNode } from 'react';
import { NavLink as RouterNavLink, Link, useNavigate } from 'react-router-dom';
import { VscMenu, VscClose, VscAccount, VscSignOut, VscBell } from 'react-icons/vsc';
import { useAuth } from '../../../Warga/components/Auth/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPopup from '../NotificationPopup';

// ─── Nav links for Balai role ──────────────────────────────────────────────
const balaiNavLinks = [
    { href: '/dashboard-balai', label: 'Dashboard' },
    // Tambahkan link navigasi balai lainnya di sini
];

// ─── NavLink component ─────────────────────────────────────────────────────
interface NavLinkProps {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    isMobile?: boolean;
}

const BalaiNavLink = ({ href, children, onClick, isMobile = false }: NavLinkProps) => (
    <RouterNavLink
        to={href}
        onClick={onClick}
        end
        className={({ isActive }) => {
            const base = 'font-medium text-sm transition-colors duration-200';
            const active = 'text-[#BFAF7A] border-b-2 border-[#BFAF7A]';
            const inactive = 'text-gray-300 hover:text-white';

            if (isMobile) {
                return `w-full text-center py-4 ${base} ${isActive ? 'bg-black/20 text-[#BFAF7A]' : inactive}`;
            }

            return `flex items-center h-[50px] px-6 ${base} ${isActive ? active : inactive}`;
        }}
    >
        {children}
    </RouterNavLink>
);

// ─── Main Navbar ───────────────────────────────────────────────────────────
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        navigate('/balai/masuk');
    };

    return (
        <header className="sticky top-0 z-50 bg-[#244860] shadow-md">

            {/* ── Top Bar: Logo + Title ─────────────────────────────────────── */}
            <div className="px-4 sm:px-6 lg:px-8 border-b border-white/10">
                <div className="flex items-center h-16">
                    <Link to="/dashboard-balai" className="flex items-center space-x-3">
                        <span className="text-white font-bold text-base tracking-wide">
                            Website Reservasi Booking Balai
                        </span>
                    </Link>
                </div>
            </div>

            {/* ── Bottom Bar: Nav links (center) + Bell + User (right) ─────── */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="hidden lg:flex items-center h-[50px]">

                    {/* Nav Links — centered */}
                    <nav className="flex-1 flex items-center justify-center space-x-1">
                        {balaiNavLinks.map((link) => (
                            <BalaiNavLink key={link.href} href={link.href}>
                                {link.label}
                            </BalaiNavLink>
                        ))}
                    </nav>

                    {/* Right side: Bell + User Profile */}
                    <div className="flex items-center space-x-3">

                        {/* Bell notification */}
                        <button
                            onClick={() => { setIsNotifOpen(o => !o); setIsProfileDropdownOpen(false); }}
                            className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <VscBell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full border border-[#244860]">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Popup */}
                        <NotificationPopup isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

                        {/* User Avatar + Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                            >
                                <img
                                    className="h-8 w-8 rounded-full object-cover border border-[#BFAF7A]/50"
                                    src={`https://ui-avatars.com/api/?name=${user?.fullName ?? 'User'}&background=BFAF7A&color=244860&bold=true`}
                                    alt="User avatar"
                                />
                                <div className="text-left">
                                    <p className="text-white text-sm font-semibold leading-tight">
                                        {user?.fullName ?? 'Pengguna'}
                                    </p>
                                    <p className="text-[#BFAF7A] text-[10px] font-bold uppercase tracking-wider">
                                        {user?.unit ?? user?.role ?? 'Balai'}
                                    </p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black/5">
                                    <Link
                                        to="/balai/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    >
                                        <VscAccount className="mr-2 h-4 w-4" />
                                        Profile Saya
                                    </Link>
                                    <div className="border-t border-gray-100 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-bold"
                                    >
                                        <VscSignOut className="mr-2 h-4 w-4" />
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile: hamburger button (right side of bottom bar) */}
                <div className="lg:hidden flex items-center justify-between h-[50px]">
                    <nav className="flex items-center space-x-2">
                        {balaiNavLinks.map((link) => (
                            <BalaiNavLink key={link.href} href={link.href}>
                                {link.label}
                            </BalaiNavLink>
                        ))}
                    </nav>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1 text-[#BFAF7A]"
                    >
                        {isMobileMenuOpen ? <VscClose size={26} /> : <VscMenu size={26} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Dropdown Menu ──────────────────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-[#244860] border-t border-[#BFAF7A]/20">
                    <nav className="flex flex-col items-center py-2">
                        {balaiNavLinks.map((link) => (
                            <BalaiNavLink
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                isMobile
                            >
                                {link.label}
                            </BalaiNavLink>
                        ))}
                    </nav>

                    {/* Mobile User Section */}
                    <div className="w-full p-4 border-t border-black/20">
                        <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-white/5">
                            <img
                                className="h-10 w-10 rounded-full border border-[#BFAF7A]/50"
                                src={`https://ui-avatars.com/api/?name=${user?.fullName ?? 'User'}&background=BFAF7A&color=244860&bold=true`}
                                alt="avatar"
                            />
                            <div>
                                <p className="text-white text-sm font-semibold">{user?.fullName ?? 'Pengguna'}</p>
                                <p className="text-[#BFAF7A] text-[10px] font-bold uppercase">{user?.unit ?? user?.role ?? 'Balai'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 text-sm"
                        >
                            <VscSignOut /> Keluar
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
