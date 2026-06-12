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
    <div className="min-h-[400px]">
      {/* Status Tabs */}
      <div className="flex gap-1 mb-8 flex-wrap">
        {STATUS_KEYS.map(status => {
          const config = STATUS_CONFIG[status];
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? `${config.bgColor} ${config.textColor} shadow-sm`
                  : 'bg-transparent text-[#9E9E9E] hover:text-[#6B6B6B] hover:bg-[#F5F3F0]'
              }`}
            >
              {config.emoji} {config.label} ({counts[status]})
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
          transition={{ duration: 0.3 }}
        >
          {filteredBooks.length === 0 ? (
            <EmptyState status={activeStatus} />
          ) : (
            <div className="space-y-0">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex}>
                  <div className="flex gap-4 sm:gap-6 justify-start items-end px-2 sm:px-4 pb-1">
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
                  <div className="shelf-edge mb-8" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
