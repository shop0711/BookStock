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
    bgColor: 'bg-[#E8EDF5]',
    textColor: 'text-[#1B2438]',
    borderColor: 'border-[#C9A96E]',
  },
  'reading': {
    label: '読書中',
    emoji: '📕',
    bgColor: 'bg-[#FDF6EC]',
    textColor: 'text-[#8B6914]',
    borderColor: 'border-[#D4B876]',
  },
  'finished': {
    label: '読了',
    emoji: '✅',
    bgColor: 'bg-[#ECEDE8]',
    textColor: 'text-[#5A6352]',
    borderColor: 'border-[#A8B09E]',
  },
} as const;
