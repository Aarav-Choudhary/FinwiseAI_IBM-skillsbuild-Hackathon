import { Bell, Search } from "lucide-react";

export default function TopBar({ user, profile, title = "Dashboard" }) {
  const country = profile?.countryData;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0"
      style={{ background: "rgba(11,11,13,0.8)", backdropFilter: "blur(12px)" }}>

      {/* ── Title ── */}
      <div className="md:block hidden">
        <h2 className="font-semibold text-textPrimary text-base">{title}</h2>
        {country && (
          <p className="text-xs text-textSecondary">
            {country.flag} {country.name} · {country.symbol} {country.currency}
          </p>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* IBM Badge */}
        <div className="ibm-badge hidden sm:inline-flex">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="0" y="5" width="24" height="3" />
            <rect x="3" y="10.5" width="18" height="3" />
            <rect x="0" y="16" width="24" height="3" />
          </svg>
          Powered by IBM watsonx
        </div>

        {/* Notification bell */}
        <button className="p-2 rounded-xl glass hover:border-primary transition-colors relative">
          <Bell size={16} className="text-textSecondary" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>

        {/* Avatar */}
        {user && (
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=6C63FF&color=fff`}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
          />
        )}
      </div>
    </header>
  );
}
