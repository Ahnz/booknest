import React, { useRef, useState, useEffect } from 'react';

export default function ISBNScanner({
  isMultiScanning,
  onDetected,
  setMyBooks,
  setError,
  bookExistsInIndexedDB,
  addBookToIndexedDB,
  getBooksFromIndexedDB,
  setGlow,
  setBannerMessage,
  setBannerType,
  onClose,
}) {
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
        if ('BarcodeDetector' in window) {
          detector = new BarcodeDetector({ formats: ['ean_13'] });
          console.log('Native BarcodeDetector initialized');
        } else {
          console.log('Falling back to BarcodeDetector polyfill');
          const { BarcodeDetector } = await import('@undecaf/barcode-detector-polyfill');
          detector = new BarcodeDetector({ formats: ['ean_13'] });
          console.log('BarcodeDetector polyfill initialized');
        }
      } catch (err) {
        setError('BarcodeDetector not supported or failed to initialize.');
        console.error('BarcodeDetector init error:', err);
        active = false;
      }
    };

    // Start camera
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          videoRef.current.oncanplay = () => {
            console.log('Video stream ready');
            scanLoop();
          };
        } else {
          setError('Video element not available.');
          console.error('Video ref not set');
          active = false;
        }
      } catch (err) {
        setError('Failed to access camera. Please ensure camera permissions are granted.');
        console.error('Camera error:', err);
        active = false;
      }
    };

    // Scan loop
    const scanLoop = async () => {
      if (!active || !isScanning || !videoRef.current || !detector) {
        console.log('Scan loop stopped:', {
          active,
          isScanning,
          videoRef: !!videoRef.current,
          detector: !!detector,
        });
        return;
      }
      try {
        const barcodes = await detector.detect(videoRef.current);
        console.log('Barcode detection attempted:', { barcodeCount: barcodes.length });
        if (barcodes.length && barcodes[0].rawValue !== lastScannedISBN) {
          const isbn = barcodes[0].rawValue;
          console.log('Barcode detected:', isbn);
          lastScannedISBN = isbn; // Prevent immediate re-scanning
          await handleScan(isbn);
          if (!isMultiScanning) {
            // Single scan: Stop immediately
            console.log('Single scan completed, stopping');
            setIsScanning(false);
            active = false;
            stopCamera();
            onClose();
          } else {
            // Multi scan: Allow re-scanning after 1s
            setTimeout(() => {
              lastScannedISBN = null;
              console.log('Reset lastScannedISBN for multi-scan');
            }, 1000);
          }
        }
        // Continue scanning: Multi-scan uses requestAnimationFrame, Single-scan uses setInterval
        if (isMultiScanning && active && isScanning) {
          requestAnimationFrame(scanLoop);
        } else if (!isMultiScanning && active && isScanning) {
          setTimeout(scanLoop, 100); // Poll every 100ms for single scan
        }
      } catch (err) {
        console.error('Barcode detection error:', err);
        if (isMultiScanning && active && isScanning) {
          requestAnimationFrame(scanLoop);
        } else if (!isMultiScanning && active && isScanning) {
          setTimeout(scanLoop, 100);
        }
      }
    };

    // Handle ISBN scan
    const handleScan = async (isbn) => {
      console.log('Handling scan for ISBN:', isbn);
      if (await bookExistsInIndexedDB(isbn)) {
        if (isMultiScanning) {
          setBannerMessage('Book already in library');
          setBannerType('error');
          setTimeout(() => setBannerMessage(null), 3000);
        } else {
          setError('This book is already in your list.');
        }
        console.log('Duplicate ISBN detected:', isbn);
        return;
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API response:', data);
        if (data.totalItems === 0) {
          if (isMultiScanning) {
            setBannerMessage('No book found for ISBN');
            setBannerType('error');
            setTimeout(() => setBannerMessage(null), 3000);
          } else {
            setError('No book found for this ISBN.');
          }
          console.log('No book found for ISBN:', isbn);
          return;
        }
        const book = data.items[0];
        const publishedYear = book.volumeInfo.publishedDate?.split('-')[0] || 'Unknown';
        const categories = book.volumeInfo.categories?.join(', ') || '';
        const bookToSave = {
          title: book.volumeInfo.title || 'Unknown Title',
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          isbn13: isbn,
          published_year: publishedYear,
          reading_status: 2, // Default to "Read"
          cover_url: book.volumeInfo.imageLinks?.thumbnail || `https://buch.isbn.de/cover/${isbn}.webp`,
          date_added: new Date().toISOString().split('T')[0],
          description: (book.volumeInfo.description || book.searchInfo?.textSnippet || 'No description available.').slice(0, 150),
          categories,
        };
        if (isMultiScanning) {
          console.log('Saving book:', bookToSave);
          await addBookToIndexedDB(bookToSave);
          // Optimistic update: Add book to state immediately
          setMyBooks(prevBooks => [...prevBooks, bookToSave]);
          // Sync with IndexedDB to ensure consistency
          const updatedBooks = await getBooksFromIndexedDB();
          setMyBooks(updatedBooks);
          setBannerMessage(`Added: ${bookToSave.title}`);
          setBannerType('success');
          setGlow(true); // Trigger glow animation
          setTimeout(() => setBannerMessage(null), 3000);
          setTimeout(() => setGlow(false), 2000); // Glow for 2s
          console.log('Book added successfully:', bookToSave.title);
        } else {
          console.log('Triggering onDetected for ISBN:', isbn);
          onDetected(isbn); // Trigger parent to handle book details
        }
      } catch (err) {
        let errorMessage = 'Failed to fetch book details';
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out';
        } else if (err.message.includes('HTTP error')) {
          errorMessage = err.message;
        }
        if (isMultiScanning) {
          setBannerMessage(errorMessage);
          setBannerType('error');
          setTimeout(() => setBannerMessage(null), 3000);
        } else {
          setError(errorMessage);
        }
        console.error('Error fetching book details:', err);
      }
    };

    // Stop camera stream
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        console.log('Camera stopped');
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
  }, [
    isMultiScanning,
    onDetected,
    setMyBooks,
    setError,
    bookExistsInIndexedDB,
    addBookToIndexedDB,
    getBooksFromIndexedDB,
    setGlow,
    setBannerMessage,
    setBannerType,
  ]);

  // Handle manual close
  const handleClose = () => {
    setIsScanning(false);
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="relative w-80 h-80">
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
    </div>
  );
}