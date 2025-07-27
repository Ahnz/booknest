import React from "react";
import { List, ListInput, ListItem, BlockTitle } from "konsta/react";
import { Book } from "../../types/Book";
import { UpdateForm, EditableField } from "../EditableFormField";

interface UserInfoSectionProps {
  book: Book;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ book, editMode, onUpdate }) => (
  <>
    <BlockTitle>User Information</BlockTitle>
    <List strongIos outlineIos>
      <EditableField
        title="Date Added"
        value={book.dateAdded}
        field="dateAdded"
        type="date"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      <EditableField
        title="Date Started"
        value={book.dateStarted}
        field="dateStarted"
        type="date"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      <EditableField
        title="Date Finished"
        value={book.dateFinished}
        field="dateFinished"
        type="date"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      {editMode ? (
        <ListInput
          label="Shelves"
          type="text"
          value={book.customShelves?.join(", ") ?? ""}
          onChange={(e) =>
            onUpdate(
              "customShelves",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      ) : (
        <ListItem title="Shelves" after={book.customShelves?.join(", ") ?? "-"} />
      )}
    </List>
  </>
);
