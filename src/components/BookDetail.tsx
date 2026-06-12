import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Trash2 } from 'lucide-react';
import type { Book, BookStatus } from '@/types';
import { STATUS_CONFIG } from '@/types';

interface BookDetailProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookStatus) => void;
  onUpdateMemo: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_KEYS: BookStatus[] = ['want-to-read', 'reading', 'finished'];

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #1B2438 0%, #2D3748 50%, #4A5568 100%)',
  'linear-gradient(135deg, #2D3748 0%, #3D4A5C 50%, #5A6B7D 100%)',
  'linear-gradient(135deg, #1B2438 0%, #C9A96E 100%)',
];

function getGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_GRADIENTS[Math.abs(hash) % PLACEHOLDER_GRADIENTS.length];
}

export function BookDetail({
  book,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateMemo,
  onDelete,
}: BookDetailProps) {
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (book) {
      setMemo(book.memo);
    }
  }, [book]);

  const handleMemoBlur = () => {
    if (book && memo !== book.memo) {
      onUpdateMemo(book.id, memo);
    }
  };

  const handleDelete = () => {
    if (!book) return;
    if (window.confirm('この本を削除してもよろしいですか？')) {
      onDelete(book.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#1B2438]/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="bg-[#FDFBF7]/90 backdrop-blur-lg rounded-[28px] shadow-[0_12px_50px_rgba(27,36,56,0.12)] border border-[#C9A96E]/5 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-8 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2.5 rounded-full hover:bg-[#C9A96E]/10 active:scale-95 transition-all duration-200 text-[#4A5568]/60 hover:text-[#1B2438]"
            >
              <X size={18} />
            </button>

            {/* Top section: Cover + Info */}
            <div className="flex flex-col sm:flex-row gap-8 pb-6">
              {/* Cover */}
              <div className="w-36 shrink-0 mx-auto sm:mx-0 shadow-[4px_6px_20px_rgba(0,0,0,0.12)] rounded-lg overflow-hidden">
                {book.coverImage ? (
                  <div
                    className="book-cover border-none shadow-none"
                    style={{ backgroundImage: `url(${book.coverImage})` }}
                  />
                ) : (
                  <div
                    className="book-cover flex items-center justify-center p-3 border-none shadow-none"
                    style={{ background: getGradient(book.title) }}
                  >
                    <span className="text-white text-xs font-serif text-center leading-relaxed tracking-wider drop-shadow-sm">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center gap-3.5 min-w-0 text-center sm:text-left">
                <h2 className="text-xl font-serif font-medium text-[#1B2438] pr-0 sm:pr-8 tracking-wide leading-relaxed">
                  {book.title}
                </h2>
                {book.authors.length > 0 && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#4A5568]/70 tracking-wide font-sans">
                    <BookOpen size={13} className="shrink-0 text-[#C9A96E]" />
                    <span>{book.authors.join(', ')}</span>
                  </div>
                )}
                {(book.publisher || book.publishedDate) && (
                  <p className="text-[10px] text-[#4A5568]/60 tracking-wider">
                    {[book.publisher, book.publishedDate].filter(Boolean).join(' · ')}
                  </p>
                )}
                {book.isbn && (
                  <p className="text-[10px] text-[#4A5568]/60 tracking-wider">
                    ISBN: {book.isbn}
                  </p>
                )}
                {book.pageCount && (
                  <p className="text-[10px] text-[#4A5568]/60 tracking-wider">
                    {book.pageCount} 頁
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="mt-6 py-4">
                <p className="text-[10px] font-bold text-[#C9A96E]/80 uppercase tracking-widest mb-3 font-serif">
                  あらすじ
                </p>
                <p className="text-xs text-[#4A5568]/80 leading-relaxed font-sans font-light">
                  {book.description}
                </p>
              </div>
            )}

            {/* Status */}
            <div className="mt-6 py-4">
              <p className="text-[10px] font-bold text-[#C9A96E]/80 uppercase tracking-widest mb-3 font-serif">
                ステータス
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {STATUS_KEYS.map(status => {
                  const config = STATUS_CONFIG[status];
                  const isActive = book.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(book.id, status)}
                      className={`px-5 py-2 rounded-full text-xs tracking-wider transition-all duration-300 font-medium active:scale-[0.96] border-none ${
                        isActive
                          ? 'bg-[#C9A96E]/20 text-[#8B6914] shadow-[0_2px_12px_rgba(201,169,110,0.08)]'
                          : 'bg-[#C9A96E]/5 text-[#4A5568]/50 hover:text-[#2D3748] hover:bg-[#C9A96E]/10'
                      }`}
                    >
                      {config.emoji} {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Memo */}
            <div className="mt-6 py-4">
              <p className="text-[10px] font-bold text-[#C9A96E]/80 uppercase tracking-widest mb-3 font-serif">
                メモ
              </p>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onBlur={handleMemoBlur}
                placeholder="感想やメモを自由に書けます..."
                className="w-full min-h-[100px] p-4 rounded-2xl border border-transparent bg-[#C9A96E]/5 text-xs text-[#2D3748] placeholder-[#4A5568]/40 resize-y focus:outline-none focus:border-[#C9A96E]/30 focus:bg-transparent focus:ring-0 transition-all duration-300 leading-relaxed"
              />
            </div>

            {/* Delete */}
            <div className="mt-6 pt-4 flex justify-end">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-xs text-red-500/60 hover:text-red-600 hover:bg-red-500/5 px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-[0.97]"
              >
                <Trash2 size={13} />
                この本を削除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
