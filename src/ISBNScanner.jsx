import React, { useRef, useEffect } from 'react'

export default function ISBNScanner({ onDetected, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    let active = true
    const detector = new BarcodeDetector({ formats: ['ean_13'] })

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        videoRef.current.srcObject = stream
        // no need for videoRef.current.play() if autoPlay + muted + playsInline
        scanLoop()
      })
      .catch(err => console.error('Camera error:', err))

    const scanLoop = async () => {
      if (!active) return
      try {
        const barcodes = await detector.detect(videoRef.current)
        if (barcodes.length) {
          active = false
          onDetected(barcodes[0].rawValue)
        }
      } catch {}
      if (active) requestAnimationFrame(scanLoop)
    }

    return () => {
      active = false
      videoRef.current?.srcObject
        ?.getTracks()
        .forEach(t => t.stop())
    }
  }, [onDetected])

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
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow"
      >
        ✕
      </button>
    </div>
  )
}
