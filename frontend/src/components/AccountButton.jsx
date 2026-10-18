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
      className="flex h-11 w-11 flex-shrink-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl border border-slate-300 bg-white shadow-sm active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:active:bg-slate-700"
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
        <span className="text-sm leading-5" aria-hidden>👤</span>
      )}
      <span className="text-[9px] font-semibold leading-none text-slate-600 dark:text-slate-300">Profile</span>
    </button>
  );
}
