import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#D4B876] via-[#C9A96E] to-[#B8960B] text-[#1B2438] shadow-[0_4px_20px_rgba(201,169,110,0.5)] flex items-center justify-center animate-pulse-soft hover:shadow-[0_6px_28px_rgba(201,169,110,0.7)] transition-shadow duration-300"
      title="本を追加"
    >
      <Plus size={26} strokeWidth={2.5} />
    </motion.button>
  );
}
