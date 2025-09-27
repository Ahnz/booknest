import React from "react";
import { Chip } from "konsta/react";

export interface FilterChipsProps<T> {
  items: T[];
  selectedItems: T[];
  onToggleItem: (item: T) => void;
  quickSelectCount?: number;
  showAll?: boolean;
  onShowAllClick?: () => void;
  renderItem?: (item: T) => string; // Optional: Umwandlung in String für Anzeige
}

export default function FilterChips<T>({
  items,
  selectedItems,
  onToggleItem,
  quickSelectCount = 5,
  showAll = false,
  onShowAllClick,
  renderItem = (item) => String(item),
}: FilterChipsProps<T>) {
  const quickItems = items.slice(0, quickSelectCount);
  const allItems = showAll ? items : quickItems;

  return (
    <>
      <div>
        {allItems.map((item) => (
          <Chip
            key={JSON.stringify(item)}
            outline={!selectedItems.includes(item)}
            className="m-0.5"
            onClick={() => onToggleItem(item)}
            colors={{
              fillBg: selectedItems.includes(item) ? "bg-blue-500" : "",
              fillText: selectedItems.includes(item) ? "text-white" : "",
              outlineBorder: selectedItems.includes(item) ? "border-blue-500" : "border-gray-300",
            }}
          >
            {renderItem(item)}
          </Chip>
        ))}
      </div>

      {!showAll && items.length > quickSelectCount && (
        <div className="mt-2">
          <button onClick={onShowAllClick} className="text-blue-500 underline text-sm">
            See all
          </button>
        </div>
      )}
    </>
  );
}
