import { Book } from "../types/Book";
import { useBookFilter } from "./useBookFilter";
import { useBookSort } from "./useBookSort";

export function useBookSortAndFilter(books: Book[]) {
  // Apply filters first
  const { filteredBooks, handleFilterChange, hasActiveFilters, resetFilters } = useBookFilter(books);
  
  // Then apply sorting to filtered results
  const { sortedBooks, sortOption, sortDirection, handleSortChange } = useBookSort(filteredBooks);
  
  // Final visible books (filtered + sorted)
  const visibleBooks = sortedBooks;

  return {
    visibleBooks,
    // Filter controls
    handleFilterChange,
    hasActiveFilters,
    resetFilters,
    // Sort controls
    sortOption,
    sortDirection,
    handleSortChange,
  };
}
