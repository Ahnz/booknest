import { useMemo } from "react";
import { Book } from "../types/Book";

export interface BookMetadata {
  allGenres: string[];
  commonGenres: string[];
  allAuthors: string[];
  commonAuthors: string[];
}

/**
 * Extracts unique authors and genres from a list of books
 * Returns both "all" (complete list) and "common" (top 5 most frequent)
 */
export function useBookMetadata(books: Book[]): BookMetadata {
  const metadata = useMemo(() => {
    // Extract and count genres
    const genreCount = new Map<string, number>();
    books.forEach((book) => {
      book.categories?.forEach((category) => {
        const count = genreCount.get(category) || 0;
        genreCount.set(category, count + 1);
      });
    });

    // Extract and count authors
    const authorCount = new Map<string, number>();
    books.forEach((book) => {
      book.authors?.forEach((author) => {
        const count = authorCount.get(author) || 0;
        authorCount.set(author, count + 1);
      });
    });

    // Sort by frequency and get all unique values
    const allGenres = Array.from(genreCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([genre]) => genre);

    const allAuthors = Array.from(authorCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([author]) => author);

    // Get top 5 most common
    const commonGenres = allGenres.slice(0, 5);
    const commonAuthors = allAuthors.slice(0, 5);

    return {
      allGenres,
      commonGenres,
      allAuthors,
      commonAuthors,
    };
  }, [books]);

  return metadata;
}
