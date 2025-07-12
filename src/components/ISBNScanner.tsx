import React, { useRef, useCallback, useEffect } from "react";
import {
  BarcodeScanner,
  DetectedBarcode,
  useTorch,
} from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

interface ISBNScannerProps {
  onDetected: (isbn: string) => void;
  torch?: boolean;
}

const ISBNScanner: React.FC<ISBNScannerProps> = ({ onDetected, torch }) => {
  // Store the last scanned barcode to prevent duplicate calls
  const lastScannedBarcodeRef = useRef<string | null>(null);
  const { isTorchSupported, error, isTorchOn, setIsTorchOn } = useTorch(false);

  useEffect(() => {
    if (isTorchSupported) {
      setIsTorchOn(!!torch);
    }
  }, [torch, isTorchSupported, setIsTorchOn]);

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
