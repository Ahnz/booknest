import React from "react";
import {
  Page,
  Navbar,
  Block,
  Link,
  Chip,
  BlockTitle,
  List,
  ListItem,
} from "konsta/react";
import { Book, ReadingStatus } from "../types/Book";
import { NavbarBackLink } from "konsta/react";

interface BookDetailDialogProps {
  book: Book | null;
  onClose: () => void;
}

const statusLabels: Record<ReadingStatus, string> = {
  [ReadingStatus.Unread]: "Unread",
  [ReadingStatus.Reading]: "Reading",
  [ReadingStatus.Finished]: "Finished",
  [ReadingStatus.Abandoned]: "Abandoned",
  [ReadingStatus.Wishlist]: "Wishlist",
};

const BookDetailPage: React.FC<BookDetailDialogProps> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <Page className="fixed inset-0 z-50 overflow-auto">
      <Navbar
        transparent
        left={<NavbarBackLink navbar onClick={onClose}></NavbarBackLink>}
      />

      <Block className="flex flex-col items-center">
        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="rounded-lg shadow-lg w-48 h-auto mb-4"
          />
        )}
        <h1 className="text-xl font-bold text-center mb-1">{book.title}</h1>
        {book.subtitle && (
          <h2 className="text-lg text-gray-500 text-center mb-1">
            {book.subtitle}
          </h2>
        )}
        <p className="text-md text-gray-600 mb-2">
          by {book.authors.join(", ")}
        </p>
        {book.readingStatus && (
          <Chip outline className="mb-2">
            {statusLabels[book.readingStatus]}
          </Chip>
        )}
      </Block>

      <Block>
        {book.categories && book.categories.length > 0 && (
          <>
            <BlockTitle>Categories</BlockTitle>
            <Block strongIos outlineIos className="flex flex-wrap gap-1">
              {book.categories.map((category) => (
                <Chip key={category} outline className="m-0.5">
                  {category}
                </Chip>
              ))}
            </Block>
          </>
        )}

        <BlockTitle>Description</BlockTitle>
        <Block strongIos outlineIos>
          <p className="text-sm leading-relaxed text-gray-700">
            {book.description || "No description available."}
          </p>
        </Block>

        <BlockTitle>Details</BlockTitle>
        <List strongIos outlineIos>
          <ListItem title="Publisher" after={book.publisher || "Unknown"} />
          <ListItem
            title="Published Date"
            after={book.publishedDate || "Unknown"}
          />
          <ListItem
            title="Page Count"
            after={book.pageCount ? `${book.pageCount}` : "Unknown"}
          />
          <ListItem title="ISBN-13" after={book.isbn13} />
          {book.isbn10 && <ListItem title="ISBN-10" after={book.isbn10} />}
        </List>

        <BlockTitle>User Information</BlockTitle>
        <List strongIos outlineIos>
          <ListItem title="Date Added" after={book.dateAdded || "-"} />
          <ListItem title="Date Started" after={book.dateStarted || "-"} />
          <ListItem title="Date Finished" after={book.dateFinished || "-"} />
          {book.customShelves && book.customShelves.length > 0 && (
            <ListItem title="Shelves" after={book.customShelves.join(", ")} />
          )}
        </List>

        {book.previewLink && (
          <Block className="text-center mt-4">
            <Link href={book.previewLink} external target="_blank">
              Preview this book
            </Link>
          </Block>
        )}
      </Block>
    </Page>
  );
};

export default BookDetailPage;
