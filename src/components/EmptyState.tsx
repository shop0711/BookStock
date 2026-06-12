import { motion } from 'framer-motion';
import type { BookStatus } from '@/types';

interface EmptyStateProps {
  status: BookStatus;
}

const EMPTY_CONFIG: Record<BookStatus, { emoji: string; title: string; subtitle: string }> = {
  'want-to-read': {
    emoji: '📚',
    title: 'まだ本がありません',
    subtitle: '右下の＋ボタンから、気になる本を追加しましょう',
  },
  'reading': {
    emoji: '📖',
    title: '読書中の本はありません',
    subtitle: '読みたい本のステータスを変更してみましょう',
  },
  'finished': {
    emoji: '✨',
    title: '読了した本はありません',
    subtitle: '読了した本をここで振り返れます',
  },
};

export function EmptyState({ status }: EmptyStateProps) {
  const config = EMPTY_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-20 select-none"
    >
      <div className="text-6xl mb-6 animate-float-gentle">{config.emoji}</div>
      <h3 className="font-serif text-lg font-semibold text-[#2D3748] mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-[#8A8A8A] text-center max-w-xs leading-relaxed font-sans">
        {config.subtitle}
      </p>
    </motion.div>
  );
}
