import { useState, useEffect } from "react";
import { App } from "konsta/react";
import TabBar from "./components/TabBar";
import BookList from "./pages/BookList";
import Statistics from "./pages/Statistics";
import OnlineSearch from "./pages/OnlineSearch";
import Settings from "./pages/Settings";

// CSV utility function
const booksToCSV = (books) => {
  const headers = [
    "title",
    "author",
    "isbn13",
    "published_year",
    "reading_status",
    "cover_url",
    "date_added",
    "description",
    "categories",
  ];
  const escapeCSV = (str) => `"${str.replace(/"/g, '""')}"`;
  const rows = books.map((book) =>
    [
      escapeCSV(book.title || ""),
      escapeCSV(book.author || ""),
      book.isbn13 || "",
      book.published_year || "",
      book.reading_status || 0,
      escapeCSV(book.cover_url || ""),
      book.date_added || "",
      escapeCSV(book.description || ""),
      escapeCSV(book.categories || ""),
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

// IndexedDB setup
const dbName = "BookLibrary";
const storeName = "books";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2); // Increment version to 2 for schema change

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (event.oldVersion < 1) {
        // Create the object store if it doesn't exist (for new databases)
        db.createObjectStore(storeName, { keyPath: "isbn13", autoIncrement: false });
      } else {
        // For existing databases, delete the old store and create a new one with the updated keyPath
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
        db.createObjectStore(storeName, { keyPath: "isbn13", autoIncrement: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const getAllBooks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const addBook = async (db, book) => {
  return new Promise((resolve, reject) => {
    // Ensure isbn13 is present
    if (!book.isbn13) {
      reject(new Error("Book must have an isbn13 to be added."));
      return;
    }
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(book);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const AppComponent = () => {
  const [activeTab, setActiveTab] = useState("tab-1");
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    let db;
    initDB()
      .then((database) => {
        db = database;
        return getAllBooks(db);
      })
      .then((storedBooks) => {
        setBooks(storedBooks);
      })
      .catch((error) => {
        console.error("IndexedDB error:", error);
        setBooks([]); // Start with empty list if IndexedDB fails
      });

    return () => {
      if (db) db.close();
    };
  }, []);

  useEffect(() => {
    // Clear OnlineSearch state on initial mount (refresh)
    if (isInitialMount) {
      localStorage.removeItem("searchQuery");
      localStorage.removeItem("searchResults");
      localStorage.removeItem("isSearching");
      localStorage.removeItem("error");
      localStorage.removeItem("isScannerOpen");
      setIsInitialMount(false);
    }
    // Persist state on subsequent changes (tab switches or updates)
    else {
      localStorage.setItem("searchQuery", searchQuery);
      localStorage.setItem("searchResults", JSON.stringify(searchResults));
      localStorage.setItem("isSearching", isSearching);
      localStorage.setItem("error", error || "");
      localStorage.setItem("isScannerOpen", isScannerOpen);
    }
  }, [searchQuery, searchResults, isSearching, error, isScannerOpen, isInitialMount]);

  const handleAddBook = (newBook) => {
    const dbPromise = initDB();
    dbPromise
      .then((db) => {
        addBook(db, newBook)
          .then(() => {
            setBooks((prevBooks) => [...prevBooks, newBook]);
          })
          .catch((error) => {
            console.error("Failed to add book:", error);
            setError("Failed to add book: " + error.message);
          });
      })
      .catch((error) => {
        console.error("IndexedDB error:", error);
        setError("IndexedDB error: " + error.message);
      });
  };

  const renderPage = () => {
    switch (activeTab) {
      case "tab-1":
        return <BookList books={books} />;
      case "tab-2":
        return <Statistics />;
      case "tab-3":
        return (
          <OnlineSearch
            books={books}
            setBooks={handleAddBook}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            error={error}
            setError={setError}
            isScannerOpen={isScannerOpen}
            setIsScannerOpen={setIsScannerOpen}
          />
        );
      case "tab-4":
        return <Settings />;
      default:
        return <BookList books={books} />;
    }
  };

  return (
    <App theme="ios" dark={false}>
      {renderPage()}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </App>
  );
};

export default AppComponent;
