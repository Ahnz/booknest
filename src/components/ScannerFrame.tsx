import React from "react";

interface ScannerFrameProps {
  width?: number | string;
  height?: number | string;
  edgeLength?: number;
  edgeThickness?: number;
  edgeColor?: string;
  borderRadius?: number | string;
  className?: string;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({
  width = 320,
  height = 200,
  edgeLength = 32,
  edgeThickness = 4,
  edgeColor = "#FFF",
  borderRadius = 18,
  className = "",
}) => {
  // Ensure px values for inline styles
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;
  const edge = typeof edgeLength === "number" ? `${edgeLength}px` : edgeLength;
  const thickness = typeof edgeThickness === "number" ? `${edgeThickness}px` : edgeThickness;
  const radius = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={`relative flex items-center justify-center mx-auto ${className}`}
      style={{ width: w, height: h, borderRadius: radius }}
    >
      {/* Four corner edges */}
      {/* Top left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: edge,
          height: edge,
          borderTop: `${thickness} solid ${edgeColor}`,
          borderLeft: `${thickness} solid ${edgeColor}`,
          borderTopLeftRadius: radius,
        }}
      />
      {/* Top right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: edge,
          height: edge,
          borderTop: `${thickness} solid ${edgeColor}`,
          borderRight: `${thickness} solid ${edgeColor}`,
          borderTopRightRadius: radius,
        }}
      />
      {/* Bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: edge,
          height: edge,
          borderBottom: `${thickness} solid ${edgeColor}`,
          borderLeft: `${thickness} solid ${edgeColor}`,
          borderBottomLeftRadius: radius,
        }}
      />
      {/* Bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: edge,
          height: edge,
          borderBottom: `${thickness} solid ${edgeColor}`,
          borderRight: `${thickness} solid ${edgeColor}`,
          borderBottomRightRadius: radius,
        }}
      />

      {/* Transparent area (center) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radius,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)", // big shadow creates the outer mask
        }}
      />
    </div>
  );
};
