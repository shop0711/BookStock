import { motion } from 'framer-motion';
import type { BookStatus } from '@/types';

interface EmptyStateProps {
  status: BookStatus;
}

const EMPTY_CONFIG: Record<BookStatus, { title: string; subtitle: string }> = {
  'want-to-read': {
    title: '静かな本棚に、まだ本はありません',
    subtitle: '右下の ＋ から、あなたのコレクションを始めてください。',
  },
  'reading': {
    title: '現在、開かれている頁はありません',
    subtitle: '読みたい本のステータスを「読書中」に更新してみましょう。',
  },
  'finished': {
    title: '紡がれた物語は、まだありません',
    subtitle: '読了した本が、ここに美しくアーカイブされます。',
  },
};

export function EmptyState({ status }: EmptyStateProps) {
  const config = EMPTY_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="flex flex-col items-center justify-center py-32 select-none"
    >
      <h3 className="font-serif italic text-base sm:text-lg tracking-widest text-[#2D3748]/70 mb-4 text-center">
        {config.title}
      </h3>
      <p className="text-xs text-[#4A5568]/50 text-center max-w-xs leading-relaxed font-serif font-light tracking-wide">
        {config.subtitle}
      </p>
    </motion.div>
  );
}
