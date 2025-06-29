import { Book } from "../types/Book";

// Interface for Google Books API response item
interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    pageCount?: number;
    categories?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
    previewLink?: string;
  };
  searchInfo?: { textSnippet?: string };
}


// Interface for Google Books API response
interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}


const mapToBook = (item: GoogleBookItem, isbn?: string): Book => {
  const identifiers = item.volumeInfo.industryIdentifiers || [];
  // ISBN-13: May not be present for old, non-standard, or self-published books
  const isbn13 =
    isbn ||
    identifiers.find((id) => id.type === "ISBN_13")?.identifier ||
    "";
  // ISBN-10: Optional, not all books have this (especially new releases)
  const isbn10 = identifiers.find((id) => id.type === "ISBN_10")?.identifier;

  return {
    isbn13: isbn13 || item.id,   // Edge: fallback to Google id if ISBN13 is missing (should rarely happen)
    isbn10,                      // Optional: undefined if not present
    title: item.volumeInfo.title || "Unknown Title", 
    subtitle: item.volumeInfo.subtitle,              // Optional: many books have no subtitle
    authors: item.volumeInfo.authors || ["Unknown Author"], 
    publisher: item.volumeInfo.publisher,            // Optional: may be missing (esp. old/self-published works)
    publishedDate: item.volumeInfo.publishedDate,    
    pageCount: item.volumeInfo.pageCount,            // Optional: can be missing or inaccurate
    categories: item.volumeInfo.categories,          // Optional
    description:
      item.volumeInfo.description ||                 // Primary description (may be HTML)
      item.searchInfo?.textSnippet ||                // Fallback: Short snippet from search results
      "No description available.",                   // Fallback: Always a string for your UI
    coverUrl: item.volumeInfo.imageLinks?.thumbnail || "https://placehold.co/100x150", 
    previewLink: item.volumeInfo.previewLink,        // Optional

    // User-specific fields (not in Google API, set in your app)
    readingStatus: undefined,  // Set by user; initial value is undefined
    dateAdded: undefined,      // Set when user adds book to their list
    dateStarted: undefined,    // Set by user
    dateFinished: undefined,   // Set by user
    customShelves: undefined,  // Set by user (e.g. tags, folders, etc.)
  };
};


/** Searches books by query using Google Books API */
export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query.trim()) {
    throw new Error("Enter a search query.");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data: GoogleBooksResponse = await response.json();

    if (data.totalItems === 0 || !data.items) {
      return [];
    }

    return data.items.map((item) => mapToBook(item));
  } catch (error: any) {
    throw new Error(error.name === "TypeError" ? "Network error." : "Failed to fetch books.");
  }
};

/** Searches a book by ISBN using Google Books API */
export const searchByISBN = async (isbn: string): Promise<Book[]> => {
  if (!isbn.trim()) {
    throw new Error("Enter an ISBN.");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: GoogleBooksResponse = await response.json();
    if (data.totalItems === 0 || !data.items) {
      return [];
    }

    return [mapToBook(data.items[0], isbn)];
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out.");
    }
    throw new Error(error.name === "TypeError" ? "Network error." : "Failed to fetch book.");
  }
};