import { useState } from "react";
import { Page, Navbar, Block, BlockTitle, List, ListItem } from "konsta/react";
import { books } from "../books";
import { MdOutlineEmojiFlags, MdOutlineMenuBook, MdOutlineClass } from "react-icons/md";

// Simple date formatter for publishDate
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BookList = () => {
  return (
    <Page className="bg-gray-100">
      <Navbar title="Book List" />
      <BlockTitle>Books</BlockTitle>
      <List strongIos outlineIos>
        {books
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((book) => (
            <ListItem
              key={book.id}
              link
              chevron={false}
              chevronMaterial={false}
              title={book.title}
              subtitle={book.author}
              header={`Published: ${formatDate(book.publishDate)}`}
              text={book.description}
              footer={`Categories: ${book.categories.join(", ")}`}
              media={
                <img
                  className="ios:rounded-lg material:rounded-full ios:w-24 material:w-12"
                  src={book.cover}
                  width="96"
                  alt={`${book.title} cover`}
                />
              }
              after={
                book.readingStatus === "Finished" ? (
                  <MdOutlineEmojiFlags className="text-green-600 text-2xl" title="Finished" />
                ) : book.readingStatus === "Reading" ? (
                  <MdOutlineMenuBook className="text-blue-600 text-2xl" title="Reading" />
                ) : (
                  <MdOutlineClass className="text-gray-600 text-2xl" title="To Read" />
                )
              }
              onClick={() => console.log(`Clicked: ${book.title}`)}
            />
          ))}
      </List>
    </Page>
  );
};

export default BookList;
