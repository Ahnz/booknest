import { useState, useEffect } from "react";
import { Page, Navbar, Block, Searchbar, Link, Button } from "konsta/react";
import { MdOutlineQrCodeScanner, MdAdd } from "react-icons/md";
import startSearchImage from "../assets/startSearch.png";
import nothingFound from "../assets/nothingFound.png";
import BookListComponent from "../components/BookListComponent";
import ISBNScanner from "../components/ISBNScanner";
import noCoverThumb from "../assets/no_cover_thumb.gif";

const OnlineSearch = ({ books, onAddBook }) => {
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );
  const [searchResults, setSearchResults] = useState(() => {
    const stored = localStorage.getItem("searchResults");
    return stored ? JSON.parse(stored) : [];
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("searchResults", JSON.stringify(searchResults));
  }, [searchQuery, searchResults]);

  // Handle book search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query.");
      return;
    }
    console.log("Starting search with query:", searchQuery); // Debug log
    setIsSearching(true);
    setHasSearched(true); // Mark that a search has been performed
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.totalItems === 0) {
        setSearchResults([]);
        setError("No books found for this search.");
      } else {
        const books = data.items.map((item) => {
          const isbn13 = item.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier || null;
          return {
            // Removed id, as isbn13 is now the keyPath
            title: item.volumeInfo.title || "Unknown Title",
            author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
            isbn13, // Ensure isbn13 is included
            published_year: item.volumeInfo.publishedDate?.split("-")[0] || "Unknown",
            cover_url: item.volumeInfo.imageLinks?.thumbnail || noCoverThumb,
            categories: item.volumeInfo.categories?.join(", ") || "",
            description: item.volumeInfo.description || item.searchInfo?.textSnippet || "No description available.",
          };
        });
        // Filter out books without isbn13 since it's the keyPath
        const validBooks = books.filter((book) => book.isbn13);
        if (validBooks.length === 0) {
          setSearchResults([]);
          setError("No books with ISBN-13 found for this search.");
        } else {
          setSearchResults(validBooks);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch search results.");
      setSearchResults([]);
    }
    setIsSearching(false);
    console.log("Search completed, query after search:", searchQuery); // Debug log
  };

  // Handle add book from search results
  const handleAddSearchResult = (book) => {
    if (book.isbn13 && books.some((b) => b.isbn13 === book.isbn13)) {
      setError("This book is already in your list.");
      return;
    }
    const newBook = {
      ...book,
      reading_status: 0,
      date_added: new Date().toISOString().split("T")[0],
    };
    onAddBook(newBook).catch((err) =>
      setError(`Failed to add book: ${err.message}`)
    );
  };

  const handleScanISBN = () => {
    setIsScannerOpen(true);
  };

  // Handle clear button click to reset search state
  const handleClear = () => {
    console.log("Clearing search state"); // Debug log
    setSearchQuery(""); // Ensure searchQuery is cleared
    setSearchResults([]);
    setError(null);
    setIsSearching(false);
    setHasSearched(false); // Reset hasSearched to show placeholder again
  };

  // Function to handle image loading errors
  const handleImageError = (e, fallbackUrl) => {
    console.log(`Image failed to load, switching to fallback: ${e.target.src}`);
    e.target.src = fallbackUrl;
  };

  return (
    <Page className="bg-gray-100">
      <Navbar
        large
        transparent
        centerTitle
        title="Add Books"
        subnavbar={
          <div className="flex items-center w-full px-4">
            <Searchbar
              value={searchQuery}
              onInput={(e) => {
                setSearchQuery(e.target.value);
                console.log("Input changed, query:", e.target.value); // Debug log
              }}
              placeholder="Search books by title, author, or keyword..."
              clearButton
              disableButton
              disableButtonText="Search"
              onDisable={() => {
                handleSearch(); // Trigger search without clearing query
              }}
              onClear={handleClear} // Reset search state on clear button (X)
              className="w-[85%] mr-2"
            />
            <Link onClick={handleScanISBN} className="flex-shrink-0 text-gray-600" navbar>
              <MdOutlineQrCodeScanner className="text-xl" />
            </Link>
          </div>
        }
      />
      {isScannerOpen && (
        <ISBNScanner
          onDetected={async (isbn) => {
            setIsScannerOpen(false); // Close scanner after detection
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000);
              const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
                signal: controller.signal,
              });
              clearTimeout(timeoutId);
              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
              const data = await response.json();
              if (data.totalItems === 0) {
                setError("No book found for this ISBN.");
                return;
              }
              const book = data.items[0];
              const newBook = {
                // Removed id, as isbn13 is now the keyPath
                title: book.volumeInfo.title || "Unknown Title",
                author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
                isbn13: isbn, // Use the scanned ISBN as the keyPath
                published_year: book.volumeInfo.publishedDate?.split("-")[0] || "Unknown",
                reading_status: 0,
                cover_url: book.volumeInfo.imageLinks?.thumbnail || `https://buch.isbn.de/cover/${isbn}.webp`,
                date_added: new Date().toISOString().split("T")[0],
                description: (
                  book.volumeInfo.description ||
                  book.searchInfo?.textSnippet ||
                  "No description available."
                ).slice(0, 150),
                categories: book.volumeInfo.categories?.join(", ") || "",
              };
              if (books.some((b) => b.isbn13 === isbn)) {
                setError("This book is already in your list.");
                return;
              }
              onAddBook(newBook).catch((e) =>
                setError(`Failed to add book: ${e.message}`)
              );
            } catch (err) {
              let errorMessage = "Failed to fetch book details";
              if (err.name === "AbortError") errorMessage = "Request timed out";
              else if (err.message.includes("HTTP error")) errorMessage = err.message;
              setError(errorMessage);
              console.error("Error fetching book details:", err);
            }
          }}
          onClose={() => setIsScannerOpen(false)}
          setError={setError}
        />
      )}
      {isSearching ? (
        <p className="text-sm text-gray-600 mt-2 text-center">Searching...</p>
      ) : (
        <>
          {error && !isScannerOpen && (
            <Block strong inset className="text-center text-red-600">
              {error}
            </Block>
          )}
          {!hasSearched && searchResults.length === 0 && !isScannerOpen && (
            <Block strong inset className="text-center">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={startSearchImage}
                  onError={(e) => handleImageError(e, "https://via.placeholder.com/300x200?text=Start+Searching")}
                  alt="Start searching"
                  className="max-w-[80%] mx-auto"
                />
                <p className="text-gray-600">Start searching for books to add to your collection 📖</p>
              </div>
            </Block>
          )}
          {searchResults.length > 0 && !isScannerOpen && (
            <BookListComponent
              books={searchResults}
              onItemClick={() => {}}
              renderAfter={(book) => (
                <Button small clear onClick={() => handleAddSearchResult(book)} className="text-blue-600">
                  <MdAdd className="text-xl" />
                </Button>
              )}
              showDescription={true}
            />
          )}
          {error === "No books with ISBN-13 found for this search." && searchResults.length === 0 && !isScannerOpen && (
            <Block strong inset className="text-center">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={nothingFound}
                  onError={(e) => handleImageError(e, "https://via.placeholder.com/300x200?text=Nothing+Found")}
                  alt="Nothing found"
                  className="max-w-[80%] mx-auto"
                />
                <p className="text-gray-600">No books with ISBN-13 found.</p>
              </div>
            </Block>
          )}
          {error === "No books found for this search." && searchResults.length === 0 && !isScannerOpen && (
            <Block strong inset className="text-center">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={nothingFound}
                  onError={(e) => handleImageError(e, "https://via.placeholder.com/300x200?text=Nothing+Found")}
                  alt="Nothing found"
                  className="max-w-[80%] mx-auto"
                />
                <p className="text-gray-600">No books found.</p>
              </div>
            </Block>
          )}
        </>
      )}
    </Page>
  );
};

export default OnlineSearch;
