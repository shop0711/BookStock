import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#C9A96E] text-[#1B2438] shadow-[0_4px_24px_rgba(201,169,110,0.25)] flex items-center justify-center animate-pulse-soft hover:bg-[#D4B876] hover:shadow-[0_6px_30px_rgba(201,169,110,0.4)] transition-all duration-300"
      title="本を追加"
    >
      <Plus size={22} strokeWidth={1.5} />
    </motion.button>
  );
}
