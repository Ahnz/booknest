import React, { useState } from "react";
import OptionSelector from "./OptionSelector";
import ISBNScanner from "./ISBNScanner";

interface Book {
  title: string;
  author: string;
  cover_url?: string;
  isbn: string;
  list: "read" | "wishlist";
}

interface ScannerModalProps {
  onClose: (books: Book[]) => void;
  searchByISBN: (isbn: string) => Promise<Omit<Book, "list" | "isbn"> | null>;
}

const ScannerModal: React.FC<ScannerModalProps> = ({
  onClose,
  searchByISBN,
}) => {
  const [multiScan, setMultiScan] = useState(false);
  const [selectedList, setSelectedList] = useState<"read" | "wishlist">("read");
  const [scannedBooks, setScannedBooks] = useState<Book[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  const handleDetected = async (isbn: string) => {
    if (scannedBooks.some((b) => b.isbn === isbn)) {
      setBanner("Buch bereits gescannt!");
      setTimeout(() => setBanner(null), 1500);
      return;
    }
    try {
      const book = await searchByISBN(isbn);
      if (book) {
        setScannedBooks((prev) => [
          ...prev,
          { ...book, list: selectedList, isbn },
        ]);
        setBanner(`Hinzugefügt: ${book.title}`);
        setTimeout(() => setBanner(null), 1500);
      } else {
        setBanner("Kein Buch gefunden.");
        setTimeout(() => setBanner(null), 1500);
      }
    } catch {
      setBanner("Fehler bei Suche.");
      setTimeout(() => setBanner(null), 1500);
    }
  };

  const handleClose = () => {
    onClose(scannedBooks);
  };

  return (
    <div>
      {banner && <div>{banner}</div>}
      <OptionSelector
        multiScan={multiScan}
        setMultiScan={setMultiScan}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
      <ISBNScanner
        isMultiScanning={multiScan}
        onDetected={handleDetected}
        onClose={handleClose}
      />
      <div>
        <button onClick={handleClose} type="button">
          Fertig
        </button>
      </div>
      {multiScan && (
        <div>
          <b>Gescannt:</b>{" "}
          {scannedBooks.map((b) => (
            <span key={b.isbn}>{b.isbn} </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScannerModal;
