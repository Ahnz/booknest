import React from "react";
import { ListInput, ListItem } from "konsta/react";
import { Book } from "../types/Book";

// Typ für Update-Funktion
export type UpdateForm = <K extends keyof Book>(field: K, value: Book[K]) => void;

interface EditableFieldProps {
  title: string;
  value: string | number | undefined;
  field: keyof Book;
  type?: string;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  title,
  value,
  field,
  type = "text",
  editMode,
  onUpdate,
}) =>
  editMode ? (
    <ListInput
      label={title}
      type={type}
      value={value ?? ""}
      onChange={(e) => onUpdate(field, type === "number" ? Number(e.target.value) : e.target.value)}
      {...(type === "number" ? { min: "0" } : {})}
    />
  ) : (
    <ListItem title={title} after={value ?? "Unknown"} />
  );
