import React from "react";
import { Block, Chip } from "konsta/react";
import { Book, ReadingStatus } from "../../types/Book";

interface BookHeaderProps {
  book: Book;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book }) => (
  <Block className="flex flex-col items-center">
    {book.coverUrl && (
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.title} by ${book.authors.join(", ")}`}
        className="rounded-lg shadow-lg w-48 max-w-full h-auto mb-4"
      />
    )}
    <h1 className="text-xl font-bold text-center mb-1">{book.title}</h1>
    {book.subtitle && <h2 className="text-lg text-gray-500 text-center mb-1">{book.subtitle}</h2>}
    <p className="text-md text-gray-600 mb-2">by {book.authors.join(", ")}</p>
    {book.readingStatus && (
      <Chip outline className="mb-2">
        {ReadingStatus[book.readingStatus]}
      </Chip>
    )}
  </Block>
);
