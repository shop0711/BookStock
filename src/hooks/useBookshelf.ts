import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Book, BookStatus } from '@/types';

const STORAGE_KEY = 'tsundoku-bookshelf';

function loadBooks(): Book[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useBookshelf() {
  const [books, setBooks] = useState<Book[]>(loadBooks);

  // Persist to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const addBook = useCallback((bookData: {
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    coverImage?: string;
    isbn?: string;
    pageCount?: number;
  }) => {
    const now = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      status: 'want-to-read',
      memo: '',
      addedAt: now,
      updatedAt: now,
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString() }
          : b
      )
    );
  }, []);

  const updateStatus = useCallback((id: string, status: BookStatus) => {
    updateBook(id, { status });
  }, [updateBook]);

  const updateMemo = useCallback((id: string, memo: string) => {
    updateBook(id, { memo });
  }, [updateBook]);

  const getBooksByStatus = useCallback(
    (status: BookStatus) => books.filter(b => b.status === status),
    [books]
  );

  const isBookExists = useCallback(
    (title: string) => books.some(b => b.title.toLowerCase() === title.toLowerCase()),
    [books]
  );

  const exportData = useCallback(() => {
    const data = JSON.stringify(books, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsundoku-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [books]);

  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid format');
      }
      // Validate each book has required fields
      const validBooks = imported.filter(
        (b: unknown): b is Book =>
          typeof b === 'object' &&
          b !== null &&
          'title' in b &&
          'id' in b
      );
      setBooks(validBooks);
      return true;
    } catch {
      return false;
    }
  }, []);

  const counts = useMemo(() => ({
    total: books.length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    reading: books.filter(b => b.status === 'reading').length,
    finished: books.filter(b => b.status === 'finished').length,
  }), [books]);

  return {
    books,
    addBook,
    removeBook,
    updateBook,
    updateStatus,
    updateMemo,
    getBooksByStatus,
    isBookExists,
    exportData,
    importData,
    ...counts,
  };
}
