import { motion } from 'framer-motion';
import type { Book } from '@/types';

interface BookSpineProps {
  book: Book;
  onClick: () => void;
  index: number;
}

const SPINE_COLORS = [
  '#2E4A3F', // モスグリーン
  '#4A2E1B', // ディープブラウン
  '#1F2E4A', // ミッドナイトネイビー
  '#4A1E2F', // バーガンディ
  '#5F4B1E', // アンティークマスタード
  '#3B3D3B', // チャコールグレー
  '#2E3D4A', // ブルーグレー
  '#4A3B2E', // テラコッタ
  '#3D2E4A', // ディープパープル
  '#2C3E35', // フォレストナイト
];

function getSpineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

export function BookSpine({ book, onClick, index }: BookSpineProps) {
  const isFinished = book.status === 'finished';
  const hasCover = !!book.coverImage;
  const spineColor = getSpineColor(book.title);

  const style: React.CSSProperties = hasCover
    ? { backgroundImage: `url(${book.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: spineColor };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: index * 0.02, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      onClick={onClick}
      style={style}
      className={`relative w-[28px] sm:w-[32px] h-[170px] sm:h-[210px] cursor-pointer flex flex-col items-center justify-start py-5 select-none transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(201,169,110,0.2)] active:scale-[0.97] shrink-0 border-l border-r border-black/10 shadow-[2px_0_5px_rgba(0,0,0,0.15)] ${
        isFinished ? 'opacity-50 saturate-[0.2] sepia-[0.3]' : ''
      }`}
    >
      {/* Cover overlay to ensure text contrast and look like actual vintage book paper texture */}
      {hasCover && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-300 group-hover:bg-black/50" />
      )}
      
      {/* Spine highlights for 3D realism */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-white/10" />
      <div className="absolute inset-y-0 right-0 w-[2px] bg-black/20" />

      {/* Gold foil lines at top and bottom for premium vintage feel */}
      <div className="absolute top-2.5 left-1 right-1 h-[1px] bg-[#C9A96E]/30" />
      <div className="absolute bottom-2.5 left-1 right-1 h-[1px] bg-[#C9A96E]/30" />

      {/* Vertical Title Text */}
      <div className="relative z-10 flex-1 w-full flex justify-center items-start overflow-hidden px-1 h-[75%] sm:h-[80%]">
        <span className="writing-vertical spine-text-fade text-[#FDFBF7]/90 text-[9px] sm:text-[10px] font-serif tracking-[0.18em] leading-none text-center select-none max-h-full">
          {book.title}
        </span>
      </div>

      {/* Author Indicator (Initials or small marks for design complexity) */}
      {book.authors.length > 0 && (
        <div className="relative z-10 mt-auto text-[7px] font-sans tracking-normal text-[#FDFBF7]/40 scale-75 select-none">
          {book.authors[0].slice(0, 2)}
        </div>
      )}
    </motion.div>
  );
}
