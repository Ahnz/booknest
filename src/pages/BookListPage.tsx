import { useState } from "react";
import { BookListComponent } from "@/components/BookListComponent";
import { useBooksContext } from "../context/BooksContext";
import welcomeBookshelfImage from "../assets/welcomeBookshelf.png";
import { Book } from "../types/Book";
import BookDetailPage from "./BookDetailPage";

export default function BookListPage() {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Funktion zum Speichern eines aktualisierten Buches
  const handleSave = (updatedBook: Book) => {
    setBooks((prevBooks) => prevBooks.map((book) => (book.isbn13 === updatedBook.isbn13 ? updatedBook : book)));
  };

  return (
    <>
      <BookListComponent
        books={books}
        onListItemAction={(book) => setSelectedBook(book)}
        emptyImage={welcomeBookshelfImage}
        emptyText="Start searching for books to add to your collection"
      />

      <BookDetailPage book={selectedBook} onClose={() => setSelectedBook(null)} onSave={handleSave} />
    </>
  );
}
