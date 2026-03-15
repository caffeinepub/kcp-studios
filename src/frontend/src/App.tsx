import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { CharacterPage } from "./components/CharacterPage";
import { CharactersSection } from "./components/CharactersSection";
import { Footer } from "./components/Footer";
import { GamesSection } from "./components/GamesSection";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { NewsSection } from "./components/NewsSection";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLogin } from "./pages/AdminLogin";

const CONCERT_BUBBLES = [
  "cb-0",
  "cb-1",
  "cb-2",
  "cb-3",
  "cb-4",
  "cb-5",
  "cb-6",
  "cb-7",
  "cb-8",
  "cb-9",
  "cb-10",
  "cb-11",
];

const CONCERT_STARS = [
  "cs-0",
  "cs-1",
  "cs-2",
  "cs-3",
  "cs-4",
  "cs-5",
  "cs-6",
  "cs-7",
];

function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#0a0a0f" }}
      data-ocid="maintenance.panel"
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative text-center px-4">
        <img
          src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
          alt="KCP Studios"
          className="h-16 w-auto object-contain mx-auto mb-8"
        />
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(139,0,0,0.15)",
            border: "1px solid rgba(139,0,0,0.3)",
          }}
        >
          <span className="text-3xl">🔧</span>
        </div>
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-4"
          style={{
            color: "rgba(255,255,255,0.95)",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Temporarily Offline
        </h1>
        <p
          className="text-lg max-w-md mx-auto"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Site temporarily offline for maintenance. Check back soon!
        </p>
        <div
          className="mt-8 h-1 w-24 mx-auto rounded-full"
          style={{ background: "#8B0000" }}
        />
      </div>
    </div>
  );
}

function ConcertOverlay() {
  return (
    <div className="concert-overlay" aria-hidden="true">
      {CONCERT_BUBBLES.map((id, i) => (
        <div
          key={id}
          className="concert-bubble"
          style={{
            left: `${(i * 8.33) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 5)}s`,
          }}
        />
      ))}
      {CONCERT_STARS.map((id, i) => (
        <div
          key={id}
          className="concert-star"
          style={{
            left: `${(i * 12.5 + 6) % 100}%`,
            top: `${(i * 17 + 10) % 80}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}

function AppInner() {
  const { isAdmin, isShutdown, concertMode } = useAdmin();
  const [hash, setHash] = useState(window.location.hash);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const isAdminRoute = hash === "#admin";

  if (isAdminRoute) {
    return isAdmin ? <AdminDashboard /> : <AdminLogin />;
  }

  if (isShutdown && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <div
      className={`min-h-screen font-body ${concertMode ? "concert-mode" : ""}`}
    >
      {concertMode && <ConcertOverlay />}
      <Header />
      {selectedCharacter ? (
        <main className="pt-16">
          <CharacterPage
            characterName={selectedCharacter}
            onBack={() => setSelectedCharacter(null)}
          />
        </main>
      ) : (
        <main>
          <div className="pt-16">
            <HeroCarousel />
            <GamesSection />
            <CharactersSection onSelectCharacter={setSelectedCharacter} />
            <NewsSection />
            <AboutSection />
          </div>
        </main>
      )}
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppInner />
    </AdminProvider>
  );
}
