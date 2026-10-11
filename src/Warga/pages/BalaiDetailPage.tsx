import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';
import type { BalaiDetail, BalaiRegionMapping } from '../data/balaiData';
import { DETAILED_BALAI_LIST, REGIONS } from '../data/balaiData';
import { VscArrowLeft, VscBriefcase } from 'react-icons/vsc';

export default function BalaiDetailPage() {
  const { regionId } = useParams();
  const navigate = useNavigate();

  const regionInfo = REGIONS.find(r => r.id === regionId);
  const balaiData = DETAILED_BALAI_LIST.find((b: BalaiRegionMapping) => b.regionId === regionId);

  if (!regionInfo) return <div className="p-20 text-center">Region not found</div>;

  return (
    <div className="bg-[#FDFBF5] min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow py-16 px-10 lg:px-24">
        {/* Breadcrumb / Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#244860] font-bold text-sm mb-8 hover:translate-x-[-4px] transition-transform uppercase tracking-widest"
        >
          <VscArrowLeft /> Kembali ke Peta
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-[#244860] uppercase tracking-tight mb-2">
            {regionInfo.name}
          </h1>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
            {regionInfo.description}
          </p>
        </header>

        {/* Balai Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {balaiData?.offices.map((office: BalaiDetail, idx: number) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden transition-hover hover:shadow-2xl duration-300">
              {/* Header Card with Location Badge */}
              <div className="p-8 pb-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-[#244860] uppercase leading-tight">
                    {office.name}
                  </h3>
                </div>
                
                {/* Working Area Section - NEW */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 border-l-4 border-[#BFAF7A]">
                  <div className="flex items-center gap-2 mb-1">
                    <VscBriefcase className="text-[#244860] size-4" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah Kerja</span>
                  </div>
                  <p className="text-sm font-bold text-[#244860]">
                    {office.workingArea}
                  </p>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="p-8 pt-0 mt-auto">
                <button 
                  onClick={() => navigate('/konsultasi')}
                  className="w-full py-4 bg-[#244860] text-white font-black rounded-lg uppercase text-xs tracking-widest hover:bg-[#1a3547] transition-all shadow-lg shadow-blue-900/10"
                >
                  Buat Janji Konsultasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}