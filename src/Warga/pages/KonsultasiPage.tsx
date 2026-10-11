import { useState, useEffect } from 'react';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale/id';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';
import { VscPass, VscChevronDown, VscChevronLeft, VscChevronRight, VscLoading } from 'react-icons/vsc';
import { useAuth } from '../components/Auth/useAuth';
import { useGetBalaiList, useGetAvailableSlots, useBookConsultation } from '../../api/hooks';
import type { BalaiInfo, AvailableSlot } from '../../api/types';

export default function KonsultasiPage() {
  const { user } = useAuth();
  
  // Balai & Consultation States
  const [selectedBalaiId, setSelectedBalaiId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Load balai list
  const { data: balaiList, loading: balaiLoading } = useGetBalaiList();
  
  // Load available slots when balai and date are selected
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const { data: availableSlots, loading: slotsLoading, refetch: refetchSlots } = useGetAvailableSlots(
    selectedBalaiId || '',
    dateString
  );
  
  // Fetch slots when balai and date change
  useEffect(() => {
    if (selectedBalaiId && dateString) {
      refetchSlots();
    }
  }, [selectedBalaiId, dateString, refetchSlots]);
  
  // Book consultation
  const { book, loading: bookingLoading, error: bookingError } = useBookConsultation();
  
  // Set default selected balai when list loads
  useEffect(() => {
    if (balaiList && balaiList.length > 0 && !selectedBalaiId) {
      setSelectedBalaiId(balaiList[0].id);
    }
  }, [balaiList, selectedBalaiId]);
  
  const selectedBalai = balaiList?.find(b => b.id === selectedBalaiId);
  
  const handleConfirm = async () => {
    if (!user || !selectedBalaiId || !selectedDate || !selectedTime) {
      alert('Mohon lengkapi semua data');
      return;
    }
    
    try {
      await book(user.id, {
        balaiId: selectedBalaiId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        topic: 'Konsultasi Offline',
        description: 'Konsultasi offline'
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking failed:', error);
      // Error will be displayed in UI
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#FDFBF5] min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-2xl shadow-2xl border border-slate-100 max-w-lg text-center">
            <VscPass className="text-green-500 size-20 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-[#244860] uppercase mb-2">Pengajuan Berhasil</h2>
            <p className="text-slate-500 mb-8 font-medium">
              Hai {user?.fullName}, jadwal konsultasi Anda telah dicatat. Mohon hadir tepat waktu.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-left mb-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Waktu:</span>
                <span className="font-bold text-[#244860]">
                  {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: idLocale }) : 'N/A'}, {selectedTime || 'N/A'} WIB
                </span>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-3 bg-[#244860] text-white font-bold rounded-lg uppercase text-xs tracking-widest hover:bg-[#1a3547]"
            >
              Kembali ke Beranda
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF5] min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow py-12 px-6 lg:px-24">
        <div className="mb-6">
          <h1 className="text-[#244860] font-bold">Layanan Konsultasi untuk {user?.fullName}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row min-h-[600px] overflow-hidden">
          {/* Column 1: Balai Selection */}
          <div className="w-full md:w-1/4 p-10 border-r border-slate-100">
            <div className="relative mb-8">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={balaiLoading}
                className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 hover:border-[#BFAF7A] disabled:opacity-50"
              >
                {balaiLoading ? 'Memuat...' : selectedBalai?.name || 'Pilih Balai'}
                <VscChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && balaiList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {balaiList.map((balai) => (
                    <button
                      key={balai.id}
                      onClick={() => {
                        setSelectedBalaiId(balai.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        selectedBalaiId === balai.id ? 'bg-[#BFAF7A] text-white' : 'text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{balai.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-black text-[#244860] mb-4">Konsultasi Offline</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Halo {user?.fullName}, silakan ajukan jadwal konsultasi bersama tim ahli kami.
            </p>
          </div>

          {/* Column 2: Calendar */}
          <div className="w-full md:w-1/3 p-10 border-r border-slate-100">
            <div className="mb-6 flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
              <span>{format(currentMonth, 'MMMM yyyy', { locale: idLocale })}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="hover:text-[#244860] transition-colors"
                >
                  <VscChevronLeft className="cursor-pointer" />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="hover:text-[#244860] transition-colors"
                >
                  <VscChevronRight className="cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase mb-4">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                const day = i + 1;
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isPast = dateObj < new Date() && dateObj.toDateString() !== new Date().toDateString();
                
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDate(dateObj);
                      setSelectedTime(null);
                    }}
                    disabled={isPast}
                    className={`py-3 text-xs font-bold rounded-lg transition-all ${
                      selectedDate?.toDateString() === dateObj.toDateString()
                        ? 'bg-[#244860] text-white'
                        : 'hover:bg-[#BFAF7A]/10 text-slate-700'
                    } ${isPast ? 'text-red-500 opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: Time Slots */}
          <div className="w-full md:flex-1 p-10 bg-slate-50/30 flex flex-col justify-center">
            {!selectedDate ? (
              <p className="text-center text-sm text-slate-400 font-medium">Mohon memilih tanggal terlebih dahulu</p>
            ) : slotsLoading ? (
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <VscLoading className="animate-spin" />
                <span>Memuat jam tersedia...</span>
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">Jam Tersedia</h3>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {availableSlots
                    .filter(slot => slot.available)
                    .map((slot) => (
                      <button
                        key={slot.timeSlot}
                        onClick={() => setSelectedTime(slot.timeSlot)}
                        className={`py-3 border rounded-lg text-sm font-bold transition-all ${
                          selectedTime === slot.timeSlot
                            ? 'bg-[#BFAF7A] border-[#BFAF7A] text-[#244860]'
                            : 'border-slate-200 text-[#244860] hover:border-[#BFAF7A] bg-white'
                        }`}
                      >
                        {slot.timeSlot}
                      </button>
                    ))}
                </div>

                {selectedTime && (
                  <button
                    onClick={handleConfirm}
                    disabled={bookingLoading}
                    className="w-full py-4 bg-[#244860] text-white font-black rounded-lg uppercase text-xs tracking-widest shadow-lg hover:bg-[#1a3547] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? <VscLoading className="animate-spin" /> : null}
                    {bookingLoading ? 'Memproses...' : 'Konfirmasi Jadwal'}
                  </button>
                )}

                {bookingError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {bookingError.message}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 font-medium">
                Tidak ada jam tersedia untuk tanggal ini
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}