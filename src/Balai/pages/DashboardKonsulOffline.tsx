import React, { useState, useMemo, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { ChevronDown, AlertCircle } from 'lucide-react';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';
import { ConsultationList } from '../components/ConsultationList';
import { PendingConfirmationModal, ConfirmedDetailModal, CompletionModal, CancellationModal, SuccessModal, CancellationSummaryModal } from '../components/ConsultationModals';
import type { Consultation } from '../../types/types';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../../Warga/components/Auth/useAuth';
import { useGetDashboardConsultations, useConfirmConsultation, useRejectConsultation, useCompleteConsultation } from '../../api/hooks';


const DashboardKonsulOffline: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { setConsultations: syncNotifications } = useNotifications();

    // Use balaiId from user (provided by backend during login)
    const balaiId = user?.balaiId || '';
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    // Fetch dashboard consultations (hook will skip if balaiId is empty)
    const { data: apiConsultations, loading: dashboardLoading, error: dashboardError, refetch } = useGetDashboardConsultations(balaiId, dateString);
    
    // Action hooks
    const { confirm: confirmAction, loading: confirmLoading } = useConfirmConsultation();
    const { reject: rejectAction, loading: rejectLoading } = useRejectConsultation();
    const { complete: completeAction, loading: completeLoading } = useCompleteConsultation();

    // Transform API response to component format
    const [consultations, setConsultations] = useState<Consultation[]>([]);

    // Sync with context and refetch when date changes
    useEffect(() => {
        syncNotifications(consultations);
    }, [consultations, syncNotifications]);

    // Update consultations when API data changes
    useEffect(() => {
        if (apiConsultations) {
            // Transform API response to component format
            const transformed: Consultation[] = apiConsultations.map(consultation => ({
                id: consultation.id,
                user: {
                    id: consultation.user.id,
                    name: consultation.user.name,
                    phone: consultation.user.phone,
                    email: consultation.user.email,
                    avatar: consultation.user.avatar,
                },
                balaiLocation: consultation.balaiLocation,
                date: consultation.date,
                timeSlot: consultation.timeSlot,
                status: consultation.status,
                consultationId: consultation.consultationId,
                topic: consultation.topic,
                description: consultation.description,
                cancellationReason: consultation.cancellationReason,
            }));
            setConsultations(transformed);
        }
    }, [apiConsultations]);

    // Modal & Loading States
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
    const [pendingModalOpen, setPendingModalOpen] = useState(false);
    const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
    const [completionModalOpen, setCompletionModalOpen] = useState(false);
    const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [cancellationSummaryModalOpen, setCancellationSummaryModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const todaysConsultations = useMemo(() => {
        return consultations;
    }, [consultations]);

    const handleSelectConsultation = (consultation: Consultation) => {
        setSelectedConsultation(consultation);
        if (consultation.status === 'menunggu_konfirmasi') setPendingModalOpen(true);
        else if (consultation.status === 'terkonfirmasi' || consultation.status === 'sedang_berjalan') setConfirmedModalOpen(true);
        else if (consultation.status === 'selesai') setSuccessModalOpen(true);
        else if (consultation.status === 'dibatalkan') setCancellationSummaryModalOpen(true);
    };

    const handleConfirmReservation = async (id: string) => {
        if (!balaiId) {
            alert('Error: Balai ID not found');
            return;
        }

        setIsProcessing(true);
        try {
            await confirmAction(balaiId, id);
            // Optimistically update local state
            setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: 'terkonfirmasi' } : c));
            setPendingModalOpen(false);
            // Refetch to ensure consistency
            refetch();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to confirm consultation';
            alert(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleRejectReservation = (_id: string) => {
        setPendingModalOpen(false);
        setCancellationModalOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleStartConsultation = (_id: string) => {
        setConfirmedModalOpen(false);
        setCompletionModalOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCancelConsultation = (_id: string) => {
        setConfirmedModalOpen(false);
        setCancellationModalOpen(true);
    };

    const handleSubmitCancellation = async (id: string, reason: string) => {
        if (!balaiId) {
            alert('Error: Balai ID not found');
            return;
        }

        setIsProcessing(true);
        try {
            await rejectAction(balaiId, id, reason);
            // Optimistically update local state
            setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: 'dibatalkan', cancellationReason: reason } : c));
            setCancellationModalOpen(false);
            setCancellationSummaryModalOpen(true);
            // Refetch to ensure consistency
            refetch();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to cancel consultation';
            alert(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompleteConsultation = async (id: string, verificationId: string) => {
        if (!balaiId) {
            alert('Error: Balai ID not found');
            return;
        }

        setIsProcessing(true);
        try {
            await completeAction(balaiId, id, verificationId);
            // Optimistically update local state
            setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: 'selesai', consultationId: verificationId } : c));
            setCompletionModalOpen(false);
            setSuccessModalOpen(true);
            // Refetch to ensure consistency
            refetch();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to complete consultation';
            alert(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Error Alert */}
            {dashboardError && (
                <div className="bg-red-50 border-b border-red-200 p-4">
                    <div className="container mx-auto flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Error loading consultations</p>
                            <p className="text-sm">{dashboardError.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Panel: Calendar */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="pl-2">
                            <h2 className="text-[28px] font-bold text-[#1a3648] mb-1">Jadwal Konsultasi</h2>
                            <p className="text-gray-500 mb-10 text-sm">Kelola dan pantau jadwal konsultasi di balai anda</p>

                            <div className="bg-transparent relative">
                                <style>{`
                                    /* Wrapper Dasar */
                                    .react-datepicker { font-family: inherit; border: none; background: transparent; width: 100%; }
                                    .react-datepicker__month-container { width: 100%; float: none; }
                                    .react-datepicker__header { background: transparent; border-bottom: none; padding-top: 0; }
                                    
                                    /* Nama Hari (SEN, SEL, RAB) */
                                    .react-datepicker__day-names { margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; display: flex; justify-content: space-around; }
                                    .react-datepicker__day-name { color: #9CA3AF; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; width: 2.5rem; margin: 0.2rem; }
                                    .react-datepicker__week { display: flex; justify-content: space-around; }

                                    /* Angka Tanggal */
                                    .react-datepicker__day { width: 2.5rem; height: 2.5rem; line-height: 2.5rem; margin: 0.2rem; border-radius: 9999px; color: #4B5563; font-weight: 500; font-size: 0.9rem; transition: all 0.2s ease; position: relative; display: flex; align-items: center; justify-content: center; outline: none; cursor: pointer; }
                                    .react-datepicker__day:hover { background-color: #F3F4F6; color: #111827; }
                                    
                                    /* Styling Khusus Tanggal Merah (Minggu) */
                                    .react-datepicker__day.holiday-date { color: #EF4444 !important; }
                                    .react-datepicker__day.holiday-date:hover { background-color: #FEE2E2 !important; }
                                    
                                    /* Tanggal Terpilih */
                                    .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #1a3648 !important; color: white !important; font-weight: 600; box-shadow: 0 4px 10px -2px rgba(26, 54, 72, 0.3); }
                                    
                                    /* Override warna teks putih jika hari minggu sedang diklik */
                                    .react-datepicker__day--selected.holiday-date { color: white !important; }

                                    /* Tanggal di luar bulan ini */
                                    .react-datepicker__day--outside-month { color: #D1D5DB !important; opacity: 0.5; }
                                    .react-datepicker__day--outside-month.holiday-date { color: #FCA5A5 !important; }
                                `}</style>

                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => date && setSelectedDate(date)}
                                    inline
                                    locale={id}

                                    // LOGIKA HARI MINGGU SAJA
                                    dayClassName={(date) => {
                                        // getDay() mengembalikan 0 untuk hari Minggu
                                        return date.getDay() === 0 ? "holiday-date" : "";
                                    }}

                                    // HEADER KUSTOM (Styling Dropdown Native dengan Trik Invisible Select)
                                    renderCustomHeader={({ date, changeMonth, changeYear }) => {
                                        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                                        const currentYear = new Date().getFullYear();
                                        const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

                                        return (
                                            <div className="flex justify-between items-center px-2 mb-8">

                                                {/* Dropdown Bulan */}
                                                <div className="relative inline-flex items-center gap-2 group cursor-pointer">
                                                    <span className="text-[22px] font-bold text-[#1a3648] group-hover:text-gray-600 transition-colors pointer-events-none">
                                                        {months[date.getMonth()]}
                                                    </span>
                                                    <ChevronDown className="w-5 h-5 text-[#1a3648] group-hover:text-gray-600 transition-colors pointer-events-none" strokeWidth={3} />
                                                    <select
                                                        value={months[date.getMonth()]}
                                                        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        {months.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Dropdown Tahun */}
                                                <div className="relative inline-flex items-center gap-2 group cursor-pointer">
                                                    <span className="text-[22px] font-bold text-[#1a3648] group-hover:text-gray-600 transition-colors pointer-events-none">
                                                        {date.getFullYear()}
                                                    </span>
                                                    <ChevronDown className="w-5 h-5 text-[#1a3648] group-hover:text-gray-600 transition-colors pointer-events-none" strokeWidth={3} />
                                                    <select
                                                        value={date.getFullYear()}
                                                        onChange={({ target: { value } }) => changeYear(parseInt(value))}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        {years.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>
                                        );
                                    }}

                                    // KONTEN PINTAR: Titik Indikator Jadwal
                                    renderDayContents={(day, date) => {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        const hasConsultation = consultations.some(c => c.date === dateStr);
                                        const isSelected = format(selectedDate, 'yyyy-MM-dd') === dateStr;

                                        return (
                                            <div className="relative flex h-full w-full items-center justify-center">
                                                <span>{day}</span>
                                                {hasConsultation && (
                                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1a3648]'}`}></span>
                                                )}
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: List */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
                                </h3>
                                {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wide">
                                        Hari Ini
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                {dashboardLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a3648]"></div>
                                            <p className="mt-4 text-gray-600">Loading consultations...</p>
                                        </div>
                                    </div>
                                ) : todaysConsultations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-sm">No consultations for this date</p>
                                    </div>
                                ) : (
                                    <ConsultationList
                                        consultations={todaysConsultations}
                                        onSelect={handleSelectConsultation}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            {/* Modals */}
            <PendingConfirmationModal isOpen={pendingModalOpen} onClose={() => setPendingModalOpen(false)} consultation={selectedConsultation} onConfirm={handleConfirmReservation} onReject={handleRejectReservation} isProcessing={isProcessing || confirmLoading} />
            <ConfirmedDetailModal isOpen={confirmedModalOpen} onClose={() => setConfirmedModalOpen(false)} consultation={selectedConsultation} onConfirm={handleStartConsultation} onReject={handleCancelConsultation} isProcessing={isProcessing || rejectLoading} />
            <CompletionModal isOpen={completionModalOpen} onClose={() => setCompletionModalOpen(false)} consultation={selectedConsultation} onSubmit={handleCompleteConsultation} isProcessing={isProcessing || completeLoading} />
            <CancellationModal isOpen={cancellationModalOpen} onClose={() => setCancellationModalOpen(false)} consultation={selectedConsultation} onSubmit={handleSubmitCancellation} isProcessing={isProcessing || rejectLoading} />
            <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} consultation={selectedConsultation} />
            <CancellationSummaryModal isOpen={cancellationSummaryModalOpen} onClose={() => setCancellationSummaryModalOpen(false)} consultation={selectedConsultation} />
        </div>
    );
};

export default DashboardKonsulOffline;