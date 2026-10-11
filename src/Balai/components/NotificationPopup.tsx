import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, type Notification } from '../context/NotificationContext';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale/id';
import { BsCalendar2Check } from 'react-icons/bs';

interface NotificationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatDate = (dateStr: string) => {
    try {
        return format(new Date(dateStr), 'd MMM yyyy', { locale: localeId });
    } catch {
        return dateStr;
    }
};

const NotificationPopup = ({ isOpen, onClose }: NotificationPopupProps) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const popupRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Tutup jika klik di luar popup
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDetail = (notifId: string) => {
        markAsRead(notifId);
        onClose();
        navigate('/dashboard-balai');
    };

    return (
        // Overlay transparan hanya sebagai penutup (popup tetap terlihat)
        <div className="fixed inset-0 z-40" aria-hidden="true">
            <div
                ref={popupRef}
                className="absolute top-[68px] right-4 lg:right-8 w-[360px] bg-white rounded shadow-2xl overflow-hidden z-50"
                style={{ maxHeight: '80vh' }}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Notifikasi</h2>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#244860] hover:underline font-medium"
                        >
                            Tandai semua dibaca
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 70px)' }}>
                    {notifications.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-400 text-sm">
                            Tidak ada notifikasi baru
                        </div>
                    ) : (
                        notifications.map((notif: Notification) => (
                            <div
                                key={notif.id}
                                className={`px-6 py-4 border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-blue-50/30' : 'bg-white'
                                    }`}
                            >
                                <div className="flex gap-4 items-start">
                                    {/* Calendar icon */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                                        <BsCalendar2Check className="text-gray-500 w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 leading-snug">
                                            <span className="font-bold">{notif.consultation.user.name.split(' ')[0]}</span>
                                            {' '}mengajukan penjadwalan konsultasi terbaru
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(notif.consultation.date)}
                                            {' • '}
                                            {notif.consultation.timeSlot}
                                        </p>
                                        <div className="flex justify-end mt-1">
                                            <button
                                                onClick={() => handleDetail(notif.id)}
                                                className="text-xs text-[#244860] hover:underline font-medium"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
