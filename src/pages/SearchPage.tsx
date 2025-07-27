import { useState } from "react";
import { Navbar, Link, Searchbar } from "konsta/react";
import { useBooksContext } from "../context/BooksContext";
import { Book, ReadingStatus } from "../types/Book";
import { searchBooks } from "../services/GoogleBooksAPI";
import { BookListComponent } from "@/components/BookListComponent";
import ToastNotification from "../components/ToastNotification";
import startSearch from "../assets/startSearch.png";
import { Page } from "konsta/react";

interface SearchPageProps {
  onClose: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onClose }) => {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastOpened, setToastOpened] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setToastOpened(true);
  };

  const handleAddBook = (book: Book) => {
    if (books.some((b) => b.isbn13 === book.isbn13)) {
      showToast("Buch ist bereits in der Liste.", "error");
      return;
    }
    const newBook: Book = {
      ...book,
      readingStatus: ReadingStatus.Unread,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setBooks([...books, newBook]);
    showToast("Buch erfolgreich hinzugefügt!", "success");
  };

  const handleTextSearch = async () => {
    if (!searchQuery) {
      setSearchResults(undefined);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      showToast(error.message || "Fehler bei der Suche", "error");
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults(undefined);
    setToast(null);
    setToastOpened(false);
  };

  return (
    <Page className="flex flex-col min-h-screen">
      <Navbar
        title="Bücher suchen"
        translucent
        outline={true}
        right={
          <Link navbar onClick={onClose}>
            Schließen
          </Link>
        }
        subnavbar={
          <Searchbar
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            onClear={handleClear}
            placeholder="Titel, Autor..."
            disableButton
            disableButtonText="Suchen"
            onDisable={handleTextSearch}
          />
        }
      />

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          opened={toastOpened}
          onClose={() => setToastOpened(false)}
        />
      )}

      {dbError && <ToastNotification message={dbError} type="error" opened={true} onClose={() => {}} />}

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
