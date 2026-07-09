import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ChapterBrowser from "./pages/ChapterBrowser";
import DevelopmentPanel from "./pages/DevelopmentPanel";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-900 text-white px-4 py-2 flex gap-4 text-sm">
        <Link to="/" className="hover:underline">Browse</Link>
        <Link to="/dev" className="hover:underline">Dev Panel</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ChapterBrowser />} />
        <Route path="/dev" element={<DevelopmentPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
