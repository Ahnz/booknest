// hooks/useBookSort.ts
import { useState, useMemo } from "react";
import { Book } from "../types/Book";

export type SortOption = "title" | "author" | "dateAdded";
export type SortDirection = "asc" | "desc";

export const useBookSort = (books: Book[]) => {
  const [sortOption, setSortOption] = useState<SortOption>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedBooks = useMemo(() => {
    const sorted = [...books].sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          // Handle authors array - take first author or empty string if no authors
          const authorA = a.authors?.length > 0 ? a.authors[0] : "";
          const authorB = b.authors?.length > 0 ? b.authors[0] : "";
          comparison = authorA.localeCompare(authorB);
          break;
        case "dateAdded":
          const dateA = new Date(a.dateAdded || 0);
          const dateB = new Date(b.dateAdded || 0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [books, sortOption, sortDirection]);

  const handleSortChange = (option: SortOption) => {
    if (option === sortOption) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  return {
    sortedBooks,
    sortOption,
    sortDirection,
    handleSortChange,
  };
};
