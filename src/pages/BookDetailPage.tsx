// components/BookDetailPage.tsx
import { Page, Navbar, Block, Link } from "konsta/react";
import { Book } from "../types/Book";

interface Props {
  book: Book | null;
  onClose: () => void;
}

const BookDetailPage: React.FC<Props> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <Page className="fixed inset-0 z-50">
      <Navbar
        title={book.title}
        left={
          <Link navbar onClick={onClose}>
            Back
          </Link>
        }
      />
      <Block className="p-4 overflow-auto">
        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="rounded-lg shadow-lg w-40 mx-auto mb-4"
          />
        )}
        <h1 className="text-xl font-bold text-center">{book.title}</h1>
        <p className="text-md text-gray-500 text-center">
          {book.authors.join(", ")}
        </p>
        <p className="mt-4 text-gray-700 text-sm leading-relaxed">
          {book.description}
        </p>
      </Block>
    </Page>
  );
};

export default BookDetailPage;
