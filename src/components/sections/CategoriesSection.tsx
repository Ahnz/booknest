import React from "react";
import { Block, BlockTitle, Chip } from "konsta/react";
import ChipsInput from "../ChipsInput";
import { Book } from "../../types/Book";
import { UpdateForm } from "../EditableFormField";

interface CategoriesSectionProps {
  book: Book;
  editMode: boolean;
  onUpdate: UpdateForm;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ book, editMode, onUpdate }) => (
  <>
    <BlockTitle>Categories</BlockTitle>
    {editMode ? (
      <Block strongIos outlineIos>
        <ChipsInput
          value={book.categories ?? []}
          onChange={(newCats) => onUpdate("categories", newCats)}
          placeholder="Add category…"
        />
      </Block>
    ) : (
      <Block strongIos outlineIos className="flex flex-wrap gap-1 min-h-[2.5rem] items-center">
        {book.categories?.length ? (
          book.categories.map((category) => (
            <Chip key={category} outline className="m-0.5">
              {category}
            </Chip>
          ))
        ) : (
          <Chip outline className="m-0.5 opacity-60">
            No Category
          </Chip>
        )}
      </Block>
    )}
  </>
);
