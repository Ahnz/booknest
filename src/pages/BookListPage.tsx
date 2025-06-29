import { BookListComponent } from "@/components/BookListComponent";
import { useBooksContext } from "../context/BooksContext";
import { ReadingStatus } from "../types/Book";
import welcomeBookshelfImage from "../assets/welcomeBookshelf.png";

export default function BookListPage() {
  const { books, setBooks, isLoading, error } = useBooksContext();

  return (
    <BookListComponent
      onListItemAction={(isbn) => console.log(isbn)}
      books={books}
      emptyImage={welcomeBookshelfImage}
      emptyText="Start searching for books to add to your collection"
    />
  );
}
