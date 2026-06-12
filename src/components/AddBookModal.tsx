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
      className="flex gap-3 p-3 rounded-xl hover:bg-[#F5F0E8] border border-transparent hover:border-[#C9A96E]/30 transition-all duration-200 cursor-pointer group"
    >
      {/* Cover thumbnail */}
      <div className="w-12 h-18 shrink-0 rounded overflow-hidden bg-[#E8E4DF]">
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2D3748] line-clamp-2">{result.title}</p>
        <p className="text-xs text-[#8A8A8A] mt-0.5 truncate">
          {result.authors.join(', ') || '著者不明'}
        </p>
      </div>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAdd(result);
        }}
        className="text-xs bg-gradient-to-r from-[#C9A96E] to-[#B8960B] text-[#1B2438] font-semibold px-3.5 py-1.5 rounded-full hover:from-[#D4B876] hover:to-[#C9A96E] shrink-0 self-center transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-sm"
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#1B2438]/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#FDFBF7] rounded-t-3xl shadow-[0_-8px_40px_rgba(27,36,56,0.15)] w-full max-w-xl flex flex-col max-h-[85vh]">
              {/* Grab handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#D4CFC6]" />
              </div>

              {/* Header */}
              <div className="px-6 pt-2 pb-3 flex justify-between items-center">
                <h2 className="font-serif text-lg font-semibold text-[#1B2438]">本を追加</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#E8E4DF] transition-colors duration-200 text-[#8A8A8A] hover:text-[#4A5568]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab bar */}
              <div className="px-6 flex gap-1 border-b border-[#E8E4DF]">
                {TABS.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(index);
                      clearResults();
                    }}
                    className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                      activeTab === index
                        ? 'text-[#C9A96E] border-[#C9A96E]'
                        : 'text-[#8A8A8A] border-transparent hover:text-[#4A5568]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content — scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-6">
                {/* Tab 0: Title Search */}
                {activeTab === 0 && (
                  <div>
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="タイトルで検索..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DF] bg-[#F5F0E8]/50 text-sm text-[#2D3748] placeholder-[#8A8A8A] focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] focus:outline-none transition-all duration-200"
                        autoFocus
                      />
                    </div>

                    {isLoading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="animate-spin text-[#C9A96E]" />
                      </div>
                    )}

                    {error && !isLoading && (
                      <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
                    )}

                    {!isLoading && results.length > 0 && (
                      <div className="space-y-1 mt-4">
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
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E4DF] bg-[#F5F0E8]/50 text-sm text-[#2D3748] placeholder-[#8A8A8A] focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] focus:outline-none transition-all duration-200"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleIsbnSearch()}
                    />
                    <button
                      onClick={handleIsbnSearch}
                      disabled={isLoading || !isbnQuery.trim()}
                      className="mt-3 w-full bg-gradient-to-r from-[#C9A96E] to-[#B8960B] text-[#1B2438] font-semibold px-6 py-2.5 rounded-xl text-sm hover:from-[#D4B876] hover:to-[#C9A96E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin mx-auto" />
                      ) : (
                        '検索'
                      )}
                    </button>

                    {error && !isLoading && (
                      <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
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
