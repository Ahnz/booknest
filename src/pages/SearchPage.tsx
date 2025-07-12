import { useState } from "react";
import { Navbar, Link, Searchbar } from "konsta/react";
import { useBooksContext } from "../context/BooksContext";
import { Book, ReadingStatus } from "../types/Book";
import { searchBooks } from "../services/GoogleBooksAPI";
import { BookListComponent } from "@/components/BookListComponent";
import startSearch from "../assets/startSearch.png";
import { Page } from "konsta/react";

interface SearchPageProps {
  onClose: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onClose }) => {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | undefined>(
    undefined
  );
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleTextSearch = async () => {
    if (!searchQuery) {
      setSearchResults(undefined);
      setError(null);
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      setError(error.message || "Failed to search");
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults(undefined);
    setError(null);
  };

  return (
    <Page className="flex flex-col min-h-screen">
      <Navbar
        title="Bücher suchen"
        translucent
        outline={true}
        right={
          <Link navbar onClick={onClose}>
            Close
          </Link>
        }
        subnavbar={
          <Searchbar
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            onClear={handleClear}
            placeholder="Titel, Autor..."
            // Use disableButton as search trigger
            disableButton
            disableButtonText="Suchen"
            onDisable={handleTextSearch}
          />
        }
      />

      {/* Error message */}
      {(error || dbError) && (
        <p className="text-red-500 px-4">{error || dbError}</p>
      )}

      {/* Book List with empty state */}
      <div className="flex-1 px-2 pb-4">
        <BookListComponent
          onListItemAction={handleAddBook}
          books={searchResults ?? []}
          emptyText={
            isSearching
              ? "Suche läuft..."
              : searchResults === undefined
              ? "Starte eine Suche, um Bücher zu deiner Sammlung hinzuzufügen."
              : searchResults.length === 0
              ? "Keine Bücher gefunden."
              : undefined
          }
          emptyImage={startSearch}
        />
      </div>
    </Page>
  );
};

export default SearchPage;
