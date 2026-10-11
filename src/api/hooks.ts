/**
 * Custom Hooks for API Calls
 * Provides simplified interface for components to call APIs
 * Handles loading, error, and retry logic
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as apiService from './service';
import * as Types from './types';

// ─── Generic API Hook State ────────────────────────────────────────────────

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

// ─── Consultation Booking ─────────────────────────────────────────────────

export function useBookConsultation() {
  const [state, setState] = useState<UseApiState<Types.BookConsultationResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const pendingRequestRef = useRef<Promise<Types.BookConsultationResponse> | undefined>(undefined);
  const lastRequestRef = useRef<{ userId: string; request: Types.BookConsultationRequest } | null>(null);
  
  const book = useCallback(
    async (userId: string, request: Types.BookConsultationRequest) => {
      // Prevent duplicate requests
      if (pendingRequestRef.current) {
        return pendingRequestRef.current;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));
      lastRequestRef.current = { userId, request };

      try {
        pendingRequestRef.current = apiService.bookConsultation(userId, request);
        const response = await pendingRequestRef.current;
        setState((prev) => ({ 
          ...prev,
          data: response, 
          loading: false, 
          error: null, 
          retry: async () => book(userId, request)
        }));
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({
          ...prev,
          loading: false,
          error,
          retry: async () => book(userId, request),
        }));
        throw error;
      } finally {
        pendingRequestRef.current = undefined;
      }
    },
    []
  );

  return { ...state, book };
}

// ─── Get Consultations ────────────────────────────────────────────────────

export function useGetConsultations(userId: string) {
  const [state, setState] = useState<UseApiState<Types.GetConsultationsResponse>>({
    data: null,
    loading: true,
    error: null,
    retry: async () => {},
  });

  const fetchConsultations = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getMyConsultations(userId);
      setState((prev) => ({ ...prev, data: response, loading: false, error: null }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, [userId]);

  return { ...state, refetch: fetchConsultations };
}

// ─── Verify Consultation ──────────────────────────────────────────────────

export function useVerifyConsultation() {
  const [state, setState] = useState<UseApiState<Types.VerifyConsultationResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const verify = useCallback(
    async (userId: string, consultationId: string, verificationCode: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiService.verifyConsultation(userId, consultationId, {
          verificationCode,
        });
        setState({ data: response, loading: false, error: null, retry: async () => {} });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({
          ...prev,
          loading: false,
          error,
        }));
        throw error;
      }
    },
    []
  );

  return { ...state, verify };
}

// ─── Dashboard Consultations (Balai) ───────────────────────────────────────

export function useGetDashboardConsultations(balaiId: string, date?: string, status?: Types.ConsultationStatus) {
  const [state, setState] = useState<UseApiState<Types.GetConsultationsResponse>>({
    data: null,
    loading: !balaiId, // Only show loading if balaiId is not available
    error: balaiId ? null : new Error('Balai ID is required to fetch consultations'),
    retry: async () => {},
  });

  const fetchConsultations = useCallback(async () => {
    // Ensure balaiId is available before making the API call
    if (!balaiId) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error('Balai ID is required to fetch consultations'),
        data: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getDashboardConsultations(balaiId, {
        date,
        status: status || 'all',
      });
      setState({ data: response, loading: false, error: null, retry: async () => fetchConsultations() });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
        retry: async () => fetchConsultations(),
      }));
    }
  }, [balaiId, date, status]);

  // Auto-fetch when dependencies change (but only if balaiId is available)
  useEffect(() => {
    if (balaiId) {
      fetchConsultations();
    }
  }, [balaiId, date, status, fetchConsultations]);

  return { ...state, refetch: fetchConsultations };
}

// ─── Confirm Consultation (Balai Action) ──────────────────────────────────

export function useConfirmConsultation() {
  const [state, setState] = useState<UseApiState<Types.ConfirmConsultationResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const pendingRequestRef = useRef<Promise<Types.ConfirmConsultationResponse> | undefined>(undefined);

  const confirm = useCallback(async (balaiId: string, consultationId: string) => {
    // Prevent duplicate requests
    if (pendingRequestRef.current) {
      throw new Error('Request already in progress. Please wait...');
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      pendingRequestRef.current = apiService.confirmConsultation(balaiId, consultationId);
      const response = await pendingRequestRef.current;
      setState({ data: response, loading: false, error: null, retry: async () => confirm(balaiId, consultationId) });
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
        retry: async () => confirm(balaiId, consultationId),
      }));
      throw error;
    } finally {
      pendingRequestRef.current = undefined;
    }
  }, []);

  return { ...state, confirm };
}

// ─── Reject Consultation (Balai Action) ───────────────────────────────────

export function useRejectConsultation() {
  const [state, setState] = useState<UseApiState<Types.RejectConsultationResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const pendingRequestRef = useRef<Promise<Types.RejectConsultationResponse> | undefined>(undefined);

  const reject = useCallback(
    async (balaiId: string, consultationId: string, reason: string) => {
      if (pendingRequestRef.current) {
        throw new Error('Request already in progress. Please wait...');
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        pendingRequestRef.current = apiService.rejectConsultation(
          balaiId,
          consultationId,
          reason
        );
        const response = await pendingRequestRef.current;
        setState({ data: response, loading: false, error: null, retry: async () => reject(balaiId, consultationId, reason) });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({
          ...prev,
          loading: false,
          error,
          retry: async () => reject(balaiId, consultationId, reason),
        }));
        throw error;
      } finally {
        pendingRequestRef.current = undefined;
      }
    },
    []
  );

  return { ...state, reject };
}

// ─── Complete Consultation (Balai Action) ────────────────────────────────

export function useCompleteConsultation() {
  const [state, setState] = useState<UseApiState<Types.CompleteConsultationResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const pendingRequestRef = useRef<Promise<Types.CompleteConsultationResponse> | undefined>(undefined);

  const complete = useCallback(
    async (balaiId: string, consultationId: string, verificationId: string) => {
      if (pendingRequestRef.current) {
        throw new Error('Request already in progress. Please wait...');
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        pendingRequestRef.current = apiService.completeConsultation(
          balaiId,
          consultationId,
          verificationId
        );
        const response = await pendingRequestRef.current;
        setState({ data: response, loading: false, error: null, retry: async () => complete(balaiId, consultationId, verificationId) });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({
          ...prev,
          loading: false,
          error,
          retry: async () => complete(balaiId, consultationId, verificationId),
        }));
        throw error;
      } finally {
        pendingRequestRef.current = undefined;
      }
    },
    []
  );

  return { ...state, complete };
}

// ─── Get Balai List ───────────────────────────────────────────────────────

export function useGetBalaiList() {
  const [state, setState] = useState<UseApiState<Types.BalaiInfo[]>>({
    data: null,
    loading: true,
    error: null,
    retry: async () => {},
  });

  const fetchBalaiList = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getBalaiList();
      setState({ data: response, loading: false, error: null, retry: fetchBalaiList });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, []);

  // Auto-fetch on component mount
  useEffect(() => {
    fetchBalaiList();
  }, [fetchBalaiList]);

  return { ...state, refetch: fetchBalaiList };
}

// ─── Get Available Slots ──────────────────────────────────────────────────

export function useGetAvailableSlots(balaiId: string, date: string) {
  const [state, setState] = useState<UseApiState<Types.GetAvailableSlotsResponse>>({
    data: null,
    loading: false,
    error: null,
    retry: async () => {},
  });

  const fetchSlots = useCallback(async () => {
    if (!balaiId || !date) return; // Don't fetch without required params
    
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getAvailableSlots(balaiId, date);
      setState((prev) => ({ ...prev, data: response, loading: false, error: null }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, [balaiId, date]);

  // Auto-fetch when balaiId and date are provided
  useEffect(() => {
    if (balaiId && date) {
      fetchSlots();
    }
  }, [balaiId, date, fetchSlots]);

  return { ...state, refetch: fetchSlots };
}

// ─── Get Dashboard Stats ──────────────────────────────────────────────────

export function useGetDashboardStats(balaiId: string) {
  const [state, setState] = useState<UseApiState<Types.DashboardStats>>({
    data: null,
    loading: true,
    error: null,
    retry: async () => {},
  });

  const fetchStats = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getDashboardStats(balaiId);
      setState({ data: response, loading: false, error: null, retry: async () => {} });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, [balaiId]);

  return { ...state, refetch: fetchStats };
}
// ─── Get Booking Confirmations (Warga Inbox) ──────────────────────────────

export function useGetBookingConfirmations(userId: string, options?: Types.GetBookingConfirmationsRequest) {
  const [state, setState] = useState<UseApiState<Types.GetBookingConfirmationsResponse>>({
    data: null,
    loading: true,
    error: null,
    retry: async () => {},
  });

  // Extract the status to use as a proper dependency
  const status = options?.status;

  const fetchConfirmations = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getBookingConfirmations(userId, { status });
      setState({ data: response, loading: false, error: null, retry: async () => {} });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, [userId, status]);

  // Auto-fetch confirmations when userId or status changes
  useEffect(() => {
    fetchConfirmations();
  }, [userId, status, fetchConfirmations]);

  return { ...state, refetch: fetchConfirmations };
}

// ─── Get Single Booking Confirmation ───────────────────────────────────────

export function useGetBookingConfirmation(userId: string, confirmationId: string) {
  const [state, setState] = useState<UseApiState<Types.GetBookingConfirmationResponse>>({
    data: null,
    loading: true,
    error: null,
    retry: async () => {},
  });

  const fetchConfirmation = useCallback(async () => {
    if (!confirmationId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getBookingConfirmation(userId, confirmationId);
      setState({ data: response, loading: false, error: null, retry: async () => {} });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  }, [userId, confirmationId]);

  // Auto-fetch when confirmationId changes
  useEffect(() => {
    if (confirmationId) {
      fetchConfirmation();
    }
  }, [confirmationId, fetchConfirmation]);

  return { ...state, refetch: fetchConfirmation };
}