import React, { useRef, useEffect } from 'react';

export default function ISBNScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  let stream = null;

  useEffect(() => {
    let active = true;
    const detector = new BarcodeDetector({ formats: ['ean_13'] });

    // Start camera
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(mediaStream => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          scanLoop();
        }
      })
      .catch(err => console.error('Camera error:', err));

    // Scan loop
    const scanLoop = async () => {
      if (!active || !videoRef.current) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length) {
          active = false;
          onDetected(barcodes[0].rawValue);
          stopCamera();
          onClose(); // Close overlay after scan
        } else {
          requestAnimationFrame(scanLoop);
        }
      } catch {
        requestAnimationFrame(scanLoop);
      }
    };

    // Stop camera stream
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    };

    // Cleanup on unmount
    return () => {
      active = false;
      stopCamera();
    };
  }, [onDetected, onClose]);

  // Handle manual close
  const handleClose = () => {
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="w-80 h-80 object-cover rounded-lg shadow-lg"
      />
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow"
      >
        ✕
      </button>
    </div>
  );
}