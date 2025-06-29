import { useEffect, useState, useCallback } from "react";
import { Book, BooksState } from "../types/Book";

// Database configuration for IndexedDB
const DB_NAME = "BookLibrary";
const STORE_NAME = "books";
const DB_VERSION = 1;

// Opens the IndexedDB database and creates the object store if needed
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "isbn13" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(`Failed to open database: ${request.error?.message}`));
  });
}

// Validates that a book has required fields
function isValidBook(book: Book): boolean {
  return (
    typeof book.isbn13 === "string" &&
    book.isbn13.trim() !== "" &&
    typeof book.title === "string" &&
    book.title.trim() !== "" &&
    Array.isArray(book.authors) &&
    book.authors.length > 0 &&
    book.authors.every((a) => typeof a === "string" && a.trim() !== "")
  );
}


// Compares two books to determine if they differ (excluding isbn13)
function booksDiffer(book1: Book, book2: Book): boolean {
  return (
    book1.title !== book2.title ||
    book1.authors !== book2.authors ||
    book1.categories !== book2.categories ||
    book1.coverUrl !== book2.coverUrl ||
    book1.dateAdded !== book2.dateAdded ||
    book1.description !== book2.description ||
    book1.publishedDate !== book2.publishedDate ||
    book1.readingStatus !== book2.readingStatus
  );
}

// Custom hook for managing books in IndexedDB with a useState-like API
export function useBooksDB(): BooksState {
  const [books, setBooksState] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load all books from the database on component mount
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    openDb()
      .then((db: IDBDatabase) => {
        const tx: IDBTransaction = db.transaction(STORE_NAME, "readonly");
        const store: IDBObjectStore = tx.objectStore(STORE_NAME);
        const req: IDBRequest<Book[]> = store.getAll();
        req.onsuccess = () => {
          if (active) {
            const fetchedBooks: Book[] = req.result;
            if (fetchedBooks.every(isValidBook)) {
              setBooksState(fetchedBooks);
              setError(null);
            } else {
              setBooksState([]);
              setError("Invalid book data retrieved from database");
            }
            setIsLoading(false);
          }
          db.close();
        };
        req.onerror = () => {
          if (active) {
            setBooksState([]);
            setError(`Failed to fetch books: ${req.error?.message}`);
            setIsLoading(false);
          }
          db.close();
        };
      })
      .catch((err: Error) => {
        if (active) {
          setBooksState([]);
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Updates books in the database by computing the diff between the target and existing books
  const setBooks = useCallback(
    (targetBooksOrUpdater: Book[] | ((prev: Book[]) => Book[])) => {
      setIsLoading(true);
      setError(null);

      // Support functional updates like useState
      // targetBooks represents the desired state of the book collection
      const targetBooks: Book[] =
        typeof targetBooksOrUpdater === "function" ? targetBooksOrUpdater(books) : targetBooksOrUpdater;

      // Validate: Check for duplicate ISBNs and valid book data
      // targetIsbns contains the ISBNs of all books in the desired state
      const targetIsbns: Set<string> = new Set(targetBooks.map((book: Book) => book.isbn13));
      if (targetIsbns.size !== targetBooks.length) {
        setError("Duplicate ISBNs detected");
        setIsLoading(false);
        console.error("Duplicate ISBNs:", targetBooks);
        return;
      }
      if (!targetBooks.every(isValidBook)) {
        setError("Invalid book data provided");
        setIsLoading(false);
        console.error("Invalid books:", targetBooks);
        return;
      }

      openDb()
        .then((db: IDBDatabase) => {
          const tx: IDBTransaction = db.transaction(STORE_NAME, "readwrite");
          const store: IDBObjectStore = tx.objectStore(STORE_NAME);

          // Load existing books to compute the diff
          const getAllReq: IDBRequest<Book[]> = store.getAll();
          getAllReq.onsuccess = () => {
            const existingBooks: Book[] = getAllReq.result;

            // Create a lookup map for existing books to optimize diff calculation
            const existingBooksMap: Map<string, Book> = new Map(
              existingBooks.map((book: Book) => [book.isbn13, book])
            );

            // Step 1: Add or update books
            // Iterate through targetBooks to add new books or update existing ones
            targetBooks.forEach((targetBook: Book) => {
              // Check if the book exists in the database using its isbn13
              const existingBook: Book | undefined = existingBooksMap.get(targetBook.isbn13);
              // Add the book if it doesn't exist or update it if its fields differ
              if (!existingBook || booksDiffer(existingBook, targetBook)) {
                // store.put adds a new book or overwrites an existing one with the same isbn13
                store.put(targetBook);
              }
              // Else, skip the book if it exists and hasn't changed to avoid unnecessary writes
            });

            // Step 2: Delete books not in targetBooks
            // Iterate through existing books to remove those not present in targetBooks
            existingBooks.forEach((existingBook: Book) => {
              // If the book's isbn13 is not in targetIsbns, it should be deleted
              if (!targetIsbns.has(existingBook.isbn13)) {
                // store.delete removes the book from the database using its isbn13
                store.delete(existingBook.isbn13);
              }
            });

            // Step 3: Update state on successful transaction
            tx.oncomplete = () => {
              setBooksState(targetBooks);
              setError(null);
              setIsLoading(false);
              db.close();
            };
            tx.onerror = () => {
              setError(`Failed to update books: ${tx.error?.message}`);
              setIsLoading(false);
              console.error("Transaction error:", tx.error);
              db.close();
            };
          };
          getAllReq.onerror = () => {
            setError(`Failed to fetch existing books: ${getAllReq.error?.message}`);
            setIsLoading(false);
            console.error("Fetch error:", getAllReq.error);
            db.close();
          };
        })
        .catch((err: Error) => {
          setError(err.message);
          setIsLoading(false);
          console.error("Database error:", err);
        });
    },
    [books]
  );

  return { books, setBooks, isLoading, error };  
}