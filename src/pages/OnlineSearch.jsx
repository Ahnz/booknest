import { useState } from "react";
import { Page, Navbar, NavbarBackLink, Searchbar, Block, Button, Link } from "konsta/react";
import { MdOutlineQrCodeScanner, MdAdd } from "react-icons/md";
import startSearchImage from "../assets/startSearch.png"; // Adjust to /assets/ if in public folder
import nothingFound from "../assets/nothingFound.png"; // Adjust to /assets/ if in public folder
import BookListComponent from "../components/BookListComponent"; // Adjust path as needed
import { books } from "../books"; // Import books.js data

const OnlineSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setHasSearched(false);
  };

  const handleDisable = () => {
    console.log("Disable");
  };

  const handleScanISBN = () => {
    console.log("Scan ISBN clicked");
  };

  const handleAddBook = (book) => {
    console.log(`Add book clicked: ${book.title} by ${book.author}`);
  };

  const handleAddManually = () => {
    console.log("Add manually clicked");
  };

  const filteredBooks = searchQuery
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) || // Handle optional author
          (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase())) // Handle optional isbn
      )
    : [];

  // Function to handle image loading errors
  const handleImageError = (e, fallbackUrl) => {
    console.log(`Image failed to load, switching to fallback: ${e.target.src}`);
    e.target.src = fallbackUrl;
  };

  return (
    <Page className="bg-gray-100">
      <Navbar large transparent centerTitle
        title="Add Books"
        subnavbar={
          <div className="flex items-center w-full">
            <Searchbar
              onInput={handleSearch}
              value={searchQuery}
              onClear={handleClear}
              disableButton
              disableButtonText="Cancel"
              onDisable={handleDisable}
              placeholder="Search by title, author, or ISBN"
              className="w-[85%] mr-2"
            />
            <Link
              onClick={handleScanISBN}
              className="flex-shrink-0 text-gray-600"
              navbar
            >
              <MdOutlineQrCodeScanner className="text-xl" />
            </Link>
          </div>
        }
      />
      {!hasSearched ? (
        <Block strong inset className="text-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src={startSearchImage}
              onError={(e) => handleImageError(e, "https://via.placeholder.com/300x200?text=Start+Searching")}
              alt="Start searching"
              className="max-w-[80%] mx-auto"
            />
            <p className="text-gray-600">
              Start searching for books to add to your collection
            </p>
          </div>
        </Block>
      ) : filteredBooks.length === 0 ? (
        <Block strong inset className="text-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src={nothingFound}
              onError={(e) => handleImageError(e, "https://via.placeholder.com/300x200?text=Nothing+Found")}
              alt="Nothing found"
              className="max-w-[80%] mx-auto"
            />
            <p className="text-gray-600">Nothing found</p>
          </div>
        </Block>
      ) : (
        <BookListComponent
          books={filteredBooks}
          onItemClick={(book) => console.log(`Clicked: ${book.title}`)}
          renderAfter={(book) => (
            <Button
              small
              clear
              onClick={() => handleAddBook(book)}
              className="text-blue-600"
            >
              <MdAdd className="text-xl" />
            </Button>
          )}
          showDescription={true}
        />
      )}

      {hasSearched && (
        <Block strong inset className="text-center">
          <Button clear onClick={handleAddManually}>
            Can’t find it? Add manually
          </Button>
        </Block>
      )}
    </Page>
  );
};

export default OnlineSearch;