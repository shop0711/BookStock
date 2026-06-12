import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Book, BookStatus } from '@/types';
import { STATUS_CONFIG } from '@/types';
import { BookCard } from '@/components/BookCard';
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
    if (window.innerWidth >= 640) return 3;
    return 2;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setBooksPerRow(5);
      else if (window.innerWidth >= 640) setBooksPerRow(3);
      else setBooksPerRow(2);
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
      {/* Status Tabs */}
      <div className="flex gap-3 mb-16 flex-wrap justify-center sm:justify-start">
        {STATUS_KEYS.map(status => {
          const config = STATUS_CONFIG[status];
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-6 py-3 sm:py-2.5 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 active:scale-[0.96] ${
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

      {/* Book Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {filteredBooks.length === 0 ? (
            <EmptyState status={activeStatus} />
          ) : (
            <div className="space-y-6">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-14">
                  <div className="flex gap-6 sm:gap-8 justify-start items-end px-4 sm:px-6 pb-2">
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
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
