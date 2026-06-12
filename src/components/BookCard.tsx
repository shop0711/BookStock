import { motion } from 'framer-motion';
import type { Book } from '@/types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  index: number;
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #8B6914 0%, #B8860B 50%, #D4A745 100%)',
  'linear-gradient(135deg, #6B4226 0%, #8B5E3C 50%, #A67B5B 100%)',
  'linear-gradient(135deg, #2E7D8C 0%, #3A9BAD 50%, #5BB8C9 100%)',
  'linear-gradient(135deg, #4A7C4A 0%, #5E9E5E 50%, #7ABF7A 100%)',
  'linear-gradient(135deg, #7B5EA7 0%, #9B7EC8 50%, #B89FDB 100%)',
  'linear-gradient(135deg, #C17817 0%, #D4943A 50%, #E8B060 100%)',
];

function getGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_GRADIENTS[Math.abs(hash) % PLACEHOLDER_GRADIENTS.length];
}

export function BookCard({ book, onClick, index }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
      className="book-3d w-[100px] sm:w-[120px] lg:w-[130px]"
      onClick={onClick}
    >
      {book.coverImage ? (
        <div
          className="book-cover"
          style={{ backgroundImage: `url(${book.coverImage})` }}
        />
      ) : (
        <div
          className="book-cover flex items-center justify-center p-2"
          style={{ background: getGradient(book.title) }}
        >
          <span className="text-white text-xs font-serif text-center leading-snug line-clamp-3 drop-shadow-sm">
            {book.title}
          </span>
        </div>
      )}
      <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-2 text-center max-w-full font-sans">
        {book.title}
      </p>
    </motion.div>
  );
}
