export type BookStatus = 'want-to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  coverImage?: string;
  isbn?: string;
  pageCount?: number;
  status: BookStatus;
  memo: string;
  addedAt: string;
  updatedAt: string;
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    pageCount?: number;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
  };
}

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  coverImage?: string;
  isbn?: string;
  pageCount?: number;
}

export const STATUS_CONFIG = {
  'want-to-read': {
    label: '読みたい',
    emoji: '📖',
    bgColor: 'bg-[#E8F4F8]',
    textColor: 'text-[#2E7D8C]',
    borderColor: 'border-[#B8DDE6]',
  },
  'reading': {
    label: '読書中',
    emoji: '📕',
    bgColor: 'bg-[#FFF3E0]',
    textColor: 'text-[#C17817]',
    borderColor: 'border-[#FFDBA6]',
  },
  'finished': {
    label: '読了',
    emoji: '✅',
    bgColor: 'bg-[#E8F5E9]',
    textColor: 'text-[#4A7C4A]',
    borderColor: 'border-[#B8D4B8]',
  },
} as const;
