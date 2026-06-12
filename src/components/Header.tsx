import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onExport: () => void;
  onImport: (json: string) => void;
  onOpenConcept: () => void;
}

export function Header({ totalCount, onExport, onImport, onOpenConcept }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImport(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 bg-[#1B2438]/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-40 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-serif text-xl font-medium text-[#F5F0E8] tracking-widest select-none">
              📚 BookStock
            </h1>
            <span className="text-[#C9A96E]/50 text-xs font-serif italic tracking-wide select-none hidden md:inline">デジタルアーカイブ</span>
          </div>
          <button
            onClick={onOpenConcept}
            className="text-[9px] sm:text-[10px] font-serif italic tracking-[0.15em] text-[#C9A96E]/60 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 px-2.5 py-1 rounded-full active:scale-[0.95] transition-all duration-200 border border-[#C9A96E]/20 hover:border-[#C9A96E]/40"
          >
            Concept
          </button>
        </div>

        {/* Right: Count + Actions */}
        <div className="flex items-center gap-4">
          <span className="bg-[#C9A96E]/10 border-none rounded-full px-4 py-1 text-xs font-medium text-[#C9A96E] tracking-wider select-none">
            {totalCount} 冊のコレクション
          </span>

          <button
            onClick={onExport}
            className="p-2.5 rounded-full text-[#C9A96E]/60 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 active:scale-[0.95] transition-all duration-200"
            title="エクスポート"
          >
            <Download size={18} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full text-[#C9A96E]/60 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 active:scale-[0.95] transition-all duration-200"
            title="インポート"
          >
            <Upload size={18} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </motion.header>
  );
}
