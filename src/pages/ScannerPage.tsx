import React, { useState, useCallback } from "react";
import {
  Link,
  Navbar,
  Page,
  Segmented,
  SegmentedButton,
  Card,
} from "konsta/react";
import ISBNScanner from "../components/ISBNScanner";
import { BookListComponent } from "../components/BookListComponent";
import { Book, ReadingStatus } from "../types/Book";
import { ScannerFrame } from "../components/ScannerFrame";
import { searchByISBN } from "@/services/GoogleBooksAPI";

type Mode = "read" | "wishlist";

export default function ScannerPage({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<Mode>("wishlist");
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (isbn: string | null | undefined) => {
      if (!isbn) {
        setScannedBook(null);
        return;
      }

      try {
        const books = await searchByISBN(isbn);
        if (books.length > 0) {
          const book = {
            ...books[0],
            readingStatus:
              mode === "read" ? ReadingStatus.Finished : ReadingStatus.Wishlist,
          };
          setScannedBook(book);
          setError(null);
        } else {
          setError("Kein Buch für diesen ISBN gefunden");
          setScannedBook(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Fehler beim Abrufen der Buchdaten"
        );
        setScannedBook(null);
      }
    },
    [mode]
  );

  return (
    <Page
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex flex-col"
      tabIndex={-1}
    >
      <Navbar
        translucent={false}
        large={!!scannedBook}
        left={
          <Link navbar onClick={onClose} className="font-semibold">
            Schließen
          </Link>
        }
        right={
          <Link
            navbar
            onClick={() => setTorch((v) => !v)}
            className="font-semibold"
          >
            {torch ? "Blitz aus" : "Blitz an"}
          </Link>
        }
        subnavbar={
          scannedBook && (
            <div className="w-full max-w-lg mx-auto p-4">
              <BookListComponent
                books={[scannedBook]}
                emptyText="Kein Buch gefunden"
                onListItemAction={() => {}}
              />
            </div>
          )
        }
        subnavbarClassName=" border-b border-gray-200 !pl-0 !pr-0 -mt-16 p-16 mx-auto"
        className="shadow-md"
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        <ISBNScanner onDetected={handleScan} torch={torch} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ScannerFrame
            width={320}
            height={180}
            edgeLength={32}
            edgeThickness={4}
            borderRadius={18}
          />
          <div className="max-w-md w-[95vw] mt-2 pointer-events-auto">
            <div className="text-center text-gray-400 text-base mb-2 drop-shadow">
              Ziel für den Scan auswählen
            </div>
            <Segmented className="w-full max-w-xs mx-auto">
              <SegmentedButton
                active={mode === "read"}
                onClick={() => setMode("read")}
              >
                Gelesen
              </SegmentedButton>
              <SegmentedButton
                active={mode === "wishlist"}
                onClick={() => setMode("wishlist")}
              >
                Wunschliste
              </SegmentedButton>
            </Segmented>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-16 w-[92vw] max-w-lg mx-auto z-[10000] p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-lg z-[10000]">
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-400 opacity-30"></div>
          <span className="mx-2 text-gray-400 text-xs">oder</span>
          <div className="flex-1 border-t border-gray-400 opacity-30"></div>
        </div>
        <Card className="p-0">
          <button
            className="w-full flex flex-col items-center justify-center py-2 bg-transparent rounded text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            style={{ lineHeight: 1.2 }}
          >
            <div className="flex items-center gap-2 text-base">
              <span className="font-normal text-gray-700">
                Buch ohne ISBN hinzufügen?
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-bold text-blue-700 text-base">
                Suche starten
              </span>
              <span className="ml-0.5 text-base text-blue-700 font-bold">
                {"»"}
              </span>
            </div>
          </button>
        </Card>
      </div>
    </Page>
  );
}
