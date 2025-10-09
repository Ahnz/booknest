import { useMemo, useState } from "react";
import { Book, ReadingStatus } from "../types/Book";

export interface FilterOptions {
  status: ReadingStatus | null;
  genres: string[] | null;
  authors?: string[];
  publicationYearFrom?: number;
  publicationYearTo?: number;
  pageCountFilter?: string;
  minRating?: number;
}

export function useBookFilter(books: Book[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: null,
    genres: null,
  });

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Filter by reading status
      if (filters.status && book.readingStatus !== filters.status) {
        return false;
      }

      // Filter by genres
      if (filters.genres && filters.genres.length > 0) {
        if (!book.categories || book.categories.length === 0) {
          return false;
        }
        const hasMatchingGenre = filters.genres.some((genre) =>
          book.categories!.some((category) =>
            category.toLowerCase().includes(genre.toLowerCase())
          )
        );
        if (!hasMatchingGenre) {
          return false;
        }
      }

      // Filter by authors
      if (filters.authors && filters.authors.length > 0) {
        if (!book.authors || book.authors.length === 0) {
          return false;
        }
        const hasMatchingAuthor = filters.authors.some((filterAuthor) =>
          book.authors.some((bookAuthor) =>
            bookAuthor.toLowerCase().includes(filterAuthor.toLowerCase())
          )
        );
        if (!hasMatchingAuthor) {
          return false;
        }
      }

      // Filter by publication year
      if (filters.publicationYearFrom || filters.publicationYearTo) {
        if (!book.publishedDate) {
          return false;
        }
        const year = parseInt(book.publishedDate.substring(0, 4));
        if (isNaN(year)) {
          return false;
        }
        if (filters.publicationYearFrom && year < filters.publicationYearFrom) {
          return false;
        }
        if (filters.publicationYearTo && year > filters.publicationYearTo) {
          return false;
        }
      }

      // Filter by page count
      if (filters.pageCountFilter) {
        if (!book.pageCount) {
          return false;
        }
        switch (filters.pageCountFilter) {
          case "short":
            if (book.pageCount >= 200) return false;
            break;
          case "medium":
            if (book.pageCount < 200 || book.pageCount > 400) return false;
            break;
          case "long":
            if (book.pageCount <= 400) return false;
            break;
        }
      }

      return true;
    });
  }, [books, filters]);

  const handleFilterChange = (
    status: ReadingStatus | null,
    genres: string[] | null,
    extendedFilters?: {
      authors?: string[];
      publicationYearFrom?: number;
      publicationYearTo?: number;
      pageCountFilter?: string;
      minRating?: number;
    }
  ) => {
    setFilters({
      status,
      genres,
      ...extendedFilters,
    });
  };

  const resetFilters = () => {
    setFilters({
      status: null,
      genres: null,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.status !== null ||
      (filters.genres !== null && filters.genres.length > 0) ||
      (filters.authors !== undefined && filters.authors.length > 0) ||
      filters.publicationYearFrom !== undefined ||
      filters.publicationYearTo !== undefined ||
      filters.pageCountFilter !== undefined ||
      filters.minRating !== undefined
    );
  }, [filters]);

  return {
    filteredBooks,
    filters,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
  };
}
