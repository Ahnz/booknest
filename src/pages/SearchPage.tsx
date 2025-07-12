import { useState } from "react";
import { Page } from "konsta/react";
import { useBooksContext } from "../context/BooksContext";
import { Book, ReadingStatus } from "../types/Book";
import { searchBooks, searchByISBN } from "../services/GoogleBooksAPI";
import ScannerPage from "@/pages/ScannerPage";
import { BookListComponent } from "@/components/BookListComponent";

const SearchPage: React.FC = () => {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | undefined>(
    undefined
  );
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleTextSearch = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      setError(error.message);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleAddBook = (book: Book) => {
    if (books.some((b) => b.isbn13 === book.isbn13)) {
      setError("Book already in list.");
      return;
    }
    const newBook: Book = {
      ...book,
      readingStatus: ReadingStatus.Unread,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setBooks([...books, newBook]);
  };

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title, author..."
      />
      <button onClick={handleTextSearch} disabled={isSearching || isLoading}>
        {isSearching ? "Searching..." : "Search"}
      </button>

      {/* Scanner */}
      <div>
        <button onClick={() => setScannerOpen(true)} type="button">
          Scan Books
        </button>
        {scannerOpen && <ScannerPage onClose={() => setScannerOpen(false)} />}
      </div>

      {/* Error handling */}
      {(error || dbError) && <p>{error || dbError}</p>}

      {/* Book list */}
      <BookListComponent
        onListItemAction={handleAddBook}
        books={searchResults ?? []}
        emptyText={
          isSearching
            ? "Searching..."
            : searchResults === undefined
            ? "Enter a query and search for books!"
            : searchResults.length === 0 && !isSearching && !error && !dbError
            ? "No books found"
            : undefined
        }
      />
    </div>
  );
};

export default SearchPage;
