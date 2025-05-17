import { useState, useRef } from "react";
import { Page, Navbar, Block, BlockTitle, List, ListItem, Link, Popover, Searchbar } from "konsta/react";
import { books } from "../books";
import { MdOutlineEmojiFlags, MdOutlineMenuBook, MdOutlineClass, MdViewList, MdSort, MdFilterList, MdMoreVert } from "react-icons/md";
import BookListComponent from "../components/BookListComponent"; // Adjust path as needed

const BookList = () => {
  const [sortBy, setSortBy] = useState("title"); // Default sort by title
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
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

  const handleSort = (criterion) => {
    if (sortBy === criterion) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criterion);
      setSortOrder("asc");
    }
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

  const sortedBooks = [...books].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "author":
        comparison = a.author.localeCompare(b.author);
        break;
      case "publishDate":
        comparison = new Date(a.publishDate) - new Date(b.publishDate);
        break;
      case "readingStatus":
        comparison = a.readingStatus.localeCompare(b.readingStatus);
        break;
      default:
        comparison = a.title.localeCompare(b.title);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const filteredBooks = searchQuery
    ? sortedBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
      <Navbar large transparent centerTitle
        title="My Library"
        className="top-0 sticky"
        left={
          <div className="flex gap-10">
            <Link
              className="toggle-link text-gray-600"
              navbar
              onClick={() => openPopover("toggle", ".toggle-link")}
            >
              <MdViewList className="text-3xl" />
            </Link>
            <Link
              className="sort-link text-gray-600"
              navbar
              onClick={() => openPopover("sort", ".sort-link")}
            >
              <MdSort className="text-3xl" />
            </Link>
          </div>
        }
        right={
          <div className="flex gap-10">
            <Link
              className="filter-link text-gray-600"
              navbar
              onClick={() => openPopover("filter", ".filter-link")}
            >
              <MdFilterList className="text-3xl" />
            </Link>
            <Link
              className="more-link text-gray-600"
              navbar
              onClick={() => openPopover("more", ".more-link")}
            >
              <MdMoreVert className="text-3xl" />
            </Link>
          </div>
        }
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
          book.readingStatus === "Finished" ? (
            <MdOutlineEmojiFlags className="text-green-600 text-2xl" title="Finished" />
          ) : book.readingStatus === "Reading" ? (
            <MdOutlineMenuBook className="text-blue-600 text-2xl" title="Reading" />
          ) : (
            <MdOutlineClass className="text-gray-600 text-2xl" title="To Read" />
          )
        }
        showDescription={true}
      />

      <Popover
        opened={popoverOpened}
        target={popoverTargetRef.current}
        onBackdropClick={closePopover}
      >
        <List nested>
          {popoverItems[popoverOpened]?.map((item, index) => (
            <ListItem
              key={index}
              title={item.title}
              link
              onClick={item.onClick}
            />
          ))}
        </List>
      </Popover>
    </Page>
  );
};

export default BookList;