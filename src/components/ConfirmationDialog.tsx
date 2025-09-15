import React from "react";
import { Dialog, DialogButton } from "konsta/react";

interface ConfirmationDialogProps {
  opened: boolean;
  title: string;
  content: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  opened,
  title,
  content,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  return (
    <Dialog
      opened={opened}
      onBackdropClick={onCancel}
      title={title}
      content={content}
      buttons={
        <>
          <DialogButton onClick={onCancel}>{cancelLabel}</DialogButton>
          <DialogButton
            onClick={onConfirm}
            colors={
              destructive
                ? {
                    textIos: "text-red-500",
                    textMaterial: "text-red-500",
                  }
                : undefined
            }
            strong
          >
            {confirmLabel}
          </DialogButton>
        </>
      }
    />
  );
};
