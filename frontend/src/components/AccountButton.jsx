import { useState } from "react";
import { useAuth } from "../authContext";

// Framed "Profile" button: the avatar and the word "Profile" sit inside one bordered box,
// so users can tell at a glance that it is tappable (a bare Google photo looks like decoration).
export default function AccountButton() {
  const { profile, setOverlayOpen } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = !!profile?.photoURL && !imgFailed;
  return (
    <button
      onClick={() => setOverlayOpen(true)}
      aria-label="Open profile"
      className="flex h-11 w-11 flex-shrink-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl border border-parchment-200 bg-parchment-50 shadow-sm active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:active:bg-navy-700"
    >
      {showPhoto ? (
        <img
          src={profile.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-5 w-5 rounded-full object-cover"
        />
      ) : (
        <svg className="h-4 w-4 text-navy-700 dark:text-parchment-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c1.3-3.6 4.2-5.5 7-5.5s5.7 1.9 7 5.5" />
        </svg>
      )}
      <span className="text-[9px] font-semibold leading-none text-slate-600 dark:text-slate-300">Profile</span>
    </button>
  );
}
