import { useState } from "react";
import { BookListComponent } from "@/components/BookListComponent";
import { useBooksContext } from "../context/BooksContext";
import welcomeBookshelfImage from "../assets/welcomeBookshelf.png";
import { Book } from "../types/Book";
import BookDetailPage from "./BookDetailPage";

export default function BookListPage() {
  const { books, isLoading, error } = useBooksContext();

  // Hier speicherst du das Buch, das angeklickt wurde (null bedeutet "kein Dialog")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      <BookListComponent
        books={books}
        onListItemAction={(book) => setSelectedBook(book)}
        emptyImage={welcomeBookshelfImage}
        emptyText="Start searching for books to add to your collection"
      />

      <BookDetailPage
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
