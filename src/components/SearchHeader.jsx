import { Navbar, Searchbar, Link } from "konsta/react";
import { MdOutlineQrCodeScanner } from "react-icons/md";

const SearchHeader = ({
  searchQuery,
  onChangeQuery,
  onSearch,
  onClear,
  onScan,
}) => (
  <Navbar
    large
    transparent
    centerTitle
    title="Add Books"
    subnavbar={
      <div className="flex items-center w-full px-4">
        <Searchbar
          value={searchQuery}
          onInput={(e) => onChangeQuery(e.target.value)}
          placeholder="Search books by title, author, or keyword..."
          clearButton
          disableButton
          disableButtonText="Search"
          onDisable={onSearch}
          onClear={onClear}
          className="w-[85%] mr-2"
        />
        <Link onClick={onScan} className="flex-shrink-0 text-gray-600" navbar>
          <MdOutlineQrCodeScanner className="text-xl" />
        </Link>
      </div>
    }
  />
);

export default SearchHeader;
