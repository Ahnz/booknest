import React from "react";
import { BarcodeScanner, DetectedBarcode, useTorch } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

// Props for ISBNScanner component
interface ISBNScannerProps {
  onDetected: (isbn: string) => void;
}

// ISBN scanner with torch support
const ISBNScanner: React.FC<ISBNScannerProps> = ({ onDetected }) => {
  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();

  // Handle barcode detection
  const handleCapture = (barcodes: DetectedBarcode[]) => {
    if (barcodes.length > 0) {
      onDetected(barcodes[0].rawValue);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Barcode scanner video feed */}
      <BarcodeScanner
        options={{
          formats: ["ean_13", "upc_a"], // Support ISBN-13 and ISBN-10
          delay: 550, // Scan interval
        }}
        onCapture={handleCapture}
      />
      {/* Torch toggle button */}
      {isTorchSupported && (
        <button onClick={() => setIsTorchOn(!isTorchOn)}>{isTorchOn ? "Torch Off" : "Torch On"}</button>
      )}
    </div>
  );
};

export default ISBNScanner;
