import "./index.css";
import "./fonts";
import React from "react";
import ReactDOM from "react-dom/client";
import AccessGate from "./components/AccessGate";
import { seedDefaultQuizzes } from "./subjectQuizStore";
import { AuthProvider } from "./authContext";
import AccountOverlay from "./components/AccountOverlay";
import { isNativeApp } from "./pwaInstall";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error(e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: "#1e1e1e", color: "#ff6b6b", fontFamily: "monospace", whiteSpace: "pre-wrap", minHeight: "100vh" }}>
          <h1>⚠️ App Error</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener("unhandledrejection", (e) => {
  console.warn("Unhandled rejection:", e.reason);
  e.preventDefault();
});

seedDefaultQuizzes();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AccessGate />
        <AccountOverlay />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}

// Android hardware back button (APK lang, via @capacitor/app). May bukas na
// view/overlay (naka-push sa backNav.js)? Bumalik lang dito sa app. Wala nang
// mababalikan (home/root na talaga)? I-minimize, huwag i-kill ang app.
if (isNativeApp()) {
  import("@capacitor/app").then(({ App }) => {
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.minimizeApp();
    });
  }).catch(() => {});
}

{
  const warm = () => import("./db").then((m) => m.warmOfflineData()).catch(() => {});
  window.addEventListener("load", () => setTimeout(warm, 2500));
  window.addEventListener("online", () => setTimeout(warm, 1000));
}
