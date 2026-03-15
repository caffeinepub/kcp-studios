import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubmitHighScore } from "@/hooks/useQueries";
import { Gamepad2, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ArcticRunner } from "./games/ArcticRunner";
import { PenguinCatch } from "./games/PenguinCatch";
import { SaveThePrincess } from "./games/SaveThePrincess";

const games = [
  {
    id: "arctic-runner",
    title: "Arctic Runner",
    description:
      "Race across the frozen tundra as Blizzard the polar bear! Leap over icy obstacles as the pace intensifies. How far can you go?",
    genre: "Endless Runner",
    img: "/assets/generated/carousel-arctic-runner.dim_1200x500.jpg",
    rating: "E for Everyone",
    bgColor: "#0d0d1a",
    comingSoon: null,
  },
  {
    id: "penguin-catch",
    title: "Penguin Catch",
    description:
      "Guide Pip the penguin through a deep-sea adventure! Catch falling fish to score big, but dodge the rocks or lose a life!",
    genre: "Arcade Catch",
    img: "/assets/generated/carousel-penguin-catch.dim_1200x500.jpg",
    rating: "E for Everyone",
    bgColor: "#001a3a",
    comingSoon: null,
  },
  {
    id: "save-the-princess",
    title: "Save the Princess",
    description:
      "Play as Blizzard the polar bear on a daring rescue mission! Race through icy kingdoms, stomp enemies, and collect snowflakes to save Princess Vix from the ice fortress!",
    genre: "Platformer",
    img: "/assets/generated/carousel-arctic-runner.dim_1200x500.jpg",
    rating: "E for Everyone",
    bgColor: "#0a0a1a",
    comingSoon: null,
  },
];

export function GamesSection() {
  const [openGame, setOpenGame] = useState<string | null>(null);
  const { mutate: submitScore } = useSubmitHighScore();

  const handleGameOver = (gameName: string, score: number) => {
    submitScore(
      { gameName, playerName: "Player", score },
      {
        onSuccess: () => toast.success(`Score ${score} saved to leaderboard!`),
      },
    );
  };

  return (
    <section
      id="games"
      className="py-20 md:py-28"
      style={{ background: "#f9f5f5" }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "#8B0000" }}
            />
            <Gamepad2 size={22} color="#8B0000" />
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "#8B0000" }}
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Our Games
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fully playable right in your browser — no downloads, no logins. Pure
            fun.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              data-ocid={`games.item.${i + 1}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 relative"
              style={{ borderTop: "4px solid #8B0000" }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.img}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(13,0,0,0.3)" }}
                />
                <div
                  className="absolute top-3 left-3 px-2 py-1 text-xs font-bold tracking-wider text-white rounded"
                  style={{ background: "rgba(139,0,0,0.9)" }}
                >
                  {game.genre}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play
                      size={28}
                      color="white"
                      fill="white"
                      className="ml-1"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {game.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    {game.rating}
                  </span>
                  <Button
                    data-ocid={`games.play_button.${i + 1}`}
                    onClick={() => setOpenGame(game.id)}
                    className="font-bold uppercase tracking-wide"
                    style={{
                      background: "#8B0000",
                      boxShadow: "0 4px 16px rgba(139,0,0,0.35)",
                    }}
                  >
                    Play Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog
        open={openGame === "arctic-runner"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-4xl w-full p-6"
          data-ocid="games.arctic_runner.dialog"
          style={{ background: "#0d0d1a" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display text-2xl">
              Arctic Runner
            </DialogTitle>
          </DialogHeader>
          {openGame === "arctic-runner" && (
            <ArcticRunner
              onGameOver={(s) => handleGameOver("arctic-runner", s)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openGame === "penguin-catch"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-4xl w-full p-6"
          data-ocid="games.penguin_catch.dialog"
          style={{ background: "#001a3a" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display text-2xl">
              Penguin Catch
            </DialogTitle>
          </DialogHeader>
          {openGame === "penguin-catch" && (
            <PenguinCatch
              onGameOver={(s) => handleGameOver("penguin-catch", s)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openGame === "save-the-princess"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-4xl w-full p-6"
          data-ocid="games.save_the_princess.dialog"
          style={{ background: "#0a0a1a" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display text-2xl">
              Save the Princess
            </DialogTitle>
          </DialogHeader>
          {openGame === "save-the-princess" && (
            <SaveThePrincess
              onGameOver={(s) => handleGameOver("save-the-princess", s)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
