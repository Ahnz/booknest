import { ListInput, Sheet, Block, List, Toolbar, Link, Chip, ListItem } from "konsta/react";
import { ReadingStatus } from "../types/Book"; // Annahme: Dein Enum für ReadingStatus
import React from "react";
import { BlockTitle } from "konsta/react";
import FilterChips from "./FilterChips"; // Annahme: Deine bestehende FilterChips-Komponente

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
      minRating?: number;
    }
  ) => void;
}

const COMMON_GENRES = ["Fantasy", "Romance", "Sci-Fi", "Mystery", "Biography"];
const ALL_GENRES = [
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Mystery",
  "Biography",
  "Thriller",
  "Historical Fiction",
  "Horror",
  "Adventure",
  "Fiction",
  "Non-Fiction",
  "Drama",
  "Comedy",
  "Poetry",
];

const COMMON_AUTHORS = ["J.K. Rowling", "J.R.R. Tolkien", "Rebecca Yarros", "George R.R. Martin", "Agatha Christie"];
const ALL_AUTHORS = [
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
  // Simuliert Tausende
];

export default function FilterSheet({ opened, onClose, onFilterChange }: FilterSheetProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<ReadingStatus | null>(null);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [showExtendedFilters, setShowExtendedFilters] = React.useState(false);
  const [selectedAuthors, setSelectedAuthors] = React.useState<string[]>([]);
  const [publicationYearFrom, setPublicationYearFrom] = React.useState<number>(1900);
  const [publicationYearTo, setPublicationYearTo] = React.useState<number>(new Date().getFullYear());
  const [pageCountFilter, setPageCountFilter] = React.useState<string>("");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [showAllGenres, setShowAllGenres] = React.useState(false);
  const [authorSearchQuery, setAuthorSearchQuery] = React.useState<string>("");

  // Gefilterte Autoren basierend auf Suche
  const filteredAuthors = React.useMemo(() => {
    const authorsToShow = ALL_AUTHORS; // Zeige immer alle, da Suche dynamisch filtert
    if (authorSearchQuery) {
      return authorsToShow
        .filter((author) => author.toLowerCase().includes(authorSearchQuery.toLowerCase()))
        .slice(0, 20); // Begrenze auf 20 für Performance
    }
    return authorsToShow.slice(0, 20); // Standard: Zeige erste 20
  }, [authorSearchQuery]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) => (prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]));
  };

  const handleReset = () => {
    setSelectedStatus(null);
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setPublicationYearFrom(1900);
    setPublicationYearTo(new Date().getFullYear());
    setPageCountFilter("");
    setMinRating(0);
    setShowAllGenres(false);
    setAuthorSearchQuery("");
    onFilterChange?.(null, null);
  };

  const handleSave = () => {
    const extendedFilters = {
      authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
      publicationYearFrom: publicationYearFrom,
      publicationYearTo: publicationYearTo,
      pageCountFilter: pageCountFilter || undefined,
      minRating: minRating > 0 ? minRating : undefined,
    };
    onFilterChange?.(selectedStatus, selectedGenres.length > 0 ? selectedGenres : null, extendedFilters);
    onClose();
  };

  return (
    <Sheet className="pb-safe w-screen max-h-[80vh] overflow-y-auto" opened={opened} onBackdropClick={onClose}>
      <Toolbar top>
        <div className="left">
          <Link toolbar onClick={handleReset} className="text-blue-500">
            Zurücksetzen
          </Link>
        </div>
        <div className="title font-semibold">Filter</div>
        <div className="right">
          <Link toolbar onClick={handleSave} className="text-blue-500">
            Fertig
          </Link>
        </div>
      </Toolbar>
      <Block>
        <List className="ios:mt-4">
          {/* Lesestatus */}
          <BlockTitle>Lesestatus</BlockTitle>
          <br></br>
          <ListInput
            outline
            type="select"
            dropdown
            value={selectedStatus || ""}
            placeholder="Bitte auswählen..."
            onChange={(e) => {
              const value = e.target.value as ReadingStatus | "";
              setSelectedStatus(value === "" ? null : value);
            }}
          >
            <option value="">Alle</option>
            {Object.values(ReadingStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </ListInput>

          {/* Genres */}
          <BlockTitle>Genres</BlockTitle>
          <Block>
            <FilterChips
              items={showAllGenres ? ALL_GENRES : COMMON_GENRES}
              selectedItems={selectedGenres}
              onToggleItem={toggleGenre}
              quickSelectCount={5}
              showAll={showAllGenres}
              onShowAllClick={() => setShowAllGenres(true)}
            />
          </Block>

          {/* Erweiterte Filter Toggle */}
          <List>
            <ListItem
              title="Erweiterte Filter"
              className="cursor-pointer border-t border-gray-200 dark:border-gray-700 pt-2"
              onClick={() => setShowExtendedFilters(!showExtendedFilters)}
              after={
                <svg
                  className={`w-5 h-5 transition-transform ${showExtendedFilters ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              }
            />
          </List>

          {/* Erweiterte Filter */}
          {showExtendedFilters && (
            <div>
              <List>
                {/* Autoren */}
                <BlockTitle>Autoren</BlockTitle>
                <br></br>
                <ListInput
                  outline
                  type="text"
                  placeholder="Autor suchen..."
                  value={authorSearchQuery}
                  onChange={(e) => setAuthorSearchQuery(e.target.value)}
                />
                <Block className="flex flex-wrap gap-2">
                  {filteredAuthors.length > 0 ? (
                    filteredAuthors.map((author) => (
                      <Chip
                        key={author}
                        outline
                        className={`cursor-pointer ${selectedAuthors.includes(author) ? "bg-blue-500 text-white" : ""}`}
                        onClick={() => toggleAuthor(author)}
                      >
                        {author}
                      </Chip>
                    ))
                  ) : (
                    <p className="text-gray-500">Keine Autoren gefunden</p>
                  )}
                </Block>

                {/* Veröffentlichungsjahr */}
                <BlockTitle>Veröffentlichungsjahr</BlockTitle>
                <Block className="px-4">
                  <label className="block text-sm text-gray-500">Von: {publicationYearFrom}</label>
                  <input
                    type="range"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={publicationYearFrom}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setPublicationYearFrom(val);
                      if (val > publicationYearTo) setPublicationYearTo(val);
                    }}
                    className="w-full custom-range"
                  />
                  <label className="block text-sm text-gray-500 mt-2">Bis: {publicationYearTo}</label>
                  <input
                    type="range"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={publicationYearTo}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setPublicationYearTo(val);
                      if (val < publicationYearFrom) setPublicationYearFrom(val);
                    }}
                    className="w-full custom-range"
                  />
                </Block>

                {/* Seitenzahl */}
                <BlockTitle>Seitenzahl</BlockTitle>
                <br></br>
                <ListInput
                  outline
                  type="select"
                  value={pageCountFilter}
                  onChange={(e) => setPageCountFilter(e.target.value)}
                >
                  <option value="">Alle</option>
                  <option value="short">Kurz (&lt;200)</option>
                  <option value="medium">Mittel (200-400)</option>
                  <option value="long">Lang (&gt;400)</option>
                </ListInput>
              </List>
            </div>
          )}
        </List>
      </Block>
    </Sheet>
  );
}
