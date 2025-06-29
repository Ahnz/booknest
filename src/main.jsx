import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "konsta/react";
import AppComponent from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
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
