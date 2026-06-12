import { motion } from 'framer-motion';
import type { Book } from '@/types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  index: number;
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #1B2438 0%, #2D3748 50%, #4A5568 100%)',
  'linear-gradient(135deg, #2D3748 0%, #3D4A5C 50%, #5A6B7D 100%)',
  'linear-gradient(135deg, #1B2438 0%, #C9A96E 100%)',
  'linear-gradient(135deg, #3D2515 0%, #5C3A22 50%, #8B5E3C 100%)',
  'linear-gradient(135deg, #2D3748 0%, #4A5568 50%, #C9A96E 100%)',
  'linear-gradient(135deg, #1B2438 0%, #374151 50%, #4B5563 100%)',
];

function getGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_GRADIENTS[Math.abs(hash) % PLACEHOLDER_GRADIENTS.length];
}

export function BookCard({ book, onClick, index }: BookCardProps) {
  const isFinished = book.status === 'finished';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.03, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className={`book-3d w-[100px] sm:w-[120px] lg:w-[130px] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out select-none ${
        isFinished ? 'opacity-40 saturate-[0.2]' : ''
      }`}
      onClick={onClick}
    >
      {book.coverImage ? (
        <div
          className={`book-cover transition-shadow duration-300 ${
            isFinished ? 'sepia-[0.3]' : ''
          }`}
          style={{ backgroundImage: `url(${book.coverImage})` }}
        />
      ) : (
        <div
          className={`book-cover flex items-center justify-center p-3 transition-shadow duration-300 ${
            isFinished ? 'sepia-[0.3]' : ''
          }`}
          style={{ background: getGradient(book.title) }}
        >
          <span className="text-[#FDFBF7] text-[10px] sm:text-xs font-serif text-center leading-relaxed tracking-wider line-clamp-3 opacity-90">
            {book.title}
          </span>
        </div>
      )}
      <p className={`text-[11px] sm:text-xs mt-3.5 line-clamp-2 text-center max-w-full font-sans tracking-wide leading-relaxed font-medium ${
        isFinished ? 'text-[#4A5568]/50' : 'text-[#2D3748]'
      }`}>
        {book.title}
      </p>
      {isFinished && (
        <p className="text-[9px] text-center text-[#4A5568]/60 mt-1 font-serif tracking-widest">
          — FINISHED —
        </p>
      )}
    </motion.div>
  );
}
