import { ListInput, Sheet, Block, Button } from "konsta/react";
import { ReadingStatus } from "../types/Book"; // Pfad zu deinem Book.ts anpassen
import { List } from "konsta/react";
import { Toolbar } from "konsta/react";
import { Link } from "konsta/react";

export interface FilterSheetProps {
  opened: boolean;
  onClose: () => void;
  onFilterChange?: (status: ReadingStatus | null) => void;
}

export default function FilterSheet({ opened, onClose, onFilterChange }: FilterSheetProps) {
  return (
    <Sheet className="pb-safe w-screen" opened={opened} onBackdropClick={onClose}>
      <Toolbar top>
        <div className="left">
          <Link toolbar onClick={onClose}>
            Zurücksetzen
          </Link>
        </div>
        <div className="title">Filter</div>
        <div className="right">
          <Link toolbar onClick={onClose}>
            Speichern
          </Link>
        </div>
      </Toolbar>
      <List className="ios:mt-4">
        <ListInput
          outline
          label="Lesestatus"
          type="select"
          dropdown
          defaultValue=""
          placeholder="Bitte auswählen..."
          onChange={(e) => {
            const value = e.target.value as ReadingStatus | "";
            onFilterChange?.(value === "" ? null : value);
          }}
        >
          <option value="">Alle</option>
          {Object.values(ReadingStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </ListInput>
      </List>
    </Sheet>
  );
}
