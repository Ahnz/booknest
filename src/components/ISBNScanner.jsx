import React, { useRef, useState, useEffect } from "react";

export default function ISBNScanner({ onDetected, onClose, setError }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  let stream = null;
  let lastScannedISBN = null;

  useEffect(() => {
    let detector;
    let active = true;

    // Initialize BarcodeDetector
    const initDetector = async () => {
      try {
        if ("BarcodeDetector" in window) {
          detector = new BarcodeDetector({ formats: ["ean_13"] });
          console.log("Native BarcodeDetector initialized");
        } else {
          console.log("Falling back to BarcodeDetector polyfill");
          const { BarcodeDetector } = await import("@undecaf/barcode-detector-polyfill");
          detector = new BarcodeDetector({ formats: ["ean_13"] });
          console.log("BarcodeDetector polyfill initialized");
        }
      } catch (err) {
        setError("BarcodeDetector not supported or failed to initialize.");
        console.error("BarcodeDetector init error:", err);
        active = false;
      }
    };

    // Start camera
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.oncanplay = () => {
            console.log("Video stream ready");
            scanLoop();
          };
        } else {
          setError("Video element not available.");
          console.error("Video ref not set");
          active = false;
        }
      } catch (err) {
        setError("Failed to access camera. Please ensure camera permissions are granted.");
        console.error("Camera error:", err);
        active = false;
      }
    };

    // Scan loop
    const scanLoop = async () => {
      if (!active || !isScanning || !videoRef.current || !detector) {
        console.log("Scan loop stopped:", {
          active,
          isScanning,
          videoRef: !!videoRef.current,
          detector: !!detector,
        });
        return;
      }
      try {
        const barcodes = await detector.detect(videoRef.current);
        console.log("Barcode detection attempted:", { barcodeCount: barcodes.length });
        if (barcodes.length && barcodes[0].rawValue !== lastScannedISBN) {
          const isbn = barcodes[0].rawValue;
          console.log("Barcode detected:", isbn);
          lastScannedISBN = isbn;
          await handleScan(isbn);
          setIsScanning(false);
          active = false;
          stopCamera();
          onClose();
        }
        if (active && isScanning) {
          setTimeout(scanLoop, 100); // Poll every 100ms
        }
      } catch (err) {
        console.error("Barcode detection error:", err);
        if (active && isScanning) {
          setTimeout(scanLoop, 100);
        }
      }
    };

    // Handle ISBN scan
    const handleScan = async (isbn) => {
      console.log("Handling scan for ISBN:", isbn);
      onDetected(isbn); // Pass ISBN to parent
    };

    // Stop camera stream
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
        console.log("Camera stopped");
      }
    };

    // Initialize and start
    const init = async () => {
      await initDetector();
      if (active) {
        await startCamera();
      }
    };
    init();

    // Cleanup on unmount
    return () => {
      active = false;
      setIsScanning(false);
      stopCamera();
    };
  }, [onDetected, onClose, setError]);

  // Handle manual close
  const handleClose = () => {
    setIsScanning(false);
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="relative w-80 h-80">
        <video ref={videoRef} muted playsInline autoPlay className="w-80 h-80 object-cover rounded-lg shadow-lg" />
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow">
          ✕
        </button>
      </div>
    </div>
  );
}
