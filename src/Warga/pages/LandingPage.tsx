import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import type { BalaiRegionMapping } from '../data/balaiData';
import Navbar from '../components/Shared/Navbar';
import Hero from '../components/Landing/Hero';
import Map from '../components/Landing/Map';
import BalaiCard from '../components/Landing/BalaiCard';
import { REGIONS, DETAILED_BALAI_LIST } from '../data/balaiData'; // Use the updated BALAI_LIST
import { VscClose } from 'react-icons/vsc';
import Footer from '../components/Shared/Footer';

export default function LandingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate(); // Initialize navigation

  const handleMapClick = (id: string, pos: { x: number, y: number }) => {
    setSelectedId(id);
    setPopupPos(pos);
  };

  const selectedData = REGIONS.find(r => r.id === selectedId);

  return (
    <div className="w-full bg-[#fdfaf1] min-h-screen">
      <Navbar />
      
      {/* Map Section */}
      <section className="w-full py-20 px-10 lg:px-24">
        <h2 className="text-center text-3xl font-black text-[#244860] mb-12 uppercase tracking-tight">
          Wilayah Kerja Kantor Balai
        </h2>

        <div className="relative w-full">
          <Map onRegionSelect={handleMapClick} selectedRegion={selectedId} />

          {/* Floating Popup */}
          {selectedId && selectedData && (
            <div 
              className="fixed z-[100] w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in duration-200"
              style={{ 
                left: `${popupPos.x}px`, 
                top: `${popupPos.y}px`,
                transform: 'translate(-50%, -110%)' 
              }}
            >
              <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <VscClose size={20} />
              </button>
              <span className="text-[10px] font-black text-[#BFAF7A] uppercase tracking-widest">Wilayah</span>
              <h4 className="text-xl font-black text-[#244860] mt-1 mb-2 uppercase">{selectedData.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-5 font-medium">
                Pilih kartu di bawah untuk melihat rincian Kantor Balai di wilayah ini.
              </p>
              
              {/* UPDATED BUTTON: Navigates to the dynamic detail page */}
              <button 
                onClick={() => navigate(`/balai/${selectedId}`)}
                className="w-full py-2.5 bg-[#244860] text-white text-[10px] font-bold rounded uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Lihat Detail
              </button>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>
            </div>
          )}
        </div>
      </section>

      {/* Balai Grid Section */}
      <section className="w-full bg-[#f5f1e3] py-20 px-10 lg:px-24 border-t border-slate-200">
        <div className="w-full text-center mb-12">
            <h2 className="text-2xl font-black text-[#244860] uppercase tracking-tight">
                Daftar Kantor Balai
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DETAILED_BALAI_LIST.map((item: BalaiRegionMapping) => (
            <BalaiCard
              key={item.regionId}
              title={REGIONS.find(r => r.id === item.regionId)?.name || ''}
              offices={item.offices}
              isActive={selectedId === item.regionId}
              onClick={() => setSelectedId(item.regionId)}
            />
          ))}
        </div>
      </section>
      
      <Hero />
      <Footer />
    </div>
  );
}