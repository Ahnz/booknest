import React, { useState } from "react";
import { Card, Segmented, SegmentedButton } from "konsta/react";
import ISBNScanner from "./ISBNScanner";
import { BookListComponent } from "./BookListComponent";
import { Book, ReadingStatus } from "../types/Book";

const dummyBook: Book = {
  isbn13: "9783426510179",
  title: "Die unendliche Geschichte",
  authors: ["Michael Ende"],
  publishedDate: "1979-09-01",
  categories: ["Fantasy"],
  coverUrl: "https://buch.isbn.de/cover/9783426510179.webp",
  readingStatus: ReadingStatus.Finished,
};

type Mode = "read" | "wishlist";

const MySegmentedControl: React.FC<{ mode: Mode; onChange: (mode: Mode) => void; className?: string }> = ({
  mode,
  onChange,
  className = "",
}) => (
  <Segmented strong className={className}>
    <SegmentedButton strong active={mode === "read"} onClick={() => onChange("read")}>
      Gelesen
    </SegmentedButton>
    <SegmentedButton strong active={mode === "wishlist"} onClick={() => onChange("wishlist")}>
      Wunschliste
    </SegmentedButton>
  </Segmented>
);

export default function ScannerModal({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<Mode>("wishlist");
  const [isbnResult, setIsbnResult] = useState<string | null | undefined>(undefined);
  const [torch, setTorch] = useState(false);

  const scannedBook: Book | undefined = isbnResult
    ? {
        ...dummyBook,
        isbn13: isbnResult,
        readingStatus: mode === "read" ? ReadingStatus.Finished : ReadingStatus.Wishlist,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Scanner & Mask im Hintergrund */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ISBNScanner onDetected={setIsbnResult} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 top-0 h-[calc(50%-80px)] bg-black/70" />
          <div className="absolute left-0 right-0 bottom-0 h-[calc(50%-80px)] bg-black/70" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[160px] w-[5vw] bg-black/70" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[160px] w-[5vw] bg-black/70" />
          <div
            className="absolute left-1/2 top-1/2 w-[90vw] max-w-lg h-[160px] -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-xl"
            style={{ boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Blitz & Exit-Buttons */}
      <button
        onClick={() => setTorch((v) => !v)}
        aria-label="Taschenlampe umschalten"
        className={`fixed top-4 left-4 z-[11000] bg-white/90 hover:bg-white p-2 rounded-full shadow transition ${
          torch ? "ring-2 ring-yellow-400" : ""
        }`}
      >
        <span className={`text-xl ${torch ? "text-yellow-500" : "text-gray-400"}`}>⚡</span>
      </button>
      <button
        onClick={onClose ? onClose : () => window.history.back()}
        aria-label="Scanner schließen"
        className="fixed top-4 right-4 z-[11000] bg-white/90 hover:bg-white p-2 rounded-full shadow transition"
      >
        <span className="text-xl font-bold text-gray-800">&times;</span>
      </button>

      {/* Zentrierter Dialog-Bereich (BookCard + Frame) */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[10001] pointer-events-none">
        <div className="w-[92vw] max-w-lg mx-auto pointer-events-auto">
          <Card className="relative py-3 px-2 transition-all duration-300 min-h-[20px]">
            {!scannedBook ? (
              <>
                <div className="text-center font-normal text-gray-700 text-base mb-2">Ziel für den Scan auswählen</div>
                <MySegmentedControl mode={mode} onChange={setMode} />
              </>
            ) : (
              <>
                <div className="absolute top-2 right-4 text-green-600 font-semibold text-sm">
                  {mode === "read" ? "Als gelesen hinzugefügt" : "Zur Wunschliste hinzugefügt"}
                </div>
                <BookListComponent books={[scannedBook]} emptyText="Kein Buch gefunden" onListItemAction={() => {}} />
                <MySegmentedControl mode={mode} onChange={setMode} className="mt-3" />
              </>
            )}
          </Card>
        </div>
        {/* Dummy-Frame darunter */}
        <div className="relative w-[90vw] max-w-lg h-[160px] mt-8 flex items-center justify-center pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 border-4 border-transparent rounded-xl"
            style={{ boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Unten: "oder" + Alternative Card */}
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
              <span className="font-normal text-gray-700">Buch ohne ISBN hinzufügen?</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-bold text-blue-700 text-base">Suche starten</span>
              <span className="ml-0.5 text-base text-blue-700 font-bold">{"»"}</span>
            </div>
          </button>
        </Card>
      </div>
    </div>
  );
}
