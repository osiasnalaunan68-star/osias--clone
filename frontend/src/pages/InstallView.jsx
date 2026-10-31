import { useMemo, useState } from "react";
import { useInstallInfo, promptInstall, detectPlatform } from "../pwaInstall";

const card = "rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800";
const h2 = "mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500";
const bigBtn = "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-bold text-white active:bg-navy-800 disabled:opacity-50 dark:bg-navy-700";
const ghostBtn = "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-700";

function Steps({ items }) {
  return (
    <ol className="space-y-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white dark:bg-navy-700">{i + 1}</span>
          <span className="pt-0.5">{t}</span>
        </li>
      ))}
    </ol>
  );
}

export default function InstallView() {
  const { canInstall, justInstalled, standalone } = useInstallInfo();
  const p = useMemo(() => detectPlatform(), []);
  const [dismissed, setDismissed] = useState(false);
  const [added, setAdded] = useState(false);
  const [upd, setUpd] = useState("");

  const doInstall = async () => {
    const r = await promptInstall();
    if (r === "dismissed") setDismissed(true);
  };

  const checkUpdate = async () => {
    setUpd("checking");
    try {
      const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
      if (reg) await reg.update();
      setUpd("reloading");
      setTimeout(() => window.location.reload(), 700);
    } catch (_) {
      setUpd("error");
    }
  };

  const done = justInstalled || added;

  let body;
  if (standalone) {
    body = (
      <section className={card}>
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">✅ You are using the installed app</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Nothing to install. It opens full screen straight from your Home Screen.</p>
      </section>
    );
  } else if (done) {
    body = (
      <section className={card + " text-center"}>
        <p className="text-4xl" aria-hidden>🎉</p>
        <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">Done!</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          Check your <b>Home Screen</b>, find the app icon, and open it from there. It opens full screen, like a real app.
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Tapos na! Hanapin ang icon sa Home Screen mo at buksan doon. Puwede mo nang isara ang browser na ito.</p>
        {added && !justInstalled && (
          <button onClick={() => setAdded(false)} className="mt-4 text-xs text-slate-400 underline">I did not add it yet</button>
        )}
      </section>
    );
  } else if (p.inApp) {
    body = (
      <section className={card + " border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20"}>
        <p className="font-bold text-amber-800 dark:text-amber-300">⚠️ Open this in your browser first</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
          You are inside the Facebook / Messenger (or similar) built-in browser, which cannot install apps.
        </p>
        <div className="mt-3">
          <Steps items={[
            "Tap the ⋯ or ⋮ menu (top right or bottom right).",
            p.ios ? "Tap \"Open in Safari\"." : "Tap \"Open in Chrome\" (or \"Open in browser\").",
            "Come back to this Update tab and install from there.",
          ]} />
        </div>
      </section>
    );
  } else if (canInstall) {
    body = (
      <section className={card}>
        <h2 className={h2}>Install the app</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">One tap. It adds the app to your Home Screen and opens full screen, no browser bars.</p>
        <button onClick={doInstall} className={bigBtn}>📲 Install app</button>
        {dismissed && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">No problem. Tap the button again later, or use your browser menu (⋮) → "Install app".</p>
        )}
      </section>
    );
  } else if (p.ios) {
    body = (
      <section className={card}>
        <h2 className={h2}>Add to Home Screen (iPhone / iPad)</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Apple does not allow one-tap install, so it takes 3 quick steps:</p>
        <Steps items={[
          p.browser === "safari"
            ? "Tap the Share button ⬆️ (the square with an arrow, at the bottom of Safari). On newer iPhones it may be inside the ••• menu."
            : "Tap the Share button ⬆️ (the square with an arrow). If you cannot find \"Add to Home Screen\", open this page in Safari instead.",
          "Scroll down and tap \"Add to Home Screen\".",
          "Tap \"Add\" (top right). The app icon appears on your Home Screen.",
        ]} />
        <button onClick={() => setAdded(true)} className={bigBtn + " mt-4"}>✅ I added it</button>
      </section>
    );
  } else if (p.android) {
    body = (
      <section className={card}>
        <h2 className={h2}>Add to Home Screen (Android)</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {p.browser === "chrome" ? "Your browser did not offer the one-tap install, so use the menu:" : "For one-tap install, open this page in Google Chrome. Or use your browser menu:"}
        </p>
        <Steps items={[
          p.browser === "samsung" ? "Tap the ☰ menu at the bottom right." : "Tap the ⋮ menu at the top right.",
          p.browser === "samsung" ? "Tap \"Add page to\" → \"Home screen\"." : "Tap \"Install app\" (or \"Add to Home screen\").",
          "Tap \"Install\" / \"Add\". The app icon appears on your Home Screen.",
        ]} />
        <button onClick={() => setAdded(true)} className={bigBtn + " mt-4"}>✅ I added it</button>
      </section>
    );
  } else {
    body = (
      <section className={card}>
        <h2 className={h2}>Install the app</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Open this site on your phone to add it to your Home Screen. On a computer, use the install icon in the Chrome / Edge address bar.
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Update</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Put the app on your Home Screen and keep it up to date.</p>
      </div>

      {body}

      <section className={card}>
        <h2 className={h2}>Get the latest version</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">Fixes and new features load automatically. Tap below if you want to check right now (needs internet).</p>
        <button onClick={checkUpdate} disabled={upd === "checking" || upd === "reloading"} className={ghostBtn}>
          {upd === "checking" ? "Checking…" : upd === "reloading" ? "Updating… the app will reload" : "🔄 Check for updates"}
        </button>
        {upd === "error" && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Could not check. Please connect to the internet and try again.</p>}
      </section>
    </div>
  );
}
