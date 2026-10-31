// Install-to-Home-Screen helper (PWA).
// Imported by ChapterBrowser, so the browser's "beforeinstallprompt" event is
// captured at startup (it often fires before the user opens the Update tab).
import { useEffect, useState } from "react";

let deferred = null;
let justInstalled = false;
const subs = new Set();
const notify = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    justInstalled = true;
    notify();
  });
}

// Capacitor APK = already a real app.
export function isNativeApp() {
  try {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  } catch (_) {
    return false;
  }
}

// Running from the Home Screen icon (no browser bars).
export function isStandalone() {
  try {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.navigator.standalone === true
    );
  } catch (_) {
    return false;
  }
}

export function detectPlatform() {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const ua = nav.userAgent || "";
  const touchMac = nav.platform === "MacIntel" && nav.maxTouchPoints > 1; // iPadOS
  const ios = /iPhone|iPad|iPod/.test(ua) || touchMac;
  const android = /Android/i.test(ua);
  // Facebook / Messenger / Instagram etc. built-in browsers cannot install apps.
  const inApp = /FBAN|FBAV|FB_IAB|Messenger|Instagram|Line\/|Snapchat|TikTok|MicroMessenger|Viber/i.test(ua);
  let browser = "other";
  if (/SamsungBrowser/i.test(ua)) browser = "samsung";
  else if (/EdgA|EdgiOS|Edg\//.test(ua)) browser = "edge";
  else if (/OPR\/|OPiOS/.test(ua)) browser = "opera";
  else if (/FxiOS|Firefox/.test(ua)) browser = "firefox";
  else if (/CriOS|Chrome\//.test(ua)) browser = "chrome";
  else if (/Safari/.test(ua)) browser = "safari";
  return { ios, android, inApp, browser };
}

// Android / desktop Chrome: shows the browser's own install dialog (one tap).
export async function promptInstall() {
  if (!deferred) return "unavailable";
  const ev = deferred;
  try {
    await ev.prompt();
    const choice = await ev.userChoice;
    deferred = null; // the event can only be used once
    notify();
    return choice && choice.outcome === "accepted" ? "accepted" : "dismissed";
  } catch (_) {
    return "unavailable";
  }
}

export function useInstallInfo() {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    subs.add(f);
    return () => { subs.delete(f); };
  }, []);
  return { canInstall: !!deferred, justInstalled, standalone: isStandalone() };
}
