import { Toaster } from "@/components/ui/sonner";
import { AboutSection } from "./components/AboutSection";
import { CharactersSection } from "./components/CharactersSection";
import { Footer } from "./components/Footer";
import { GamesSection } from "./components/GamesSection";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { NewsSection } from "./components/NewsSection";

export default function App() {
  return (
    <div className="min-h-screen font-body">
      <Header />
      <main>
        <div className="pt-16">
          <HeroCarousel />
          <GamesSection />
          <CharactersSection />
          <NewsSection />
          <AboutSection />
        </div>
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
