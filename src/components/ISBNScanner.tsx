import React, { useRef, useCallback } from "react";
import {
  BarcodeScanner,
  DetectedBarcode,
  useTorch,
} from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

// Props for ISBNScanner component
interface ISBNScannerProps {
  onDetected: (isbn: string) => void;
}

// ISBN scanner with torch support
const ISBNScanner: React.FC<ISBNScannerProps> = ({ onDetected }) => {
  // Store the last scanned barcode to prevent duplicate calls
  const lastScannedBarcodeRef = useRef<string | null>(null);

  // Handle barcode detection
  const handleCapture = useCallback(
    (barcodes: DetectedBarcode[]) => {
      if (barcodes.length > 0) {
        const value = barcodes[0].rawValue;
        if (value && value !== lastScannedBarcodeRef.current) {
          lastScannedBarcodeRef.current = value;
          onDetected(value);
        }
      }
    },
    [onDetected]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Barcode scanner video feed */}
      <BarcodeScanner
        options={{
          formats: ["ean_13", "upc_a"], // Support ISBN-13 and ISBN-10
          delay: 950, // Scan interval
        }}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default ISBNScanner;
