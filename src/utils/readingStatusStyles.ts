import { ReadingStatus } from "../types/Book";

// Zuordnung von ReadingStatus zu Farben und Badge-Texten
export const readingStatusStyles: Record<ReadingStatus, { badgeText: string; badgeColor: string; fillText: string }> = {
  [ReadingStatus.Unread]: { badgeText: "U", badgeColor: "bg-amber-400", fillText: "text-white" },
  [ReadingStatus.Reading]: { badgeText: "L", badgeColor: "bg-teal-500", fillText: "text-white" },
  [ReadingStatus.Finished]: { badgeText: "F", badgeColor: "bg-indigo-500", fillText: "text-white" },
  [ReadingStatus.Abandoned]: { badgeText: "A", badgeColor: "bg-rose-400", fillText: "text-white" },
  [ReadingStatus.Wishlist]: { badgeText: "W", badgeColor: "bg-purple-400", fillText: "text-white" },
};

// Hilfsfunktion, um Stil für einen Status zu erhalten
export const getReadingStatusStyle = (
  status: ReadingStatus | undefined
): { badgeText: string; badgeColor: string; fillText: string } => {
  if (!status || !(status in readingStatusStyles)) {
    console.warn(`No style defined for ReadingStatus: ${status}`);
    return { badgeText: "", badgeColor: "", fillText: "" };
  }
  return readingStatusStyles[status];
};
