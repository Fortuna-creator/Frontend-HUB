import { useContext } from 'react';
import { AuthContext } from './authContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // During development/fast refresh, context might be undefined briefly
  // Provide a safe fallback
  if (!context) {
    if (import.meta.env.DEV) {
      console.warn('useAuth called outside AuthProvider, returning null user state');
      return {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        tokenExpiresAt: null,
        secondsUntilExpiry: 0,
        isTokenExpiring: false,
        rememberMe: false,
        login: async () => {},
        register: async () => {},
        logout: () => {},
      };
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
