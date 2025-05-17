import { useState, useRef } from "react";
import { Page, Navbar, Block, BlockTitle, List, ListItem, Link, Popover, Searchbar } from "konsta/react";
import { books } from "../books";
import { MdOutlineEmojiFlags, MdOutlineMenuBook, MdOutlineClass, MdViewList, MdSort, MdFilterList, MdMoreVert } from "react-icons/md";

// Simple date formatter for publishDate
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

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
      <List strongIos outlineIos>
        {filteredBooks.length === 0 ? (
          <ListItem title="Nothing found" className="text-center" />
        ) : (
          filteredBooks.map((book) => (
            <ListItem
              key={book.id}
              link
              chevron={false}
              chevronMaterial={false}
              title={book.title}
              subtitle={`by ${book.author}`}
              text={book.description}
              footer={`${book.categories.join(", ")}`}
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
          ))
        )}
      </List>

      <Popover
        opened={popoverOpened}
        target={popoverTargetRef.current}
        onBackdropClick={closePopover}
      >
        <List nested>
          {popoverOpened === "toggle" && (
            <>
              <ListItem
                title="Item 1"
                link
                onClick={() => {
                  console.log("Toggle option clicked: Item 1");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 2"
                link
                onClick={() => {
                  console.log("Toggle option clicked: Item 2");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 3"
                link
                onClick={() => {
                  console.log("Toggle option clicked: Item 3");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 4"
                link
                onClick={() => {
                  console.log("Toggle option clicked: Item 4");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 5"
                link
                onClick={() => {
                  console.log("Toggle option clicked: Item 5");
                  closePopover();
                }}
              />
            </>
          )}
          {popoverOpened === "sort" && (
            <>
              <ListItem
                title="Item 1"
                link
                onClick={() => {
                  console.log("Sort option clicked: Item 1");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 2"
                link
                onClick={() => {
                  console.log("Sort option clicked: Item 2");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 3"
                link
                onClick={() => {
                  console.log("Sort option clicked: Item 3");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 4"
                link
                onClick={() => {
                  console.log("Sort option clicked: Item 4");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 5"
                link
                onClick={() => {
                  console.log("Sort option clicked: Item 5");
                  closePopover();
                }}
              />
            </>
          )}
          {popoverOpened === "filter" && (
            <>
              <ListItem
                title="Item 1"
                link
                onClick={() => {
                  console.log("Filter option clicked: Item 1");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 2"
                link
                onClick={() => {
                  console.log("Filter option clicked: Item 2");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 3"
                link
                onClick={() => {
                  console.log("Filter option clicked: Item 3");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 4"
                link
                onClick={() => {
                  console.log("Filter option clicked: Item 4");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 5"
                link
                onClick={() => {
                  console.log("Filter option clicked: Item 5");
                  closePopover();
                }}
              />
            </>
          )}
          {popoverOpened === "more" && (
            <>
              <ListItem
                title="Item 1"
                link
                onClick={() => {
                  console.log("More option clicked: Item 1");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 2"
                link
                onClick={() => {
                  console.log("More option clicked: Item 2");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 3"
                link
                onClick={() => {
                  console.log("More option clicked: Item 3");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 4"
                link
                onClick={() => {
                  console.log("More option clicked: Item 4");
                  closePopover();
                }}
              />
              <ListItem
                title="Item 5"
                link
                onClick={() => {
                  console.log("More option clicked: Item 5");
                  closePopover();
                }}
              />
            </>
          )}
        </List>
      </Popover>
    </Page>
  );
};

export default BookList;