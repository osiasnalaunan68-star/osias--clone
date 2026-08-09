import { useAuth } from "../authContext";

export default function AccountButton() {
  const { user, profile, setOverlayOpen } = useAuth();
  return (
    <button
      onClick={() => setOverlayOpen(true)}
      aria-label="Account"
      className="flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-base active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:active:bg-slate-700"
    >
      {profile?.photoURL ? (
        <img src={profile.photoURL} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>👤</span>
      )}
    </button>
  );
}
