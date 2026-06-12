import { useState } from 'react';
import { useBookshelf } from '@/hooks/useBookshelf';
import { Header } from '@/components/Header';
import { Bookshelf } from '@/components/Bookshelf';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { BookDetail } from '@/components/BookDetail';
import { AddBookModal } from '@/components/AddBookModal';
import type { Book, SearchResult } from '@/types';

export default function App() {
  const {
    books,
    addBook,
    removeBook,
    updateStatus,
    updateMemo,
    isBookExists,
    exportData,
    importData,
    total,
  } = useBookshelf();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  const handleAddBook = (result: SearchResult) => {
    if (isBookExists(result.title)) {
      alert('この本はすでに登録されています');
      return;
    }

    addBook({
      title: result.title,
      authors: result.authors,
      publisher: result.publisher,
      publishedDate: result.publishedDate,
      description: result.description,
      coverImage: result.coverImage,
      isbn: result.isbn,
      pageCount: result.pageCount,
    });
  };

  const handleImport = (json: string) => {
    const success = importData(json);
    if (success) {
      alert('データをインポートしました');
    } else {
      alert('インポートに失敗しました。ファイルの形式を確認してください。');
    }
  };

  const handleDeleteBook = (id: string) => {
    removeBook(id);
    setSelectedBook(null);
  };

  // Keep selectedBook in sync with latest book data
  const currentSelectedBook = selectedBook
    ? books.find(b => b.id === selectedBook.id) ?? null
    : null;

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header
        totalCount={total}
        onExport={exportData}
        onImport={handleImport}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Bookshelf
          books={books}
          onBookClick={handleBookClick}
        />
      </main>

      <FloatingAddButton onClick={() => setIsAddModalOpen(true)} />

      <BookDetail
        book={currentSelectedBook}
        isOpen={currentSelectedBook !== null}
        onClose={handleCloseDetail}
        onUpdateStatus={updateStatus}
        onUpdateMemo={updateMemo}
        onDelete={handleDeleteBook}
      />

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}
