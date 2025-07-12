import { useState } from "react";
import { Page } from "konsta/react";
import ScannerPage from "./ScannerPage";
import SearchPage from "./SearchPage";

type ModalMode = "scanner" | "search";

interface ModalPageProps {
  onClose: () => void;
}

export default function ModalPage({ onClose }: ModalPageProps) {
  const [mode, setMode] = useState<ModalMode>("scanner");

  return (
    <div className="fixed inset-0 z-[9999]">
      {mode === "scanner" && (
        <ScannerPage onClose={onClose} onGoToSearch={() => setMode("search")} />
      )}
      {mode === "search" && <SearchPage onClose={onClose} />}
    </div>
  );
}
