import React, { useState } from "react";
import {
  Page,
  Navbar,
  Block,
  Link,
  Chip,
  BlockTitle,
  List,
  ListItem,
  ListInput,
  Button,
} from "konsta/react";
import { MdEdit } from "react-icons/md";
import { Book, ReadingStatus } from "../types/Book";
import { NavbarBackLink } from "konsta/react";
import ChipsInput from "@/components/ChipsInput";

interface BookDetailDialogProps {
  book: Book | null;
  onClose: () => void;
  onSave?: (updated: Book) => void;
}

const statusLabels: Record<ReadingStatus, string> = {
  [ReadingStatus.Unread]: "Unread",
  [ReadingStatus.Reading]: "Reading",
  [ReadingStatus.Finished]: "Finished",
  [ReadingStatus.Abandoned]: "Abandoned",
  [ReadingStatus.Wishlist]: "Wishlist",
};

const BookDetailPage: React.FC<BookDetailDialogProps> = ({
  book,
  onClose,
  onSave,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Book | null>(book);

  // Update local form if a new book is shown
  React.useEffect(() => {
    setForm(book);
    setEditMode(false);
  }, [book]);

  if (!book || !form) return null;

  // Helper to update form fields
  const updateForm = (key: keyof Book, value: any) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <Page className="fixed inset-0 z-50 overflow-auto">
      <Navbar
        transparent
        left={<NavbarBackLink navbar onClick={onClose}></NavbarBackLink>}
        title={editMode ? "Edit Book" : undefined}
      />

      <Block className="flex flex-col items-center">
        {form.coverUrl && (
          <img
            src={form.coverUrl}
            alt={form.title}
            className="rounded-lg shadow-lg w-48 h-auto mb-4"
          />
        )}

        <>
          <h1 className="text-xl font-bold text-center mb-1">{form.title}</h1>
          {form.subtitle && (
            <h2 className="text-lg text-gray-500 text-center mb-1">
              {form.subtitle}
            </h2>
          )}
          <p className="text-md text-gray-600 mb-2">
            by {form.authors.join(", ")}
          </p>
          {form.readingStatus && (
            <Chip outline className="mb-2">
              {statusLabels[form.readingStatus]}
            </Chip>
          )}
        </>
      </Block>
      <BlockTitle>Categories</BlockTitle>
      {editMode ? (
        <Block strongIos outlineIos>
          <ChipsInput
            value={form.categories || []}
            onChange={(newCats) => updateForm("categories", newCats)}
            placeholder="Add category…"
          />
        </Block>
      ) : (
        <Block
          strongIos
          outlineIos
          className="flex flex-wrap gap-1 min-h-[2.5rem] items-center"
        >
          {form.categories && form.categories.length > 0 ? (
            form.categories.map((category) => (
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

      <BlockTitle>User Information</BlockTitle>
      {editMode ? (
        <List strongIos outlineIos>
          <ListInput
            label="Date Added"
            type="date"
            value={form.dateAdded || ""}
            onChange={(e) => updateForm("dateAdded", e.target.value)}
          />
          <ListInput
            label="Date Started"
            type="date"
            value={form.dateStarted || ""}
            onChange={(e) => updateForm("dateStarted", e.target.value)}
          />
          <ListInput
            label="Date Finished"
            type="date"
            value={form.dateFinished || ""}
            onChange={(e) => updateForm("dateFinished", e.target.value)}
          />
          <ListInput
            label="Shelves"
            type="text"
            value={form.customShelves?.join(", ") || ""}
            onChange={(e) =>
              updateForm(
                "customShelves",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </List>
      ) : (
        <List strongIos outlineIos>
          <ListItem title="Date Added" after={form.dateAdded || "-"} />
          <ListItem title="Date Started" after={form.dateStarted || "-"} />
          <ListItem title="Date Finished" after={form.dateFinished || "-"} />
          {form.customShelves && form.customShelves.length > 0 && (
            <ListItem title="Shelves" after={form.customShelves.join(", ")} />
          )}
        </List>
      )}

      <BlockTitle>Description</BlockTitle>
      <Block strongIos outlineIos>
        {editMode ? (
          <ListInput
            type="textarea"
            value={form.description || ""}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Description"
            inputClassName="!h-20 resize-none"
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-700">
            {form.description || "No description available."}
          </p>
        )}
      </Block>

      <BlockTitle>Details</BlockTitle>
      {editMode ? (
        <List strongIos outlineIos>
          <ListInput
            label="Publisher"
            type="text"
            value={form.publisher || ""}
            onChange={(e) => updateForm("publisher", e.target.value)}
          />
          <ListInput
            label="Published Date"
            type="text"
            value={form.publishedDate || ""}
            onChange={(e) => updateForm("publishedDate", e.target.value)}
          />
          <ListInput
            label="Page Count"
            type="number"
            value={form.pageCount || ""}
            onChange={(e) =>
              updateForm("pageCount", Number(e.target.value) || undefined)
            }
          />
          <ListInput
            label="ISBN-13"
            type="text"
            value={form.isbn13}
            onChange={(e) => updateForm("isbn13", e.target.value)}
          />
          <ListInput
            label="ISBN-10"
            type="text"
            value={form.isbn10 || ""}
            onChange={(e) => updateForm("isbn10", e.target.value)}
          />
        </List>
      ) : (
        <List strongIos outlineIos>
          <ListItem title="Publisher" after={form.publisher || "Unknown"} />
          <ListItem
            title="Published Date"
            after={form.publishedDate || "Unknown"}
          />
          <ListItem
            title="Page Count"
            after={form.pageCount ? `${form.pageCount}` : "Unknown"}
          />
          <ListItem title="ISBN-13" after={form.isbn13} />
          {form.isbn10 && <ListItem title="ISBN-10" after={form.isbn10} />}
        </List>
      )}

      {form.previewLink && !editMode && (
        <Block className="text-center mt-4">
          <Link href={form.previewLink} external target="_blank">
            Preview this book
          </Link>
        </Block>
      )}

      {/* Edit Mode Action Buttons */}
      {editMode && (
        <Block className="flex gap-4 mt-4 justify-center">
          <Button
            tonal
            onClick={() => {
              setEditMode(false);
              setForm(book); // Reset changes
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setEditMode(false);
              if (onSave) onSave(form);
            }}
          >
            Save
          </Button>
        </Block>
      )}

      {/* Floating Pencil Icon */}
      {!editMode && (
        <button
          className="fixed bottom-8 right-6 z-50 p-3 bg-primary rounded-full shadow-lg text-white"
          onClick={() => setEditMode(true)}
          aria-label="Edit"
          type="button"
        >
          <MdEdit size={28} />
        </button>
      )}
    </Page>
  );
};

export default BookDetailPage;
