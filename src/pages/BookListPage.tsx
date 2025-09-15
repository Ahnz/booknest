import { useState } from "react";
import { BookListComponent } from "@/components/BookListComponent";
import { useBooksContext } from "../context/BooksContext";
import welcomeBookshelfImage from "../assets/welcomeBookshelf.png";
import { Book } from "../types/Book";
import BookDetailPage from "./BookDetailPage";

export default function BookListPage() {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleSave = (updatedBook: Book) => {
    setBooks((prevBooks) => prevBooks.map((book) => (book.isbn13 === updatedBook.isbn13 ? updatedBook : book)));
  };

  const handleDelete = (bookToDelete: Book) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.isbn13 !== bookToDelete.isbn13));
    setSelectedBook(null);
  };

  return (
    <>
      <BookListComponent
        books={books}
        onListItemAction={(book) => setSelectedBook(book)}
        emptyImage={welcomeBookshelfImage}
        emptyText="Start searching for books to add to your collection"
      />
      {selectedBook && (
        <BookDetailPage
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
