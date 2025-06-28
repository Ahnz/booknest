import { Book } from "../types/Book";

// Interface for Google Books API response item
interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    industryIdentifiers?: { type: string; identifier: string }[];
    publishedDate?: string;
    imageLinks?: { thumbnail?: string };
    categories?: string[];
    description?: string;
  };
  searchInfo?: { textSnippet?: string };
}

// Interface for Google Books API response
interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}

/** Maps a Google Books API item to a Book interface */
const mapToBook = (item: GoogleBookItem, isbn?: string): Book => ({
  title: item.volumeInfo.title || "Unknown Title",
  author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
  isbn13:
    isbn ||
    item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
    item.id,
  published_year: item.volumeInfo.publishedDate?.split("-")[0] || "Unknown",
  cover_url: item.volumeInfo.imageLinks?.thumbnail || "https://placehold.co/100x150",
  categories: item.volumeInfo.categories?.join(", ") || "",
  description:
    item.volumeInfo.description || item.searchInfo?.textSnippet || "No description available.",
  reading_status: undefined,
  date_added: undefined,
});

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