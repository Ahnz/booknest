import React, { useState } from "react";
import ISBNScanner from "./ISBNScanner";

// Props for ScannerModal component
interface ScannerModalProps {
  onClose: () => void;
}

// Modal for scanning ISBNs with multi-scan and list selection
const ScannerModal: React.FC<ScannerModalProps> = ({ onClose }) => {
  const [multiScan, setMultiScan] = useState(false);
  const [selectedList, setSelectedList] = useState<"read" | "wishlist">("read");

  // Log detected ISBN
  const handleDetected = (isbn: string) => {
    console.log("ScannerModal handleDetected called with ISBN:", isbn);
  };

  return (
    <div>
      {/* Multi-scan toggle */}
      <div>
        <input
          type="checkbox"
          checked={multiScan}
          onChange={(e) => setMultiScan(e.target.checked)}
        />
        <label>Multi-Scan</label>
      </div>
      {/* List selector */}
      <div>
        <select
          value={selectedList}
          onChange={(e) =>
            setSelectedList(e.target.value as "read" | "wishlist")
          }
        >
          <option value="read">Read</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </div>
      {/* ISBN scanner */}
      <ISBNScanner onDetected={handleDetected} />
      {/* Close button */}
      <div>
        <button onClick={onClose}>Done</button>
      </div>
    </div>
  );
};

export default ScannerModal;
