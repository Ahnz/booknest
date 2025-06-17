import { Block, Button } from "konsta/react";
import { MdAdd } from "react-icons/md";
import BookListComponent from "./BookListComponent";
import startSearchImage from "../assets/startSearch.png";
import nothingFound from "../assets/nothingFound.png";

const SearchResults = ({
  isSearching,
  error,
  searchResults,
  isScannerOpen,
  hasSearched,
  onAdd,
  onImageError,
}) => {
  if (isSearching) {
    return (
      <p className="text-sm text-gray-600 mt-2 text-center">Searching...</p>
    );
  }

  return (
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
              onError={(e) =>
                onImageError(
                  e,
                  "https://via.placeholder.com/300x200?text=Start+Searching"
                )
              }
              alt="Start searching"
              className="max-w-[80%] mx-auto"
            />
            <p className="text-gray-600">
              Start searching for books to add to your collection
            </p>
          </div>
        </Block>
      )}
      {searchResults.length > 0 && !isScannerOpen && (
        <BookListComponent
          books={searchResults}
          onItemClick={() => {}}
          renderAfter={(book) => (
            <Button
              small
              clear
              onClick={() => onAdd(book)}
              className="text-blue-600"
            >
              <MdAdd className="text-xl" />
            </Button>
          )}
          showDescription={true}
        />
      )}
      {error === "No books with ISBN-13 found for this search." &&
        searchResults.length === 0 &&
        !isScannerOpen && (
          <Block strong inset className="text-center">
            <div className="flex flex-col items-center gap-4">
              <img
                src={nothingFound}
                onError={(e) =>
                  onImageError(
                    e,
                    "https://via.placeholder.com/300x200?text=Nothing+Found"
                  )
                }
                alt="Nothing found"
                className="max-w-[80%] mx-auto"
              />
              <p className="text-gray-600">No books with ISBN-13 found.</p>
            </div>
          </Block>
        )}
      {error === "No books found for this search." &&
        searchResults.length === 0 &&
        !isScannerOpen && (
          <Block strong inset className="text-center">
            <div className="flex flex-col items-center gap-4">
              <img
                src={nothingFound}
                onError={(e) =>
                  onImageError(
                    e,
                    "https://via.placeholder.com/300x200?text=Nothing+Found"
                  )
                }
                alt="Nothing found"
                className="max-w-[80%] mx-auto"
              />
              <p className="text-gray-600">No books found.</p>
            </div>
          </Block>
        )}
    </>
  );
};

export default SearchResults;
