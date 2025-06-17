import { List, ListItem, Link, Block } from "konsta/react";
import { MdViewList, MdSort, MdFilterList, MdMoreVert } from "react-icons/md";
import emptyList from "../assets/empty.png";

// Simple date formatter for publishDate
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BookListComponent = ({ books, onItemClick, renderAfter, showDescription = true, openPopover }) => {
  return (
    <div className="w-full">
      {/* Header with filter buttons */}
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

      {/* Book list */}
      <List strongIos outlineIos>
        {books.length === 0 ? (
          <Block strong inset className="text-center">
            <div className="flex flex-col items-center gap-4">
              <img src={emptyList} alt="Start searching" className="max-w-[80%] mx-auto" />
              <p className="text-gray-600">Start searching for books to add to your collection 📖</p>
            </div>
          </Block>
        ) : (
          books.map((book) => (
            <ListItem
              key={book.id}
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
                  src={book.cover_url || book.cover}
                  width="80"
                  height="80"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt={`${book.title} cover`}
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
