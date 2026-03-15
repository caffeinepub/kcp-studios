import { ArrowLeft, BookOpen, Download, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { characters } from "../data/characters";

interface CharacterPageProps {
  characterName: string;
  onBack: () => void;
}

export function CharacterPage({ characterName, onBack }: CharacterPageProps) {
  const char = characters.find((c) => c.name === characterName);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!char) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0d0000" }}
      >
        <p className="text-white/50 text-xl">Character not found.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0d0000", minHeight: "100vh" }}>
      {/* Back bar - no-print */}
      <div
        className="no-print sticky top-16 z-40 border-b flex items-center px-6 py-3"
        style={{
          background: "rgba(13,0,0,0.95)",
          borderColor: "rgba(139,0,0,0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          data-ocid="character_page.back_button"
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-sm font-medium"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Characters
        </button>
      </div>

      {/* Print content wrapper */}
      <div id="character-print-content">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0d0000 0%, #1a0505 50%, #0d0000 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #8B0000 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8B0000 0%, transparent 50%)",
            }}
          />
          <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex justify-center relative"
              >
                <div
                  className="absolute inset-0 rounded-full opacity-20 blur-3xl"
                  style={{ background: char.color }}
                />
                <img
                  src={char.img}
                  alt={char.name}
                  className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div
                  className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase rounded mb-4"
                  style={{ background: "rgba(139,0,0,0.3)", color: "#ff4444" }}
                >
                  {char.game}
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-2 leading-tight">
                  {char.name}
                </h1>
                <p
                  className="text-xl font-semibold mb-6"
                  style={{ color: "#cc2222" }}
                >
                  {char.role}
                </p>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {char.personality}
                </p>
                <p className="text-white/55 text-sm leading-relaxed">
                  {char.lore}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className="py-16"
          style={{
            background: "#0d0000",
            borderTop: "1px solid rgba(139,0,0,0.2)",
          }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <Zap size={20} color="#8B0000" />
                <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Battle Stats
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(139,0,0,0.3)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {Object.entries(char.stats).map(([stat, val], i) => (
                  <motion.div
                    key={stat}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="rounded-xl p-5"
                    style={{
                      background: "#1a0505",
                      border: "1px solid rgba(139,0,0,0.25)",
                    }}
                  >
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-white/60 text-sm font-semibold tracking-widest uppercase">
                        {stat}
                      </span>
                      <span className="text-white font-bold text-xl">
                        {val}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${char.color}, #ff4444)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.15 + 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Abilities Section */}
        <section
          className="py-16"
          style={{
            background: "#100000",
            borderTop: "1px solid rgba(139,0,0,0.2)",
          }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <Star size={20} color="#8B0000" />
                <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Special Abilities
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(139,0,0,0.3)" }}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {char.abilities.map((ability, i) => (
                  <motion.div
                    key={ability}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-full font-bold text-white text-sm tracking-wide cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${char.color}, rgba(139,0,0,0.4))`,
                      border: "1px solid rgba(139,0,0,0.5)",
                      boxShadow: `0 0 20px ${char.color}40`,
                    }}
                  >
                    ✦ {ability}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Things to Know Section */}
        <section
          className="py-16"
          style={{
            background: "#0d0000",
            borderTop: "1px solid rgba(139,0,0,0.2)",
          }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <BookOpen size={20} color="#8B0000" />
                <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Things to Know
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(139,0,0,0.3)" }}
                />
              </div>
              <div className="space-y-5">
                {char.funFacts.map((fact, i) => (
                  <motion.div
                    key={fact.slice(0, 20)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-5 items-start rounded-xl p-5"
                    style={{
                      background: "#1a0505",
                      border: "1px solid rgba(139,0,0,0.2)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ background: char.color, color: "white" }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-white/75 text-base leading-relaxed pt-1">
                      {fact}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Game Appearances Footer */}
        <section
          className="py-10"
          style={{
            background: "#1a0505",
            borderTop: "1px solid rgba(139,0,0,0.3)",
          }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-wrap gap-8 items-center">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  First Appearance
                </p>
                <p className="text-white font-bold">{char.firstAppearance}</p>
              </div>
              {char.otherGames && char.otherGames.length > 0 && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Also Appears In
                  </p>
                  <p className="text-white font-bold">
                    {char.otherGames.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Download Bar - no-print */}
      <div
        className="no-print sticky bottom-0 z-40 border-t flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(13,0,0,0.97)",
          borderColor: "rgba(139,0,0,0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <p className="text-white font-bold text-sm">
            {char.name} — Character Sheet
          </p>
          <p className="text-white/40 text-xs">KCP Studios Official</p>
        </div>
        <button
          type="button"
          data-ocid="character_page.download_button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #8B0000, #cc2222)",
            boxShadow: "0 0 20px rgba(139,0,0,0.5)",
          }}
        >
          <Download size={15} />
          Download Character Sheet (PDF)
        </button>
      </div>
    </div>
  );
}
