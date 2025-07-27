import React from "react";
import { Block, Chip } from "konsta/react";
import { Book, ReadingStatus } from "../../types/Book";
import { getReadingStatusStyle } from "../../utils/readingStatusStyles";
import { UpdateForm } from "../EditableFormField";

interface BookHeaderProps {
  book: Book;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book, editMode, onUpdate }) => {
  const { badgeColor, fillText } = getReadingStatusStyle(book.readingStatus);

  return (
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
        <>
          {editMode ? (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {Object.values(ReadingStatus).map((status) => {
                const { badgeColor, fillText } = getReadingStatusStyle(status);
                const isSelected = book.readingStatus === status;
                return (
                  <Chip
                    key={status}
                    colors={{
                      fillBg: isSelected ? badgeColor : "bg-gray-200",
                      fillText: isSelected ? fillText : "text-gray-800",
                    }}
                    className="text-sm"
                    media={
                      isSelected ? (
                        <span className="text-white w-5 h-5 flex items-center justify-center">✓</span>
                      ) : undefined
                    }
                    onClick={() => onUpdate("readingStatus", status)}
                    aria-label={`Select ${status} reading status`}
                    title={`Select ${status}`}
                  >
                    {status}
                  </Chip>
                );
              })}
            </div>
          ) : (
            <Chip colors={{ fillBg: badgeColor, fillText }} className="mb-2">
              {ReadingStatus[book.readingStatus]}
            </Chip>
          )}
        </>
      )}
    </Block>
  );
};
