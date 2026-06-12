import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onExport: () => void;
  onImport: (json: string) => void;
}

export function Header({ totalCount, onExport, onImport }: HeaderProps) {
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
      transition={{ duration: 0.4 }}
      className="sticky top-0 bg-[#1B2438]/95 backdrop-blur-md border-b border-[#C9A96E]/20 z-40"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-serif text-xl font-semibold text-[#F5F0E8] tracking-wide">
            📚 BookStock
          </h1>
          <span className="text-[#C9A96E]/60 text-xs font-serif italic">本棚</span>
        </div>

        {/* Right: Count + Actions */}
        <div className="flex items-center gap-3">
          <span className="bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-full px-3.5 py-1 text-xs font-medium text-[#C9A96E]">
            {totalCount}冊
          </span>

          <button
            onClick={onExport}
            className="p-2 rounded-lg text-[#C9A96E]/50 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all duration-200"
            title="エクスポート"
          >
            <Download size={18} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg text-[#C9A96E]/50 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all duration-200"
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
