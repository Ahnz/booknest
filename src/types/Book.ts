// types/Book.ts

export enum ReadingStatus {
  Unread = "Unread",
  Reading = "Reading",
  Finished = "Finished",
  Abandoned = "Abandoned",
  Wishlist = "Wishlist",
}

// Book interface with fields mapped to Google Books & user data
export interface Book {
  isbn13: string; // Google: volumeInfo.industryIdentifiers[type==='ISBN_13'].identifier
  isbn10?: string; // Google: volumeInfo.industryIdentifiers[type==='ISBN_10'].identifier
  title: string; // Google: volumeInfo.title
  subtitle?: string; // Google: volumeInfo.subtitle
  authors: string[]; // Google: volumeInfo.authors[]
  publisher?: string; // Google: volumeInfo.publisher
  publishedDate?: string; // Google: volumeInfo.publishedDate (YYYY-MM-DD | YYYY)
  pageCount?: number; // Google: volumeInfo.pageCount
  categories?: string[]; // Google: volumeInfo.categories[]
  description?: string; // Google: volumeInfo.description (Fallback: searchInfo.textSnippet)
  coverUrl?: string; // Google: volumeInfo.imageLinks.thumbnail
  previewLink?: string; // Google: volumeInfo.previewLink

  // User-specific fields
  dateAdded?: string; // When user added this book
  dateStarted?: string; // When user started reading
  dateFinished?: string; // When user finished reading
  readingStatus?: ReadingStatus; // User's reading status
  customShelves?: string[]; // User's custom shelves/tags
}

export interface BooksState {
  books: Book[];
  setBooks: (update: Book[] | ((prev: Book[]) => Book[])) => void;
  isLoading: boolean;
  error: string | null;
}
