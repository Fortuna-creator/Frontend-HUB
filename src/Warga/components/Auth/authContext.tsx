import { createContext, useState, useEffect, type ReactNode } from 'react';
import * as apiService from '../../../api/service';
import * as Types from '../../../api/types';

// Token expiration configuration
const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const REMEMBER_ME_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const WARNING_TIME = 30 * 60 * 1000; // 30 minutes before expiry

export interface User {
  id: string;
  fullName: string;
  role: 'Warga' | 'Balai';
  email: string;
  username: string;
  unit?: string; // Optional: unit/balai kerja for Balai role
  balaiId?: string; // Optional: UUID for Balai staff
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: User }>;
  register: (registerData: Types.AuthRegisterRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null; // Unix timestamp in ms
  isTokenExpiring: boolean; // True if expiring within 30 mins
  secondsUntilExpiry: number; // Seconds until token expires
  rememberMe: boolean; // Whether user opted for 7-day token
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState<number>(0);
  const [isTokenExpiring, setIsTokenExpiring] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for stored user on mount and validate expiration
  // Token is stored in HttpOnly cookie (not in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedExpiresAt = localStorage.getItem('auth_token_expires');
    const storedRememberMe = localStorage.getItem('auth_remember_me') === 'true';
    
    if (storedUser && storedExpiresAt) {
      try {
        const expiresAt = parseInt(storedExpiresAt, 10);
        const now = Date.now();
        
        // Check if token has expired
        if (now > expiresAt) {
          // Token expired, clear everything including logout
          logout();
          return;
        }
        
        // Token is valid, restore session using HttpOnly cookie
        // Set a marker token to indicate authenticated state (actual token is in HttpOnly cookie)
        setToken('HTTP_ONLY_COOKIE');
        setUser(JSON.parse(storedUser));
        setTokenExpiresAt(expiresAt);
        setRememberMe(storedRememberMe);
      } catch {
        // Invalid stored data, clear it
        logout();
      }
    }
  }, []);

  // Check token expiration every 10 seconds
  useEffect(() => {
    if (!tokenExpiresAt) return;

    const checkExpiration = () => {
      const now = Date.now();
      const timeRemaining = tokenExpiresAt - now;
      const secondsRemaining = Math.max(0, Math.floor(timeRemaining / 1000));
      
      setSecondsUntilExpiry(secondsRemaining);
      
      // Check if token is expiring soon (within 15 minutes)
      const isExpiring = timeRemaining < WARNING_TIME && timeRemaining > 0;
      setIsTokenExpiring(isExpiring);
      
      // Auto-logout if token has expired
      if (timeRemaining <= 0) {
        console.warn('⏰ Token expired, logging out...');
        setUser(null);
        setToken(null);
        setTokenExpiresAt(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token_expires');
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  // Unified login: handles both Warga and Balai
  const login = async (
    email: string,
    password?: string,
    rememberMeFlag?: boolean
  ): Promise<{ success: boolean; user?: User }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.loginUser({
        email,
        password: password || '',
      });

      const newUser: User = {
        id: response.user.id,
        fullName: response.user.fullName,
        role: response.user.role,
        email: response.user.email,
        username: response.user.username,
        unit: response.user.unit,
        balaiId: response.user.balaiId, // UUID for Balai staff
      };

      // Token is in HttpOnly cookie (not in response)
      // Use a marker value to indicate authenticated state
      setToken(response.token || 'HTTP_ONLY_COOKIE');
      setUser(newUser);
      
      // Determine expiry time based on "Remember Me" checkbox
      const expireTime = rememberMeFlag ? REMEMBER_ME_TIME : TOKEN_EXPIRY_TIME;
      const expiresAt = Date.now() + expireTime;
      setTokenExpiresAt(expiresAt);
      setRememberMe(!!rememberMeFlag);

      // Store user info and expiration in localStorage (not token - it's in HttpOnly cookie)
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_token_expires', expiresAt.toString());
      localStorage.setItem('auth_remember_me', (!!rememberMeFlag).toString());

      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
      setToken(null);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    setTokenExpiresAt(null);
    setSecondsUntilExpiry(0);
    setIsTokenExpiring(false);
    setRememberMe(false);
    // Clear all auth-related localStorage (token is in HttpOnly cookie, handled by browser)
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token_expires');
    localStorage.removeItem('auth_remember_me');
  };

  // Register user
  const register = async (registerData: Types.AuthRegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Register the user
      await apiService.registerUser(registerData);

      // Auto-login after successful registration
      const result = await login(registerData.email, registerData.password);
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user && (tokenExpiresAt ? Date.now() < tokenExpiresAt : false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        tokenExpiresAt,
        isTokenExpiring,
        secondsUntilExpiry,
        rememberMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};