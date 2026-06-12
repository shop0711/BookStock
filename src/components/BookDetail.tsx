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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[#1B2438]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#FDFBF7] rounded-2xl shadow-[0_8px_40px_rgba(27,36,56,0.2)] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-[#E8E4DF] transition-colors duration-200 text-[#8A8A8A] hover:text-[#4A5568]"
            >
              <X size={20} />
            </button>

            {/* Top section: Cover + Info */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 pb-4">
              {/* Cover */}
              <div className="w-40 shrink-0 mx-auto sm:mx-0">
                {book.coverImage ? (
                  <div
                    className="book-cover"
                    style={{ backgroundImage: `url(${book.coverImage})` }}
                  />
                ) : (
                  <div
                    className="book-cover flex items-center justify-center p-3"
                    style={{ background: getGradient(book.title) }}
                  >
                    <span className="text-white text-sm font-serif text-center leading-snug drop-shadow-sm">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3 min-w-0">
                <h2 className="text-xl font-serif font-semibold text-[#1B2438] pr-8">
                  {book.title}
                </h2>
                {book.authors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                    <BookOpen size={14} className="shrink-0 text-[#C9A96E]" />
                    <span>{book.authors.join(', ')}</span>
                  </div>
                )}
                {(book.publisher || book.publishedDate) && (
                  <p className="text-xs text-[#8A8A8A]">
                    {[book.publisher, book.publishedDate].filter(Boolean).join(' · ')}
                  </p>
                )}
                {book.isbn && (
                  <p className="text-xs text-[#8A8A8A]">
                    ISBN: {book.isbn}
                  </p>
                )}
                {book.pageCount && (
                  <p className="text-xs text-[#8A8A8A]">
                    全{book.pageCount}ページ
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <>
                <div className="border-t border-[#E8E4DF]" />
                <div className="px-6 py-4">
                  <p className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider mb-2 font-serif">
                    あらすじ
                  </p>
                  <p className="text-sm text-[#4A5568] leading-relaxed line-clamp-5">
                    {book.description}
                  </p>
                </div>
              </>
            )}

            {/* Status */}
            <div className="border-t border-[#E8E4DF]" />
            <div className="px-6 py-4">
              <p className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider mb-3 font-serif">
                ステータス
              </p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_KEYS.map(status => {
                  const config = STATUS_CONFIG[status];
                  const isActive = book.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(book.id, status)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                        isActive
                          ? `${config.bgColor} ${config.textColor} ${config.borderColor}`
                          : 'bg-[#F5F0E8] text-[#8A8A8A] border-transparent hover:border-[#D4CFC6]'
                      }`}
                    >
                      {config.emoji} {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Memo */}
            <div className="border-t border-[#E8E4DF]" />
            <div className="px-6 py-4">
              <p className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider mb-3 font-serif">
                メモ
              </p>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onBlur={handleMemoBlur}
                placeholder="感想やメモを自由に書けます..."
                className="w-full min-h-[100px] p-3 rounded-xl border border-[#E8E4DF] bg-[#F5F0E8]/50 text-sm text-[#2D3748] placeholder-[#8A8A8A] resize-y focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] transition-all duration-200"
              />
            </div>

            {/* Delete */}
            <div className="border-t border-[#E8E4DF]" />
            <div className="px-6 py-4">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-sm text-[#B07070] hover:text-[#8B4545] hover:bg-[#F5E8E8] px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Trash2 size={14} />
                この本を削除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
