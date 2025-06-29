import React from "react";
import { Book, ReadingStatus } from "../types/Book";
import { List, ListItem, Link, Block } from "konsta/react";

type BookListComponentProps = {
  books: Book[];
  onListItemAction?: (isbn13: string) => void;
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
  <List strongIos outlineIos>
    {books.length === 0 ? (
      <Block strong inset className="text-center">
        {emptyNode ? (
          emptyNode
        ) : (
          <div className="flex flex-col items-center gap-4">
            {emptyImage && (
              <img
                src={emptyImage}
                alt="No items"
                className="max-w-[80%] mx-auto"
              />
            )}
            <p className="text-gray-600">{emptyText}</p>
          </div>
        )}
      </Block>
    ) : (
      books.map((book) => (
        <ListItem
          key={book.isbn13}
          link
          chevron={false}
          chevronMaterial={false}
          title={book.title}
          subtitle={book.authors ? `by ${book.authors}` : book.dateAdded}
          text={book.description}
          footer={
            book.categories || book.dateAdded
              ? [book.categories || "", book.dateAdded ? `Added: 12.04` : ""]
                  .filter(Boolean)
                  .join(" • ")
              : undefined
          }
          media={
            <img
              className="ios:rounded-lg material:rounded-full ios:w-20 ios:h-20 material:w-10 material:h-10"
              src={book.coverUrl || book.coverUrl}
              width="80"
              height="80"
              style={{ objectFit: "cover", objectPosition: "center" }}
              alt={`${book.title} cover`}
            />
          }
          onClick={() => onListItemAction && onListItemAction(book.isbn13)}
        />
      ))
    )}
  </List>
);
