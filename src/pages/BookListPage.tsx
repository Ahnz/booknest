import { useBooksContext } from "../context/BooksContext";
import { ReadingStatus } from "../types/Book";

export default function BookListPage() {
  const { books, setBooks, isLoading, error } = useBooksContext();

  const addDummy = () => {
    setBooks([
      ...books,
      {
        isbn13: Math.random().toString(36).substr(2, 13),
        title: "Neues Dummy Buch",
        author: "Max Mustermann",
        categories: "Test, Roman",
        cover_url: "https://placehold.co/100x150",
        date_added: new Date().toISOString(),
        description: "Dummy-Datensatz zum Testen aller Felder.",
        published_year: "2024",
        reading_status: ReadingStatus.Unread,
      },
    ]);
  };

  const removeBook = (isbn13: string) => {
    setBooks(books.filter((b) => b.isbn13 !== isbn13));
  };

  return (
    <div>
      <button onClick={addDummy}>Dummy-Buch hinzufügen</button>
      {error && <p>{error}</p>}
      <ul>
        {books.map((b) => (
          <li key={b.isbn13}>
            {b.title} ({b.author})
            <button onClick={() => removeBook(b.isbn13)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
