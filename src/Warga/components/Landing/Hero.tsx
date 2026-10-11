import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/image.png'; 

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#244860] py-20 flex items-center justify-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-10 lg:px-24 gap-16">
        {/* Left Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-white font-black text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6 tracking-tight">
            Fasilitas Konsultasi Offline
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
            Memberikan kesempatan masyarakat untuk berkonsultasi langsung dengan ahli secara tatap muka, 
            sehingga proses diskusi lebih jelas dan mendalam. Konsultasi offline membantu memperoleh 
            solusi yang tepat dalam pembangunan rumah layak huni.
          </p>
          <div className="flex justify-center md:justify-start">
            <button 
              onClick={() => navigate('/konsultasi')}
              className="bg-white text-[#244860] font-bold py-3 px-12 rounded shadow-xl hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
            >
              Konsultasi
            </button>
          </div>
        </div>

        {/* Right Image with Gold Border effect */}
        <div className="flex-1 relative">
          {/* Decorative Gold Frame */}
          <div className="absolute top-6 right-[-24px] w-full h-full border-4 border-[#BFAF7A] hidden lg:block"></div>
          <div className="relative w-full aspect-square overflow-hidden shadow-2xl z-10">
            <img 
              src={heroImage} 
              alt="Konsultasi Offline" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}