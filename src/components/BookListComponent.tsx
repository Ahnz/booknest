import { List, ListItem, Link, Block } from "konsta/react";
import { MdViewList, MdSort, MdFilterList, MdMoreVert } from "react-icons/md";
import emptyList from "@/assets/empty.png";

interface Book {
  isbn13: string; // Use isbn13 as the unique identifier
  title: string;
  author?: string;
  subtitle?: string;
  description?: string;
  categories?: string;
  date_added?: string;
  image_url?: string;
  image?: string;
  reading_status?: number; // Added to match renderReadingStatus
}

interface BookListProps {
  books: Book[];
  onItemClick: (book: Book) => void;
  renderAfter?: (book: Book) => React.ReactNode;
  showDescription?: boolean;
  openPopover: (type: string, selector: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BookListComponent: React.FC<BookListProps> = ({
  books,
  onItemClick,
  renderAfter,
  showDescription = true,
  openPopover,
}) => {
  console.log("Received books:", books); // Debug the input data
  console.log("emptyList import:", emptyList);
  const validBooks = books.filter((book) => book.isbn13 !== undefined && book.title !== undefined);
  validBooks.forEach((book, index) =>
    console.log(`Book ${index}:`, {
      isbn13: book.isbn13,
      title: book.title,
      image_url: book.image_url,
      image: book.image,
    })
  );

  return (
    <div className="w-full">
      <div className="flex justify-between px-4 py-2 shadow-sm">
        <div className="flex gap-4">
          <Link className="toggle-link text-gray-600" onClick={() => openPopover("toggle", ".toggle-link")}>
            <MdViewList className="text-2xl" />
          </Link>
          <Link className="sort-link text-gray-600" onClick={() => openPopover("sort", ".sort-link")}>
            <MdSort className="text-2xl" />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link className="filter-link text-gray-600" onClick={() => openPopover("filter", ".filter-link")}>
            <MdFilterList className="text-2xl" />
          </Link>
          <Link className="more-link text-gray-600" onClick={() => openPopover("more", ".more-link")}>
            <MdMoreVert className="text-2xl" />
          </Link>
        </div>
      </div>

      <List strongIos outlineIos>
        {validBooks.length === 0 ? (
          <Block strong inset className="text-center">
            <div className="flex flex-col items-center gap-4">
              <img
                src={emptyList}
                alt="Start searching"
                className="max-w-[80%] mx-auto"
                onError={() => console.error("Failed to load emptyList image:", emptyList)}
              />
              <p className="text-gray-600">Start searching for books to add to your collection 📖</p>
            </div>
          </Block>
        ) : (
          validBooks.map((book) => (
            <ListItem
              key={book.isbn13} // Use isbn13 as the key
              link
              chevron={false}
              chevronMaterial={false}
              title={book.title}
              subtitle={book.author ? `by ${book.author}` : book.subtitle}
              text={showDescription ? book.description : undefined}
              footer={
                book.categories || book.date_added
                  ? [book.categories || "", book.date_added ? `Added: ${formatDate(book.date_added)}` : ""]
                      .filter(Boolean)
                      .join(" • ")
                  : undefined
              }
              media={
                <img
                  className="ios:rounded-lg material:rounded-full ios:w-20 ios:h-20 material:w-10 material:h-10"
                  src={book.image_url || book.image || "assets/no_cover_thumb.gif"}
                  width="80"
                  height="80"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt={`${book.title} cover`}
                  onError={() =>
                    console.error(`Failed to load image for book ${book.isbn13}:`, {
                      image_url: book.image_url,
                      image: book.image,
                    })
                  }
                />
              }
              after={renderAfter ? renderAfter(book) : null}
              onClick={() => onItemClick(book)}
            />
          ))
        )}
      </List>
    </div>
  );
};

export default BookListComponent;
