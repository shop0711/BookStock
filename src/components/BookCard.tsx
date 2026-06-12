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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
      className={`book-3d w-[100px] sm:w-[120px] lg:w-[130px] ${
        isFinished ? 'opacity-50 saturate-[0.3]' : ''
      }`}
      onClick={onClick}
    >
      {book.coverImage ? (
        <div
          className={`book-cover ${
            isFinished ? 'sepia-[0.4]' : ''
          }`}
          style={{ backgroundImage: `url(${book.coverImage})` }}
        />
      ) : (
        <div
          className={`book-cover flex items-center justify-center p-2 ${
            isFinished ? 'sepia-[0.4]' : ''
          }`}
          style={{ background: getGradient(book.title) }}
        >
          <span className="text-white text-xs font-serif text-center leading-snug line-clamp-3 drop-shadow-sm">
            {book.title}
          </span>
        </div>
      )}
      <p className={`text-xs mt-2 line-clamp-2 text-center max-w-full font-sans ${
        isFinished ? 'text-[#A0A0A0]' : 'text-[#4A5568]'
      }`}>
        {book.title}
      </p>
      {isFinished && (
        <p className="text-[10px] text-center text-[#A8B09E] mt-0.5 font-serif italic">読了</p>
      )}
    </motion.div>
  );
}
