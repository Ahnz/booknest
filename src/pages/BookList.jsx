import { useState, useRef } from "react";
import { Page, Navbar, Block, BlockTitle, List, ListItem, Link, Popover, Searchbar } from "konsta/react";
import {
  MdOutlineEmojiFlags,
  MdOutlineMenuBook,
  MdOutlineClass,
  MdViewList,
  MdSort,
  MdFilterList,
  MdMoreVert,
} from "react-icons/md";
import BookListComponent from "../components/BookListComponent"; // Adjust path as needed

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleDisable = () => {
    console.log("Disable");
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
      <Navbar
        large
        transparent
        centerTitle
        title="My Library"
        className="top-0 sticky"
        subnavbar={
          <Searchbar
            onInput={handleSearch}
            value={searchQuery}
            onClear={handleClear}
            disableButton
            disableButtonText="Cancel"
            onDisable={handleDisable}
          />
        }
      />
      <BookListComponent
        books={filteredBooks}
        onItemClick={(book) => console.log(`Clicked: ${book.title}`)}
        renderAfter={(book) =>
          book.reading_status === 0 ? (
            <MdOutlineClass className="text-gray-600 text-2xl" title="To Read" />
          ) : book.reading_status === 1 ? (
            <MdOutlineMenuBook className="text-blue-600 text-2xl" title="Reading" />
          ) : (
            <MdOutlineEmojiFlags className="text-green-600 text-2xl" title="Finished" />
          )
        }
        showDescription={true}
        openPopover={openPopover}
      />

      <Popover opened={popoverOpened} target={popoverTargetRef.current} onBackdropClick={closePopover}>
        <List nested>
          {popoverItems[popoverOpened]?.map((item, index) => (
            <ListItem key={index} title={item.title} link onClick={item.onClick} />
          ))}
        </List>
      </Popover>
    </Page>
  );
};

export default BookList;
