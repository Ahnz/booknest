import { useState } from "react";
import { Navbar, Link } from "konsta/react";
import { BookListComponent } from "@/components/BookListComponent";
import BookSortPopover from "@/components/BookSortPopover";
import { useBooksContext } from "../context/BooksContext";
import { useBookSort } from "../hooks/useBookSort";
import welcomeBookshelfImage from "../assets/welcomeBookshelf.png";
import { Book } from "../types/Book";
import BookDetailPage from "./BookDetailPage";
import { Toolbar, Block, Button, Sheet } from "konsta/react";
import FilterSheet from "@/components/FilterSheet";

export default function BookListPage() {
  const { books, setBooks, isLoading, error: dbError } = useBooksContext();
  const { sortedBooks, sortOption, sortDirection, handleSortChange } = useBookSort(books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpened, setSheetOpened] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null);

  const handleSave = (updatedBook: Book) => {
    setBooks((prevBooks) => prevBooks.map((book) => (book.isbn13 === updatedBook.isbn13 ? updatedBook : book)));
  };

  const handleDelete = (bookToDelete: Book) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.isbn13 !== bookToDelete.isbn13));
    setSelectedBook(null);
  };

  const openSortPopover = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setPopoverTarget(event.currentTarget);
    setPopoverOpen(true);
  };
  const openSheet = () => setSheetOpened(true);
  const closeSheet = () => setSheetOpened(false);

  const getSortDisplayText = () => {
    const directionIcon = sortDirection === "asc" ? "↑" : "↓";
    switch (sortOption) {
      case "title":
        return `Titel ${directionIcon}`;
      case "author":
        return `Autor ${directionIcon}`;
      case "dateAdded":
        return `Hinzugefügt ${directionIcon}`;
      default:
        return "Sortieren";
    }
  };

  return (
    <>
      <Navbar
        title="Bücher"
        right={
          <>
            <Link navbar onClick={openSortPopover}>
              {getSortDisplayText()}
            </Link>
          </>
        }
        left={
          <>
            <Link navbar onClick={openSheet}>
              Filter
            </Link>
          </>
        }
      />

      <BookListComponent
        books={sortedBooks}
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

      <BookSortPopover
        isOpen={popoverOpen}
        target={popoverTarget}
        sortOption={sortOption}
        sortDirection={sortDirection}
        onClose={() => setPopoverOpen(false)}
        onSortChange={handleSortChange}
      />

      <FilterSheet opened={sheetOpened} onClose={() => setSheetOpened(false)}></FilterSheet>
    </>
  );
}
