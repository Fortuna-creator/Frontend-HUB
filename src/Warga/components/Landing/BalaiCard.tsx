import type { BalaiDetail } from '../../data/balaiData';

interface BalaiCardProps {
  title: string;
  offices: BalaiDetail[];
  isActive: boolean;
  onClick: () => void;
}

export default function BalaiCard({ title, offices, isActive, onClick }: BalaiCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-8 rounded-lg shadow-lg border-2 transition-all cursor-pointer h-full flex flex-col ${
        isActive ? 'border-[#BFAF7A] ring-4 ring-[#BFAF7A]/10 scale-[1.02]' : 'border-transparent hover:border-slate-200'
      }`}
    >
      <h3 className="text-xl font-bold text-[#244860] mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {offices.map((office: BalaiDetail, index: number) => (
          <li key={index} className="text-slate-600 text-sm font-medium flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#244860] shrink-0" />
            {office.name}
          </li>
        ))}
      </ul>
    </div>
  );
}