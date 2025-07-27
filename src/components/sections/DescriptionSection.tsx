import React from "react";
import { Block, BlockTitle, ListInput } from "konsta/react";
import { Book } from "../../types/Book";
import { UpdateForm } from "../EditableFormField";
import { MdEdit } from "react-icons/md";
import { List } from "konsta/react";
interface DescriptionSectionProps {
  book: Book;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ book, editMode, onUpdate }) => (
  <>
    <BlockTitle>Description</BlockTitle>
    <Block strongIos outlineIos>
      {editMode ? (
        <>
          <ListInput
            type="textarea"
            media={MdEdit}
            value={book.description ?? ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="Description"
            inputClassName="!h-20 resize-none"
          />
        </>
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">{book.description ?? "No description available."}</p>
      )}
    </Block>
  </>
);
