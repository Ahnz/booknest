import { useState } from "react";
import { Page } from "konsta/react";
import { useBooksContext } from "../context/BooksContext";
import { Book, ReadingStatus } from "../types/Book";
import { searchBooks, searchByISBN } from "../services/GoogleBooksAPI";

const SearchPage: React.FC = () => {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isbnQuery, setIsbnQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextSearch = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No books found.");
      }
    } catch (error: any) {
      setError(error.message);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleISBNSearch = async () => {
    if (!/^\d{10,13}$/.test(isbnQuery)) {
      setError("Enter a valid 10 or 13-digit ISBN.");
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchByISBN(isbnQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No book found.");
      }
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
      reading_status: ReadingStatus.Unread,
      date_added: new Date().toISOString().split("T")[0],
    };
    setBooks([...books, newBook]);
  };

  return (
    <Page>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, author..."
        />
        <button onClick={handleTextSearch} disabled={isSearching || isLoading}>
          {isSearching ? "Searching..." : "Search"}
        </button>
        <input
          type="text"
          value={isbnQuery}
          onChange={(e) => setIsbnQuery(e.target.value)}
          placeholder="Search by ISBN..."
        />
        <button onClick={handleISBNSearch} disabled={isSearching || isLoading}>
          {isSearching ? "Searching..." : "Search ISBN"}
        </button>
        {(error || dbError) && <p>{error || dbError}</p>}
        {searchResults.length === 0 && !isSearching && !error && !dbError && (
          <p>No results. Enter a query or ISBN.</p>
        )}
        <ul>
          {searchResults.map((book) => (
            <li key={book.isbn13}>
              {book.title} ({book.author})
              <button onClick={() => handleAddBook(book)} disabled={isLoading}>
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
};

export default SearchPage;
