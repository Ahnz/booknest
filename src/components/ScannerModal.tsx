import React, { useState } from "react";
import { Segmented, SegmentedButton, Link, Navbar, Page } from "konsta/react";
import ISBNScanner from "./ISBNScanner";
import { BookListComponent } from "./BookListComponent";
import { Book, ReadingStatus } from "../types/Book";
import { ScannerFrame } from "./ScannerFrame";
import { Card } from "konsta/react";

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

const MySegmentedControl: React.FC<{
  mode: Mode;
  onChange: (mode: Mode) => void;
  className?: string;
}> = ({ mode, onChange, className = "" }) => (
  <Segmented strong={true} className={`${className} w-full max-w-xs mx-auto`}>
    <SegmentedButton active={mode === "read"} onClick={() => onChange("read")}>
      Gelesen
    </SegmentedButton>
    <SegmentedButton active={mode === "wishlist"} onClick={() => onChange("wishlist")}>
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
    <Page role="dialog" aria-modal="true" className="fixed inset-0 z-[9999]  flex flex-col" tabIndex={-1}>
      <Navbar
        translucent={false}
        large={scannedBook}
        left={
          <Link navbar onClick={onClose ?? (() => window.history.back())} className="font-semibold">
            Zurück
          </Link>
        }
        right={
          <Link navbar onClick={() => setTorch((v) => !v)} className="font-semibold">
            {torch ? "Blitz an" : "Blitz aus"}
          </Link>
        }
        subnavbar={
          scannedBook && (
            <div className="w-full max-w-lg mx-auto p-12">
              <BookListComponent books={[scannedBook]} emptyText="Kein Buch gefunden" onListItemAction={() => {}} />
            </div>
          )
        }
        subnavbarClassName=" border-b border-gray-200 !pl-0 !pr-0 -mt-16 p-16 mx-auto"
        className="shadow-md"
      />

      {/* Scanner video & masking frame */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ISBNScanner onDetected={setIsbnResult} torch={torch} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Scanner frame */}
          <ScannerFrame width={320} height={180} edgeLength={32} edgeThickness={4} borderRadius={18} />

          {/* Panel: instruction text + segmented control */}
          <div className=" max-w-md w-[95vw] mt-2   pointer-events-auto">
            <div className="text-center font-normal text-gray-400 text-base mb-2 drop-shadow">
              Ziel für den Scan auswählen
            </div>
            <MySegmentedControl mode={mode} onChange={setMode} />
          </div>
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
    </Page>
  );
}
