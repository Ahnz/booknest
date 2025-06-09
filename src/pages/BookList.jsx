import { useState, useRef } from "react";
import { Page } from "konsta/react";
import {
  MdOutlineEmojiFlags,
  MdOutlineMenuBook,
  MdOutlineClass,
} from "react-icons/md";
import BookListComponent from "../components/BookListComponent";
import BookListHeader from "../components/BookListHeader";
import BookListPopover from "../components/BookListPopover";

const BookList = ({ books }) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const popoverTargetRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openPopover = (type, targetRef) => {
    popoverTargetRef.current = targetRef;
    setPopoverOpened(type);
  };

  const closePopover = () => {
    setPopoverOpened(false);
  };

  const renderReadingStatus = (status) => {
    if (status === 0) {
      return <MdOutlineClass className="text-gray-600 text-2xl" title="To Read" />;
    }
    if (status === 1) {
      return (
        <MdOutlineMenuBook className="text-blue-600 text-2xl" title="Reading" />
      );
    }
    return (
      <MdOutlineEmojiFlags className="text-green-600 text-2xl" title="Finished" />
    );
  };


  const sortedBooks = [...books].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const filteredBooks = searchQuery
    ? sortedBooks.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedBooks;

  // Dynamic popover items
  const popoverItems = {
    toggle: Array.from({ length: 5 }, (_, i) => ({
      title: `Item ${i + 1}`,
      onClick: () => {
        console.log(`Toggle option clicked: Item ${i + 1}`);
        closePopover();
      },
    })),
    sort: Array.from({ length: 5 }, (_, i) => ({
      title: `Item ${i + 1}`,
      onClick: () => {
        console.log(`Sort option clicked: Item ${i + 1}`);
        closePopover();
      },
    })),
    filter: Array.from({ length: 5 }, (_, i) => ({
      title: `Item ${i + 1}`,
      onClick: () => {
        console.log(`Filter option clicked: Item ${i + 1}`);
        closePopover();
      },
    })),
    more: Array.from({ length: 5 }, (_, i) => ({
      title: `Item ${i + 1}`,
      onClick: () => {
        console.log(`More option clicked: Item ${i + 1}`);
        closePopover();
      },
    })),
  };

  return (
    <Page className="bg-gray-100">
      <BookListHeader
        searchQuery={searchQuery}
        onSearch={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        onDisable={() => console.log("Disable")}
      />
      <BookListComponent
        books={filteredBooks}
        onItemClick={(book) => console.log(`Clicked: ${book.title}`)}
        renderAfter={(book) => renderReadingStatus(book.reading_status)}
        showDescription={true}
        openPopover={openPopover}
      />

      <BookListPopover
        opened={popoverOpened}
        target={popoverTargetRef.current}
        onClose={closePopover}
        items={popoverItems[popoverOpened] || []}
      />
    </Page>
  );
};

export default BookList;
