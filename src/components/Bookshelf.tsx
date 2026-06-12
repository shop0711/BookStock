import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Book, BookStatus } from '@/types';
import { STATUS_CONFIG } from '@/types';
import { BookCard } from '@/components/BookCard';
import { BookSpine } from '@/components/BookSpine';
import { EmptyState } from '@/components/EmptyState';

interface BookshelfProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const STATUS_KEYS: BookStatus[] = ['want-to-read', 'reading', 'finished'];

function useBooksPerRow() {
  const [booksPerRow, setBooksPerRow] = useState(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 5;
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setBooksPerRow(5);
      else setBooksPerRow(3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return booksPerRow;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function Bookshelf({ books, onBookClick }: BookshelfProps) {
  const [activeStatus, setActiveStatus] = useState<BookStatus>('want-to-read');
  const [viewMode, setViewMode] = useState<'card' | 'spine'>('card');
  const booksPerRow = useBooksPerRow();

  const counts = useMemo(() => {
    const map: Record<BookStatus, number> = { 'want-to-read': 0, 'reading': 0, 'finished': 0 };
    books.forEach(b => map[b.status]++);
    return map;
  }, [books]);

  const filteredBooks = useMemo(
    () => books.filter(b => b.status === activeStatus),
    [books, activeStatus]
  );

  const rows = useMemo(
    () => chunkArray(filteredBooks, booksPerRow),
    [filteredBooks, booksPerRow]
  );

  return (
    <div className="min-h-[400px] py-4">
      {/* Control Panel (Status Tabs + View Switcher) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-16">
        {/* Status Tabs */}
        <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
          {STATUS_KEYS.map(status => {
            const config = STATUS_CONFIG[status];
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-5 py-2.5 sm:py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 active:scale-[0.96] ${
                  isActive
                    ? 'bg-[#C9A96E]/10 text-[#C9A96E] shadow-[0_2px_12px_rgba(201,169,110,0.08)]'
                    : 'bg-transparent text-[#4A5568]/50 hover:text-[#2D3748] hover:bg-[#C9A96E]/5'
                }`}
              >
                {config.emoji} {config.label} <span className="opacity-60 font-sans ml-1">({counts[status]})</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher */}
        <div className="bg-[#C9A96E]/5 rounded-full p-1 flex gap-1 select-none">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 active:scale-[0.96] ${
              viewMode === 'card'
                ? 'bg-[#C9A96E]/15 text-[#C9A96E] shadow-sm'
                : 'text-[#4A5568]/50 hover:text-[#2D3748]'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setViewMode('spine')}
            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 active:scale-[0.96] ${
              viewMode === 'spine'
                ? 'bg-[#C9A96E]/15 text-[#C9A96E] shadow-sm'
                : 'text-[#4A5568]/50 hover:text-[#2D3748]'
            }`}
          >
            Spine
          </button>
        </div>
      </div>

      {/* Book Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeStatus}-${viewMode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {filteredBooks.length === 0 ? (
            <EmptyState status={activeStatus} />
          ) : viewMode === 'card' ? (
            <div className="space-y-4">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-10 sm:mb-14">
                  <div className="flex gap-2.5 sm:gap-6 lg:gap-8 justify-start items-end px-3 sm:px-6 pb-0.5">
                    {row.map((book, bookIndex) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onClick={() => onBookClick(book)}
                        index={rowIndex * booksPerRow + bookIndex}
                      />
                    ))}
                  </div>
                  <div className="shelf-plank" />
                  <div className="shelf-edge" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative mb-14 py-4 max-w-full">
              <div className="flex overflow-x-auto no-scrollbar items-end gap-[1px] px-4 sm:px-6 pb-0.5 max-w-full">
                {filteredBooks.map((book, bookIndex) => (
                  <BookSpine
                    key={book.id}
                    book={book}
                    onClick={() => onBookClick(book)}
                    index={bookIndex}
                  />
                ))}
              </div>
              <div className="shelf-plank" />
              <div className="shelf-edge" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
