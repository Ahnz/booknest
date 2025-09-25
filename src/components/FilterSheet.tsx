import { ListInput, Sheet, Block, Button, List, Toolbar, Link, Chip } from "konsta/react";
import { ReadingStatus } from "../types/Book";
import React from "react";
import { BlockTitle } from "konsta/react";

export interface FilterSheetProps {
  opened: boolean;
  onClose: () => void;
  onFilterChange?: (
    status: ReadingStatus | null,
    genres: string[] | null,
    extendedFilters?: {
      minPages?: number;
      maxPages?: number;
      authors?: string[];
      publicationYearFrom?: number;
      publicationYearTo?: number;
      pageCountFilter?: string;
    }
  ) => void;
}

const GENRES = ["Fantasy", "Romance", "Sci-Fi", "Mystery", "Biography"];
const AUTHORS = [
  "J.K. Rowling",
  "J.R.R. Tolkien",
  "Rebecca Yarros",
  "George R.R. Martin",
  "Agatha Christie",
  "Stephen King",
  "Jane Austen",
  "Autor 1000",
  "Autor 1",
  "Autor 2",
  "Autor 3",
  "Autor 4",
  "Autor 5",
  "Autor 6",
  "Autor 7",
  "Autor 8",
  "Autor 9",
  "Autor 10",
  "Autor 11",
  "Autor 12",
];

export default function FilterSheet({ opened, onClose, onFilterChange }: FilterSheetProps) {
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [showExtendedFilters, setShowExtendedFilters] = React.useState(false);
  const [minPages, setMinPages] = React.useState<number | null>(null);
  const [maxPages, setMaxPages] = React.useState<number | null>(null);
  const [selectedAuthors, setSelectedAuthors] = React.useState<string[]>([]);
  const [publicationYearFrom, setPublicationYearFrom] = React.useState<number | null>(null);
  const [publicationYearTo, setPublicationYearTo] = React.useState<number | null>(null);
  const [pageCountFilter, setPageCountFilter] = React.useState<string>("");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) => (prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]));
  };

  const handleSave = () => {
    const extendedFilters = {
      minPages: minPages,
      maxPages: maxPages,
      authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
      publicationYearFrom: publicationYearFrom,
      publicationYearTo: publicationYearTo,
      pageCountFilter: pageCountFilter || undefined,
    };
    onClose();
  };

  return (
    <Sheet
      className="pb-safe w-screen max-h-[80vh] overflow-y-auto" // Set max height and enable scrolling
      opened={opened}
      onBackdropClick={onClose}
    >
      <Toolbar top>
        <div className="left">
          <Link toolbar onClick={onClose}>
            Zurücksetzen
          </Link>
        </div>
        <div className="title">Filter</div>
        <div className="right">
          <Link toolbar onClick={handleSave}>
            Speichern
          </Link>
        </div>
      </Toolbar>
      <List className="ios:mt-4">
        {/* Reading Status */}
        <ListInput
          outline
          label="Lesestatus"
          type="select"
          dropdown
          defaultValue=""
          placeholder="Bitte auswählen..."
          onChange={(e) => {
            const value = e.target.value as ReadingStatus | "";
            onFilterChange?.(value === "" ? null : value, selectedGenres.length > 0 ? selectedGenres : null);
          }}
        >
          <option value="">Alle</option>
          {Object.values(ReadingStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </ListInput>
        {/* Genre Chips */}
        <BlockTitle>Genre</BlockTitle>
        <Block strong inset>
          {GENRES.map((genre) => (
            <Chip
              key={genre}
              outline={!selectedGenres.includes(genre)}
              className="m-0.5"
              onClick={() => toggleGenre(genre)}
              colors={{
                fillBg: selectedGenres.includes(genre) ? "bg-blue-500" : "",
                fillText: selectedGenres.includes(genre) ? "text-white" : "",
                outlineBorder: selectedGenres.includes(genre) ? "border-blue-500" : "border-gray-300",
              }}
            >
              {genre}
            </Chip>
          ))}
        </Block>
        {/* Extended Filter Toggle */}
        <Block className="pt-0">
          <Button fill className="mx-2 mt-2" onClick={() => setShowExtendedFilters(!showExtendedFilters)}>
            {showExtendedFilters ? "Erweiterte Filter einklappen" : "Erweiterte Filter anzeigen"}
          </Button>
        </Block>
        {/* Extended Filters Section */}
        {showExtendedFilters && (
          <Block className="pt-0">
            <List className="ios:mt-2">
              {/* Authors */}
              <BlockTitle>Autoren</BlockTitle>
              <Block strong inset>
                {AUTHORS.map((author) => (
                  <Chip
                    key={author}
                    outline={!selectedAuthors.includes(author)}
                    className="m-0.5"
                    onClick={() => toggleAuthor(author)}
                    colors={{
                      fillBg: selectedAuthors.includes(author) ? "bg-blue-500" : "",
                      fillText: selectedAuthors.includes(author) ? "text-white" : "",
                      outlineBorder: selectedAuthors.includes(author) ? "border-blue-500" : "border-gray-300",
                    }}
                  >
                    {author}
                  </Chip>
                ))}
              </Block>
              {/* Publication Year */}
              <BlockTitle>Veröffentlichungsjahr</BlockTitle>
              <ListInput
                outline
                label="Von"
                type="number"
                placeholder="Jahr eingeben..."
                value={publicationYearFrom?.toString() || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPublicationYearFrom(value ? parseInt(value, 10) : null);
                }}
              />
              <ListInput
                outline
                label="Bis"
                type="number"
                placeholder="Jahr eingeben..."
                value={publicationYearTo?.toString() || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setPublicationYearTo(value ? parseInt(value, 10) : null);
                }}
              />
              {/* Page Count Dropdown */}
              <BlockTitle>Seitenzahl</BlockTitle>
              <ListInput
                outline
                label="Seitenanzahl"
                type="select"
                value={pageCountFilter}
                onChange={(e) => {
                  setPageCountFilter(e.target.value);
                }}
              >
                <option value="">Alle</option>
                <option value="short">Kurz (&lt;200)</option>
                <option value="medium">Mittel (200-400)</option>
                <option value="long">Lang (&gt;400)</option>
              </ListInput>
            </List>
          </Block>
        )}
      </List>
    </Sheet>
  );
}
