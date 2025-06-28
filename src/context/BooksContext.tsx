import React, { createContext, useContext } from "react";
import { useBooksDB } from "../hooks/useBooksDB";
import { Book, BooksState } from "../types/Book";

const BooksContext = createContext<BooksState | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { books, setBooks, isLoading, error } = useBooksDB();

  return (
    <BooksContext.Provider value={{ books, setBooks, isLoading, error }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooksContext = () => {
  const context = useContext(BooksContext);
  if (!context)
    throw new Error("useBooksContext must be used within a BooksProvider");
  return context;
};
