import { useState, useCallback } from 'react';
import type { GoogleBooksResponse, SearchResult } from '@/types';

const API_BASE = 'https://www.googleapis.com/books/v1/volumes';

function fixImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  // Ensure HTTPS and get a reasonable size
  return url
    .replace('http://', 'https://')
    .replace('&edge=curl', '')
    .replace('zoom=5', 'zoom=1')
    + (url.includes('zoom=') ? '' : '&zoom=1');
}

function parseVolume(item: GoogleBooksResponse['items'] extends (infer T)[] | undefined ? T : never): SearchResult {
  const info = item.volumeInfo;
  const isbn = info.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
    ?? info.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;

  return {
    id: item.id,
    title: info.title,
    authors: info.authors ?? [],
    publisher: info.publisher,
    publishedDate: info.publishedDate,
    description: info.description,
    coverImage: fixImageUrl(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail),
    isbn,
    pageCount: info.pageCount,
  };
}

export function useBookSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = 'AIzaSyAZ4PZQXdJ7C8qxLsY6jNm-fwdcCZ_flMk';

  const searchByTitle = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      const res = await fetch(
        `${API_BASE}?q=intitle:${encodedQuery}&maxResults=12&langRestrict=ja&printType=books${keyParam}`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: GoogleBooksResponse = await res.json();

      if (!data.items || data.items.length === 0) {
        setResults([]);
        setError('検索結果が見つかりませんでした');
        return;
      }

      setResults(data.items.map(parseVolume));
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索中にエラーが発生しました');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByIsbn = useCallback(async (isbn: string) => {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanIsbn)) {
      setError('有効なISBN（10桁または13桁）を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      const res = await fetch(
        `${API_BASE}?q=isbn:${cleanIsbn}&maxResults=1${keyParam}`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: GoogleBooksResponse = await res.json();

      if (!data.items || data.items.length === 0) {
        setResults([]);
        setError('このISBNの書籍が見つかりませんでした');
        return;
      }

      setResults(data.items.map(parseVolume));
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索中にエラーが発生しました');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchByTitle,
    searchByIsbn,
    clearResults,
  };
}
