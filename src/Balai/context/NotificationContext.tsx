import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Consultation } from '../../types/types';

export interface Notification {
    id: string;
    consultation: Consultation;
    isRead: boolean;
    createdAt: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    setConsultations: (consultations: Consultation[]) => void;
    markAllAsRead: () => void;
    markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Sinkronkan notifications dari data konsultasi: hanya yang 'menunggu_konfirmasi'
    const setConsultations = useCallback((consultations: Consultation[]) => {
        setNotifications(prev => {
            const pending = consultations.filter(c => c.status === 'menunggu_konfirmasi');
            return pending.map(c => {
                const existing = prev.find(n => n.id === c.id);
                return existing ?? {
                    id: c.id,
                    consultation: c,
                    isRead: false,
                    createdAt: new Date(),
                };
            });
        });
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setConsultations, markAllAsRead, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
    return ctx;
};
