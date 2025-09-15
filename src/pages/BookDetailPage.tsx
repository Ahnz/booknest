import React, { useState, useEffect } from "react";
import { Page, Navbar, NavbarBackLink, Block, Link } from "konsta/react";
import { Book } from "../types/Book";
import { BookHeader } from "../components/sections/BookHeaderSection";
import { CategoriesSection } from "../components/sections/CategoriesSection";
import { UserInfoSection } from "../components/sections/UserInfoSection";
import { DescriptionSection } from "../components/sections/DescriptionSection";
import { DetailsSection } from "../components/sections/DetailsSection";
import { ConfirmationDialog as DeleteBookDialog } from "@/components/ConfirmationDialog";

// Typendefinition für Props
interface BookDetailDialogProps {
  book: Book;
  onClose: () => void;
  onSave: (updated: Book) => void;
  onDelete: (bookToDelete: Book) => void;
}

export const BookDetailPage: React.FC<BookDetailDialogProps> = ({ book, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<Book>(book);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Synchronisiere Formular mit neuem Buch
  useEffect(() => {
    setForm(book);
    setEditMode(false);
  }, [book]);

  const updateForm = <K extends keyof Book>(field: K, value: Book[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleDelete = () => {
    onDelete(book);
    setShowDeleteConfirm(false);
  };

  return (
    <Page className="fixed inset-0 z-50 overflow-auto">
      {/* Navigation */}
      <Navbar
        transparent
        left={<NavbarBackLink navbar onClick={onClose} />}
        right={
          editMode ? (
            <div className="flex gap-2">
              <Link
                navbar
                onClick={() => {
                  setEditMode(false);
                  setForm(book);
                }}
                aria-label="Cancel editing"
                title="Cancel"
              >
                Cancel
              </Link>
              <Link
                navbar
                onClick={() => {
                  setEditMode(false);
                  onSave(form);
                }}
                aria-label="Save changes"
                title="Save"
              >
                Save
              </Link>
            </div>
          ) : (
            <Link navbar onClick={() => setEditMode(true)} aria-label="Edit book details" title="Edit book details">
              Edit
            </Link>
          )
        }
        title={editMode ? "Edit Book" : undefined}
      />

      {/* Buch-Informationen */}
      <BookHeader book={form} editMode={editMode} onUpdate={updateForm} />

      {/* Kategorien */}
      <CategoriesSection book={form} editMode={editMode} onUpdate={updateForm} />

      {/* Benutzerinformationen */}
      <UserInfoSection book={form} editMode={editMode} onUpdate={updateForm} />

      {/* Beschreibung */}
      <DescriptionSection book={form} editMode={editMode} onUpdate={updateForm} />

      {/* Details */}
      <DetailsSection book={form} editMode={editMode} onUpdate={updateForm} />

      {!editMode ? (
        form.previewLink && (
          <Block className="text-center mt-4">
            <Link href={form.previewLink} external target="_blank">
              Preview this book
            </Link>
          </Block>
        )
      ) : (
        <Block className="text-center mt-4">
          <Link onClick={() => setShowDeleteConfirm(true)}>Delete Book</Link>
        </Block>
      )}

      {showDeleteConfirm && (
        <DeleteBookDialog
          opened={showDeleteConfirm}
          title={`Delete "${book.title}"?`}
          content="This book will be permanently removed from your collection."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          destructive={true}
        />
      )}
    </Page>
  );
};

export default BookDetailPage;
