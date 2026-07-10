import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChapterBrowser from "./pages/ChapterBrowser";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChapterBrowser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Register the service worker so previously visited chapters/searches
// keep working even offline, and so the app qualifies as an installable
// PWA (needed later for packaging into an Android APK).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
