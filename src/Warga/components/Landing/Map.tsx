import { useMemo } from 'react';
import indonesiaSvgRaw from '../../../assets/id.svg?raw';

interface MapProps {
  onRegionSelect: (id: string, pos: { x: number; y: number }) => void;
  selectedRegion: string | null;
}

type RegionId =
  | 'sumatera'
  | 'jawa'
  | 'kalimantan'
  | 'sulawesi'
  | 'nusa-tenggara'
  | 'maluku'
  | 'papua';

const PROVINCE_TO_REGION: Record<string, RegionId> = {
  IDAC: 'sumatera',
  IDSU: 'sumatera',
  IDSB: 'sumatera',
  IDRIAU: 'sumatera',
  IDJAMBI: 'sumatera',
  IDPALEMBANG: 'sumatera',
  IDBENGKULU: 'sumatera',
  IDLAMPUNG: 'sumatera',
  IDBANGKA: 'sumatera',

  IDJK: 'jawa',
  IDJB: 'jawa',
  IDJT: 'jawa',
  IDJI: 'jawa',
  IDYC: 'jawa',

  IDBA: 'nusa-tenggara',
  IDNB: 'nusa-tenggara',
  IDNT: 'nusa-tenggara',

  IDKB: 'kalimantan',
  IDKT: 'kalimantan',
  IDKS: 'kalimantan',
  IDKI: 'kalimantan',
  IDKU: 'kalimantan',

  IDSG: 'sulawesi',
  IDGO: 'sulawesi',
  IDSR: 'sulawesi',
  IDSA: 'sulawesi',
  IDSN: 'sulawesi',
  IDST: 'sulawesi',

  IDMA: 'maluku',
  IDMU: 'maluku',

  IDPB: 'papua',
  IDPA: 'papua',
};

type ProvincePath = {
  id: string;
  d: string;
};

export default function Map({ onRegionSelect, selectedRegion }: MapProps) {
  const provincePaths = useMemo<ProvincePath[]>(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(indonesiaSvgRaw, 'image/svg+xml');

    return Array.from(doc.querySelectorAll('path'))
      .map((path) => ({
        id: path.getAttribute('id') ?? '',
        d: path.getAttribute('d') ?? '',
      }))
      .filter((path) => Boolean(path.id && path.d && PROVINCE_TO_REGION[path.id]));
  }, []);

  const handleProvinceClick = (
    event: React.MouseEvent<SVGPathElement>,
    provinceId: string,
  ) => {
    const regionId = PROVINCE_TO_REGION[provinceId];
    if (!regionId) {
      return;
    }

    onRegionSelect(regionId, { x: event.clientX, y: event.clientY });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200">
      <svg
        viewBox="0 0 1000 368"
        className="w-full h-auto drop-shadow-sm"
        stroke="#ffffff"
        strokeWidth=".75"
      >
        {provincePaths.map((province) => {
          const regionId = PROVINCE_TO_REGION[province.id];
          const isActive = selectedRegion === regionId;

          return (
            <path
              key={province.id}
              d={province.d}
              onClick={(event) => handleProvinceClick(event, province.id)}
              className={`cursor-pointer transition-all duration-500 ease-out ${
                isActive
                  ? 'fill-[#244860] stroke-[#BFAF7A] stroke-[1px]'
                  : 'fill-slate-200 hover:fill-[#BFAF7A]'
              }`}
            />
          );
        })}
      </svg>
    </div>
  );
}