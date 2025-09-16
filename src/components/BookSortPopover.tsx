// components/BookSortPopover.tsx
import React from "react";
import { Popover, List, ListItem } from "konsta/react";
import { SortOption, SortDirection } from "../hooks/useBookSort";

interface BookSortPopoverProps {
  isOpen: boolean;
  target: HTMLElement | null;
  sortOption: SortOption;
  sortDirection: SortDirection;
  onClose: () => void;
  onSortChange: (option: SortOption) => void;
}

const SORT_OPTIONS = [
  { key: "title" as const, label: "Titel" },
  { key: "author" as const, label: "Autor" },
  { key: "dateAdded" as const, label: "Hinzugefügt" },
] as const;

export default function BookSortPopover({
  isOpen,
  target,
  sortOption,
  sortDirection,
  onClose,
  onSortChange,
}: BookSortPopoverProps) {
  const handleSortSelection = (option: SortOption) => {
    onSortChange(option);
    onClose();
  };

  const getSortIndicator = (option: SortOption) => {
    if (option === sortOption) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <Popover opened={isOpen} target={target} onBackdropClick={onClose}>
      <List nested>
        {SORT_OPTIONS.map(({ key, label }) => (
          <ListItem
            key={key}
            title={`${label}${getSortIndicator(key)}`}
            link
            chevron={false}
            chevronIos={false}
            chevronMaterial={false}
            onClick={() => handleSortSelection(key)}
          />
        ))}
      </List>
    </Popover>
  );
}
