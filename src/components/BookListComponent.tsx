import React from "react";
import { List, ListItem, Block, Badge } from "konsta/react";
import { Book, ReadingStatus } from "../types/Book";
import { getReadingStatusStyle } from "../utils/readingStatusStyles";

type BookListComponentProps = {
  books: Book[];
  onListItemAction?: (book: Book) => void;
  emptyImage?: string;
  emptyText?: string;
  emptyNode?: React.ReactNode;
};

export const BookListComponent: React.FC<BookListComponentProps> = ({
  books,
  onListItemAction,
  emptyImage,
  emptyText,
  emptyNode,
}) => (
  <List margin="m-0">
    {books.length === 0 ? (
      <Block inset className="text-center">
        {emptyNode ? (
          emptyNode
        ) : (
          <div className="flex flex-col items-center gap-4">
            {emptyImage && <img src={emptyImage} alt="No items" className="max-w-[80%] mx-auto" />}
            <p className="text-gray-600">{emptyText}</p>
          </div>
        )}
      </Block>
    ) : (
      books.map((book) => {
        const publishYear = book.publishedDate ? book.publishedDate.split("-")[0] : "Unknown";
        const footerParts = [publishYear, book.categories?.length ? book.categories.join(", ") : "No Category"].filter(
          Boolean
        );

        const { badgeText, badgeColor, fillText } = getReadingStatusStyle(book.readingStatus);

        return (
          <ListItem
            key={book.isbn13}
            link
            title={book.title}
            subtitle={book.authors?.length ? `by ${book.authors.join(", ")}` : "by Unknown Author"}
            footer={footerParts.join(" • ")}
            media={
              <div className="relative">
                <img
                  className="ios:rounded-lg material:rounded-full ios:w-15 ios:h-20 material:w-10 material:h-10"
                  src={book.coverUrl || "https://via.placeholder.com/80"}
                  width="80"
                  height="80"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt={`${book.title} cover`}
                />
                {badgeText && (
                  <div className="absolute bottom-[-6px] right-[-6px]">
                    <Badge colors={{ bg: badgeColor, fillText }}>{badgeText}</Badge>
                  </div>
                )}
              </div>
            }
            onClick={() => onListItemAction && onListItemAction(book)}
          />
        );
      })
    )}
  </List>
);
