import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChapterBrowser from "./pages/ChapterBrowser";
import DevelopmentPanel from "./pages/DevelopmentPanel";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChapterBrowser />} />
        <Route path="/dev" element={<DevelopmentPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
