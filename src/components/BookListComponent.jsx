import { List, ListItem } from "konsta/react";

// Simple date formatter for publishDate
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BookListComponent = ({
  books,
  onItemClick,
  renderAfter,
  emptyMessage = "Nothing found",
  showDescription = true,
}) => {
  return (
    <List strongIos outlineIos>
      {books.length === 0 ? (
        <ListItem title={emptyMessage} className="text-center" />
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
              book.categories || book.publishDate
                ? [
                    book.categories?.join(", ") || "",
                    book.publishDate ? `Published: ${formatDate(book.publishDate)}` : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")
                : undefined
            }
            media={
              <img
                className="ios:rounded-lg material:rounded-full ios:w-20 ios:h-20 material:w-10 material:h-10"
                src={book.cover}
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
  );
};

export default BookListComponent;