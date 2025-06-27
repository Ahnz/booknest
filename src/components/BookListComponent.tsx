import React from "react";
import { Book, ReadingStatus } from "../types/Book";

type BookListComponentProps = {
  books: Book[];
  onRemoveBook?: (isbn13: string) => void; // optional, falls du einen "Löschen"-Button anzeigen willst
};

const getStatusIcon = (status?: ReadingStatus) => {
  switch (status) {
    case ReadingStatus.Unread:
      return <span title="Ungelesen">📚</span>;
    case ReadingStatus.Reading:
      return <span title="Am Lesen">📖</span>;
    case ReadingStatus.Finished:
      return <span title="Fertig">🏁</span>;
    default:
      return null;
  }
};

const BookListComponent: React.FC<BookListComponentProps> = ({
  books,
  onRemoveBook,
}) => (
  <ul>
    {books.map((book) => (
      <li key={book.isbn13}>
        {getStatusIcon(book.reading_status)} {book.title}
        {book.author && <span> – {book.author}</span>}
        {onRemoveBook && (
          <button onClick={() => onRemoveBook(book.isbn13)}>Löschen</button>
        )}
      </li>
    ))}
  </ul>
);

export default BookListComponent;
