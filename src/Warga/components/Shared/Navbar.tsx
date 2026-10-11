import { useState, useRef, useEffect, type ReactNode } from 'react';
import { NavLink as RouterNavLink, Link, useNavigate } from 'react-router-dom';
import { VscMenu, VscClose, VscChevronDown, VscSignOut, VscBell } from 'react-icons/vsc';
import { useAuth } from '../Auth/useAuth';

const landingNavLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/konsultasi', label: 'Balai' },
];

// Additional links for logged-in Warga users
const wargaAuthNavLinks = [
  { href: '/kotak-masuk', label: 'Kotak Masuk', icon: VscBell },
];

interface LandingNavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
  icon?: any;
}

const LandingNavLink = ({ href, children, onClick, isMobile = false, icon }: LandingNavLinkProps) => {
  const Icon = icon;
  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      end={href === "/"}
      className={({ isActive }) => {
        const baseClasses = 'font-medium transition-colors duration-200 flex items-center gap-2';
        const activeClasses = 'bg-black/20 text-[#BFAF7A]';
        const inactiveClasses = 'text-gray-300 hover:bg-black/10 hover:text-white';
        
        if (isMobile) {
          return `w-full text-center py-4 text-sm ${baseClasses} justify-center ${isActive ? activeClasses : inactiveClasses}`;
        }
        
        return `flex items-center h-[65px] px-5 rounded-t-md text-sm ${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </RouterNavLink>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Hooking into the global auth state
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsProfileDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Determine which nav links to show
  const navLinks = user && user.role === 'Warga' 
    ? [...landingNavLinks, ...wargaAuthNavLinks]
    : landingNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-[#244860]">
      {/* Top Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4">
            <div>
              <p className="text-white font-bold text-lg leading-none">Website Reservasi Booking Balai</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* --- Inbox Icon (Warga only) - Always reserve space to prevent jitter --- */}
            {user && user.role === 'Warga' ? (
              <Link
                to="/kotak-masuk"
                className="hidden lg:flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-[#BFAF7A] hover:bg-white/5 transition-colors"
                title="Kotak Masuk"
              >
                <VscBell className="w-5 h-5" />
              </Link>
            ) : (
              <div className="hidden lg:flex w-9" /> /* Reserve space when not logged in */
            )}
            {user ? (
              /* --- Logged In View --- */
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <img
                    className="h-9 w-9 rounded-full object-cover border border-gray-400"
                    src={`https://ui-avatars.com/api/?name=${user.fullName}&background=BFAF7A&color=244860`}
                    alt="User avatar"
                  />
                  <div className='text-left'>
                    <p className='text-white text-sm font-medium'>Hai, {user.fullName}!</p>
                    <p className='text-gray-300 text-xs font-bold uppercase'>{user.role}</p>
                  </div>
                  <VscChevronDown className={`text-gray-300 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-200">
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-bold">
                      <VscSignOut className="mr-2 h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- Guest View --- */
              <div className="hidden lg:flex items-center space-x-4">
                <Link to="/masuk" className="text-center text-[#BFAF7A] font-semibold py-2 px-6 rounded-md border border-[#BFAF7A] hover:bg-[#BFAF7A] hover:text-[#244860] transition-colors">
                  Masuk
                </Link>
                <Link to="/daftar" className="text-center bg-[#BFAF7A] text-[#244860] font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity">
                  Daftar
                </Link>
              </div>
            )}
            
            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 rounded-full text-[#BFAF7A]">
                {isMobileMenuOpen ? <VscClose size={28} /> : <VscMenu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Links only */}
      <div className="px-4 sm:px-6 lg:px-8 border-t border-[#BFAF7A]/30">
        <div className="hidden lg:flex items-center justify-start">
          <nav className="flex items-center space-x-2">
            {landingNavLinks.map((link) => (
              <LandingNavLink 
                key={link.href} 
                href={link.href}
              >
                {link.label}
              </LandingNavLink>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#244860] border-t border-[#BFAF7A]/20">
          <nav className="flex flex-col items-center">
            {navLinks.map((link) => (
              <LandingNavLink 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                isMobile={true}
                icon={'icon' in link ? link.icon : undefined}
              >
                {link.label}
              </LandingNavLink>
            ))}
            <div className="w-full p-6 border-t border-black/20">
              {user ? (
                <div className="flex flex-col items-center space-y-4">
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 w-full justify-center">
                    <img className="h-10 w-10 rounded-full border border-gray-400" src={`https://ui-avatars.com/api/?name=${user.fullName}&background=BFAF7A`} alt="avatar" />
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{user.fullName}</p>
                      <p className="text-gray-300 text-[10px] uppercase font-bold">{user.role}</p>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="w-full bg-red-600 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2">
                    <VscSignOut /> Keluar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/masuk" onClick={() => setIsMobileMenuOpen(false)} className="text-center border border-[#BFAF7A] text-[#BFAF7A] font-bold py-3 rounded-md">Masuk</Link>
                  <Link to="/daftar" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-[#BFAF7A] text-[#244860] font-bold py-3 rounded-md">Daftar</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
