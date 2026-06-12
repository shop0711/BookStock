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
      className="flex gap-3 p-3 rounded-xl hover:bg-[#FAFAF7] border border-transparent hover:border-[#E8E4DF] transition-all duration-200 cursor-pointer group"
    >
      {/* Cover thumbnail */}
      <div className="w-12 h-18 shrink-0 rounded overflow-hidden bg-[#F5F3F0]">
        {result.coverImage ? (
          <img
            src={result.coverImage}
            alt={result.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9E9E9E] text-xs">
            📖
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#2C2C2C] line-clamp-2">{result.title}</p>
        <p className="text-xs text-[#9E9E9E] mt-0.5 truncate">
          {result.authors.join(', ') || '著者不明'}
        </p>
      </div>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAdd(result);
        }}
        className="text-xs bg-[#B8860B] text-white px-3 py-1.5 rounded-full hover:bg-[#9E7209] shrink-0 self-center transition-colors duration-200 opacity-80 group-hover:opacity-100"
      >
        追加
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-center">
              <h2 className="font-serif text-lg font-semibold text-[#2C2C2C]">本を追加</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#F5F3F0] transition-colors duration-200 text-[#9E9E9E] hover:text-[#6B6B6B]"
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
                      ? 'text-[#B8860B] border-[#B8860B]'
                      : 'text-[#9E9E9E] border-transparent hover:text-[#6B6B6B]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Tab 0: Title Search */}
              {activeTab === 0 && (
                <div>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="タイトルで検索..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DF] bg-[#FAFAF7] text-sm text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none transition-all duration-200"
                      autoFocus
                    />
                  </div>

                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-[#B8860B]" />
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
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E4DF] bg-[#FAFAF7] text-sm text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none transition-all duration-200"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleIsbnSearch()}
                  />
                  <button
                    onClick={handleIsbnSearch}
                    disabled={isLoading || !isbnQuery.trim()}
                    className="mt-3 w-full bg-[#B8860B] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9E7209] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                <OcrUploader onSearchText={handleOcrSearch} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
