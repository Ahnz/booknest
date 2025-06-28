import React, { useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    BarcodeDetector: any;
  }
}

interface ISBNScannerProps {
  isMultiScanning: boolean;
  onDetected: (isbn: string) => void;
  onClose: () => void;
}

const ISBNScanner: React.FC<ISBNScannerProps> = ({
  isMultiScanning,
  onDetected,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScannedISBNRef = useRef<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const activeRef = useRef(true);

  useEffect(() => {
    let detector: any;
    activeRef.current = true;

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const scanLoop = async () => {
      if (!activeRef.current || !isScanning || !videoRef.current || !detector)
        return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (
          barcodes.length &&
          barcodes[0].rawValue !== lastScannedISBNRef.current
        ) {
          const isbn: string = barcodes[0].rawValue;
          lastScannedISBNRef.current = isbn;
          await onDetected(isbn);

          if (!isMultiScanning) {
            setIsScanning(false);
            activeRef.current = false;
            stopCamera();
            onClose();
          } else {
            setTimeout(() => {
              lastScannedISBNRef.current = null;
            }, 1200);
          }
        }
        if (activeRef.current && isScanning) {
          requestAnimationFrame(scanLoop);
        }
      } catch (err) {
        if (activeRef.current && isScanning) {
          requestAnimationFrame(scanLoop);
        }
      }
    };

    const initScanner = async () => {
      try {
        detector = new window.BarcodeDetector({ formats: ["ean_13"] });
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.oncanplay = () => {
            scanLoop();
          };
        }
      } catch (err) {
        alert("Kamera konnte nicht gestartet werden!");
        activeRef.current = false;
      }
    };

    initScanner();

    return () => {
      activeRef.current = false;
      setIsScanning(false);
      stopCamera();
    };
  }, [isMultiScanning, onDetected, onClose]);

  const handleClose = () => {
    setIsScanning(false);
    activeRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    onClose();
  };

  return (
    <div>
      <video ref={videoRef} muted playsInline autoPlay />
      <button onClick={handleClose} type="button">
        ✕
      </button>
    </div>
  );
};

export default ISBNScanner;
