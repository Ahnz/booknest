import React from "react";
import { List, BlockTitle } from "konsta/react";
import { Book } from "../../types/Book";
import { UpdateForm, EditableField } from "../EditableFormField";

interface DetailsSectionProps {
  book: Book;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({ book, editMode, onUpdate }) => (
  <>
    <BlockTitle>Details</BlockTitle>
    <List strongIos outlineIos>
      <EditableField
        title="Publisher"
        value={book.publisher}
        field="publisher"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      <EditableField
        title="Published Date"
        value={book.publishedDate}
        field="publishedDate"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      <EditableField
        title="Page Count"
        value={book.pageCount}
        field="pageCount"
        type="number"
        editMode={editMode}
        onUpdate={onUpdate}
      />
      <EditableField title="ISBN-13" value={book.isbn13} field="isbn13" editMode={editMode} onUpdate={onUpdate} />
      {book.isbn10 && (
        <EditableField title="ISBN-10" value={book.isbn10} field="isbn10" editMode={editMode} onUpdate={onUpdate} />
      )}
    </List>
  </>
);
