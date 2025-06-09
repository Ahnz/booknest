import { Navbar, Searchbar } from "konsta/react";

const BookListHeader = ({ searchQuery, onSearch, onClear, onDisable }) => (
  <Navbar
    large
    transparent
    centerTitle
    title="My Library"
    className="top-0 sticky"
    subnavbar={
      <Searchbar
        onInput={onSearch}
        value={searchQuery}
        onClear={onClear}
        disableButton
        disableButtonText="Cancel"
        onDisable={onDisable}
      />
    }
  />
);

export default BookListHeader;
