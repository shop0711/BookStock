import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2 } from 'lucide-react';
import { useBookSearch } from '@/hooks/useBookSearch';
import { OcrUploader } from '@/components/OcrUploader';
import type { SearchResult } from '@/types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (result: SearchResult) => void;
}

const TABS = ['🔍 タイトル検索', '📱 ISBN', '📷 スクショ'] as const;

export function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isbnQuery, setIsbnQuery] = useState('');
  const { results, isLoading, error, searchByTitle, searchByIsbn, clearResults } = useBookSearch();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab(0);
      setSearchQuery('');
      setIsbnQuery('');
      clearResults();
    }
  }, [isOpen, clearResults]);

  // Debounced title search
  useEffect(() => {
    if (activeTab !== 0 || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      searchByTitle(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, searchByTitle]);

  const handleIsbnSearch = () => {
    if (isbnQuery.trim()) {
      searchByIsbn(isbnQuery);
    }
  };

  const handleAdd = (result: SearchResult) => {
    onAdd(result);
    onClose();
  };

  const handleOcrSearch = useCallback((text: string) => {
    setActiveTab(0);
    setSearchQuery(text);
    searchByTitle(text);
  }, [searchByTitle]);

  const renderSearchResult = (result: SearchResult) => (
    <div
      key={result.id}
      className="flex gap-4 p-4 rounded-xl hover:bg-[#C9A96E]/5 transition-all duration-300 cursor-pointer group active:scale-[0.99]"
    >
      {/* Cover thumbnail */}
      <div className="w-12 h-18 shrink-0 rounded overflow-hidden bg-[#E8E4DF] shadow-[2px_2px_8px_rgba(0,0,0,0.08)]">
        {result.coverImage ? (
          <img
            src={result.coverImage}
            alt={result.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8A8A8A] text-xs">
            📖
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xs sm:text-sm font-medium text-[#2D3748] line-clamp-2 tracking-wide leading-relaxed">{result.title}</p>
        <p className="text-[10px] sm:text-xs text-[#4A5568]/60 mt-1 truncate tracking-wide">
          {result.authors.join(', ') || '著者不明'}
        </p>
      </div>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAdd(result);
        }}
        className="text-[10px] tracking-widest font-bold bg-[#1B2438] text-[#FDFBF7] hover:bg-[#C9A96E] hover:text-[#1B2438] px-5 py-3 sm:px-4 sm:py-2 rounded-full shrink-0 self-center transition-all duration-300 active:scale-[0.95]"
      >
        追加
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1B2438]/40 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#FDFBF7]/85 backdrop-blur-xl border border-[#C9A96E]/5 rounded-t-[32px] shadow-[0_-12px_40px_rgba(27,36,56,0.1)] w-full max-w-xl flex flex-col max-h-[85vh] pb-[max(env(safe-area-inset-bottom),20px)] sm:pb-6">
              {/* Grab handle */}
              <div className="flex justify-center pt-4 pb-1">
                <div className="w-12 h-1 rounded-full bg-[#D4CFC6]/60" />
              </div>

              {/* Header */}
              <div className="px-8 pt-3 pb-4 flex justify-between items-center">
                <h2 className="font-serif text-base font-medium text-[#1B2438] tracking-widest uppercase">本を追加</h2>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full hover:bg-[#C9A96E]/10 active:scale-95 transition-all duration-200 text-[#4A5568]/60 hover:text-[#1B2438]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab bar */}
              <div className="px-8 py-2 flex gap-3">
                {TABS.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(index);
                      clearResults();
                    }}
                    className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full transition-all duration-300 active:scale-[0.96] ${
                      activeTab === index
                        ? 'bg-[#C9A96E]/15 text-[#C9A96E] font-medium'
                        : 'text-[#4A5568]/50 hover:text-[#2D3748] hover:bg-[#C9A96E]/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content — scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-8">
                {/* Tab 0: Title Search */}
                {activeTab === 0 && (
                  <div>
                    <div className="relative">
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5568]/50" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="タイトルで検索..."
                        className="w-full pl-11 pr-4 py-3.5 sm:py-3 rounded-xl border border-transparent bg-[#C9A96E]/5 text-xs tracking-wide text-[#2D3748] placeholder-[#4A5568]/40 focus:border-[#C9A96E]/30 focus:bg-transparent focus:ring-0 focus:outline-none transition-all duration-300"
                        autoFocus
                      />
                    </div>

                    {isLoading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={20} className="animate-spin text-[#C9A96E]" />
                      </div>
                    )}

                    {error && !isLoading && (
                      <p className="text-xs text-red-500 mt-4 text-center">{error}</p>
                    )}

                    {!isLoading && results.length > 0 && (
                      <div className="space-y-1 mt-6">
                        {results.map(renderSearchResult)}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 1: ISBN */}
                {activeTab === 1 && (
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={isbnQuery}
                      onChange={(e) => setIsbnQuery(e.target.value)}
                      placeholder="ISBN（10桁 or 13桁）を入力"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-transparent bg-[#C9A96E]/5 text-xs tracking-wide text-[#2D3748] placeholder-[#4A5568]/40 focus:border-[#C9A96E]/30 focus:bg-transparent focus:ring-0 focus:outline-none transition-all duration-300"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleIsbnSearch()}
                    />
                    <button
                      onClick={handleIsbnSearch}
                      disabled={isLoading || !isbnQuery.trim()}
                      className="mt-4 w-full bg-[#1B2438] text-[#FDFBF7] hover:bg-[#C9A96E] hover:text-[#1B2438] font-bold tracking-widest text-xs py-4 sm:py-3 rounded-xl hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin mx-auto" />
                      ) : (
                        'SEARCH'
                      )}
                    </button>

                    {error && !isLoading && (
                      <p className="text-xs text-red-500 mt-4 text-center">{error}</p>
                    )}

                    {!isLoading && results.length > 0 && (
                      <div className="space-y-1 mt-4">
                        {results.map(renderSearchResult)}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: OCR */}
                {activeTab === 2 && (
                  <div className="ocr-container">
                    <OcrUploader onSearchText={handleOcrSearch} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
