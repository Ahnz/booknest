// types/Book.ts
export enum ReadingStatus {
  Unread = "Unread",
  Reading = "Reading",
  Finished = "Finished",
}

export interface Book {
  isbn13: string;
  title: string;
  author: string;
  categories?: string;
  cover_url?: string;
  date_added?: string;
  description?: string;
  published_year?: string;
  reading_status?: ReadingStatus; 
}

export interface BooksState {
  books: Book[];
  setBooks: (update: Book[] | ((prev: Book[]) => Book[])) => void;
  isLoading: boolean;
  error: string | null;
}
