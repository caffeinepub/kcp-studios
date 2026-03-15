import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Gamepad2,
  LogOut,
  Music,
  Power,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAdmin } from "../context/AdminContext";

const allGames = [
  {
    id: "arctic-runner",
    title: "Arctic Runner",
    genre: "Endless Runner",
    description: "Race across the frozen tundra as Blizzard the polar bear!",
    status: "live" as const,
  },
  {
    id: "penguin-catch",
    title: "Penguin Catch",
    genre: "Arcade Catch",
    description: "Guide Pip the penguin through a deep-sea adventure!",
    status: "live" as const,
  },
  {
    id: "save-the-princess",
    title: "Save the Princess",
    genre: "Platformer",
    description:
      "Play as Blizzard on a daring rescue mission to save Princess Vix!",
    status: "coming" as const,
    releaseDate: "March 15, 2026",
  },
];

function SectionCard({
  children,
  title,
  icon,
  badge,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(139,0,0,0.2)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          borderBottom: "1px solid rgba(139,0,0,0.15)",
          background: "rgba(139,0,0,0.08)",
        }}
      >
        <span style={{ color: "#8B0000" }}>{icon}</span>
        <h2
          className="font-bold text-lg"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {title}
        </h2>
        {badge}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
  ocid,
  activeColor,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  ocid: string;
  activeColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex-1">
        <p
          className="font-semibold text-sm"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {label}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-bold tracking-wider"
          style={{
            color: checked
              ? (activeColor ?? "#4ade80")
              : "rgba(255,255,255,0.3)",
          }}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <Switch checked={checked} onCheckedChange={onToggle} data-ocid={ocid} />
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const {
    logout,
    isShutdown,
    concertMode,
    doubleLuck,
    extraLives,
    toggleShutdown,
    toggleConcertMode,
    toggleDoubleLuck,
    toggleExtraLives,
    earlyAccess,
    toggleEarlyAccess,
  } = useAdmin();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0a0f" }}
      data-ocid="admin.dashboard.panel"
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10,10,15,0.97)",
          borderBottom: "1px solid rgba(139,0,0,0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
            alt="KCP Studios"
            className="h-10 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <Shield size={14} style={{ color: "#8B0000" }} />
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase"
                style={{ color: "rgba(139,0,0,0.9)" }}
              >
                Admin Console
              </span>
            </div>
            <h1
              className="text-lg font-extrabold leading-tight"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              KCP Studios
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="gap-2 font-bold tracking-wide"
          style={{
            borderColor: "rgba(139,0,0,0.4)",
            color: "rgba(255,100,100,0.9)",
            background: "transparent",
          }}
          data-ocid="admin.dashboard.button"
        >
          <LogOut size={14} />
          Logout
        </Button>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Status bar */}
        {(isShutdown || concertMode || doubleLuck || extraLives) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 p-4 rounded-xl"
            style={{
              background: "rgba(139,0,0,0.12)",
              border: "1px solid rgba(139,0,0,0.3)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.5)", width: "100%" }}
            >
              Active Powers
            </span>
            {isShutdown && (
              <Badge style={{ background: "#8B0000" }}>🔴 Site Offline</Badge>
            )}
            {concertMode && (
              <Badge style={{ background: "#7c3aed" }}>🎵 Concert Mode</Badge>
            )}
            {doubleLuck && (
              <Badge style={{ background: "#d97706" }}>⚡ 2x Luck</Badge>
            )}
            {extraLives && (
              <Badge style={{ background: "#16a34a" }}>💚 Extra Lives</Badge>
            )}
          </motion.div>
        )}

        {/* Games Section */}
        <SectionCard title="Games Library" icon={<Gamepad2 size={18} />}>
          <div className="space-y-1">
            {allGames.map((game, i) => (
              <div
                key={game.id}
                data-ocid={`admin.games.item.${i + 1}`}
                className="flex items-center justify-between gap-4 py-4"
                style={{
                  borderBottom:
                    i < allGames.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-bold text-sm"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {game.title}
                    </span>
                    {game.status === "live" ? (
                      <Badge
                        className="text-[10px] px-1.5 py-0"
                        style={{ background: "#16a34a", color: "white" }}
                      >
                        LIVE
                      </Badge>
                    ) : (
                      <Badge
                        className="text-[10px] px-1.5 py-0"
                        style={{ background: "#8B0000", color: "white" }}
                      >
                        COMING {game.releaseDate?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {game.genre} — {game.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[10px] font-bold tracking-wider"
                    style={{
                      color: earlyAccess[game.id]
                        ? "#facc15"
                        : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {earlyAccess[game.id] ? "EARLY ACCESS" : "STANDARD"}
                  </span>
                  <Switch
                    checked={!!earlyAccess[game.id]}
                    onCheckedChange={() => toggleEarlyAccess(game.id)}
                    data-ocid={`admin.games.toggle.${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Site Control */}
        <SectionCard title="Site Control" icon={<Power size={18} />}>
          <ToggleRow
            label="Site Shutdown"
            description="Block all visitors from accessing the site. Only admins can view it."
            checked={isShutdown}
            onToggle={toggleShutdown}
            ocid="admin.shutdown.toggle"
            activeColor="#f87171"
          />
          <div className="pt-3" />
        </SectionCard>

        {/* Admin Abuse */}
        <SectionCard
          title="Admin Powers"
          icon={<Zap size={18} />}
          badge={
            <span
              className="ml-auto text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #8B0000, #cc3300)",
                color: "white",
                boxShadow: "0 2px 12px rgba(139,0,0,0.5)",
              }}
            >
              ⚡ Admin Abuse
            </span>
          }
        >
          <ToggleRow
            label="2× Luck Multiplier"
            description="Doubles luck/bonus item frequency across all games."
            checked={doubleLuck}
            onToggle={toggleDoubleLuck}
            ocid="admin.double_luck.toggle"
            activeColor="#facc15"
          />
          <ToggleRow
            label="+5 Extra Lives"
            description="All players start with 5 lives instead of 3 in every game."
            checked={extraLives}
            onToggle={toggleExtraLives}
            ocid="admin.extra_lives.toggle"
            activeColor="#4ade80"
          />
          <div className="pt-3" />
        </SectionCard>

        {/* Online Events */}
        <SectionCard title="Online Events" icon={<Music size={18} />}>
          <ToggleRow
            label="🎵 Concert Mode"
            description="Unleashes a full rainbow explosion across the site with floating colors and sparkles!"
            checked={concertMode}
            onToggle={toggleConcertMode}
            ocid="admin.concert_mode.toggle"
            activeColor="#a855f7"
          />
          {concertMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-xl text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,0,128,0.2), rgba(0,128,255,0.2), rgba(128,255,0,0.2))",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Sparkles
                className="mx-auto mb-2"
                size={28}
                style={{ color: "#facc15" }}
              />
              <p
                className="text-sm font-bold"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                🎉 Concert Mode is LIVE!
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                The public site is now bursting with rainbow magic ✨
              </p>
            </motion.div>
          )}
          <div className="pt-3" />
        </SectionCard>
      </main>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
          KCP Studios Admin Console — All actions are applied immediately.
        </p>
      </footer>
    </div>
  );
}
