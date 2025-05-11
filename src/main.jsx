import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "konsta/react";
import AppComponent from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { BarcodeDetectorPolyfill } from "@undecaf/barcode-detector-polyfill";

try {
  window.BarcodeDetector.getSupportedFormats();
} catch {
  BarcodeDetectorPolyfill.wasmModuleUrl = "https://cdn.jsdelivr.net/npm/@undecaf/zbar-wasm@0.9.15/dist/zbar.wasm";
  window.BarcodeDetector = BarcodeDetectorPolyfill;
}

const updateSW = registerSW({
  onNeedRefresh() {
    /* … */
  },
  onOfflineReady() {
    /* … */
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App theme="ios" dark={false}>
      <AppComponent />
    </App>
  </React.StrictMode>
);
