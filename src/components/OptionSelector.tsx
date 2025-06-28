import React from "react";

interface OptionSelectorProps {
  multiScan: boolean;
  setMultiScan: (v: boolean) => void;
  selectedList: "read" | "wishlist";
  setSelectedList: (v: "read" | "wishlist") => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  multiScan,
  setMultiScan,
  selectedList,
  setSelectedList,
}) => (
  <div>
    <button onClick={() => setSelectedList("read")} type="button">
      📖 Gelesen
    </button>
    <button onClick={() => setSelectedList("wishlist")} type="button">
      ⭐ Wunschliste
    </button>
    <label>
      <input
        type="checkbox"
        checked={multiScan}
        onChange={() => setMultiScan(!multiScan)}
      />
      Mehrere Bücher scannen
    </label>
  </div>
);

export default OptionSelector;
