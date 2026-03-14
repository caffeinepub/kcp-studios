import { Users } from "lucide-react";
import { motion } from "motion/react";

const characters = [
  {
    name: "Blizzard",
    role: "The Arctic Adventurer",
    lore: "Once a humble polar bear from the Frostheim Mountains, Blizzard discovered an ancient map hidden in the ice. Now he races across the frozen north, seeking the legendary Crystal of the Eternal Cold.",
    img: "/assets/generated/character-polar-bear-transparent.dim_400x400.png",
    game: "Arctic Runner",
    stats: { Speed: 85, Strength: 90, Courage: 95 },
  },
  {
    name: "Pip",
    role: "Ocean Guardian",
    lore: "Born beneath the waves of the Polar Sea, Pip has protected the ocean's bounty since before memory. Quick on his feet and sharp of mind, he ensures no fish goes uncounted — and no rock goes un-dodged.",
    img: "/assets/generated/character-penguin-transparent.dim_400x400.png",
    game: "Penguin Catch",
    stats: { Speed: 95, Agility: 88, Heart: 92 },
  },
  {
    name: "Vix",
    role: "Mystical Ice Mage",
    lore: "Vix wandered out of the ancient Aurora Forest carrying secrets older than the ice itself. She wields frost magic with graceful precision, and some say her eyes can see the future frozen in every snowflake.",
    img: "/assets/generated/character-arctic-fox-transparent.dim_400x400.png",
    game: "Frost Fox Chronicles",
    stats: { Magic: 98, Wisdom: 94, Mystery: 97 },
  },
];

export function CharactersSection() {
  return (
    <section
      id="characters"
      className="py-20 md:py-28"
      style={{ background: "#0d0000" }}
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
            <Users size={22} color="#8B0000" />
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "#8B0000" }}
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Meet the Characters
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Iconic heroes with unforgettable personalities, each with their own
            world to explore.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl overflow-hidden group cursor-default"
              style={{
                background: "#1a0505",
                border: "1px solid rgba(139,0,0,0.3)",
              }}
            >
              <div
                className="relative h-60 overflow-hidden"
                style={{ background: "#0d0000" }}
              >
                <img
                  src={char.img}
                  alt={char.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-16"
                  style={{
                    background: "linear-gradient(to top, #1a0505, transparent)",
                  }}
                />
                <div
                  className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white rounded tracking-wider"
                  style={{ background: "rgba(139,0,0,0.8)" }}
                >
                  {char.game}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-extrabold text-white mb-1">
                  {char.name}
                </h3>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: "#cc2222" }}
                >
                  {char.role}
                </p>
                <p className="text-white/65 text-sm leading-relaxed mb-5">
                  {char.lore}
                </p>
                <div className="space-y-2">
                  {Object.entries(char.stats).map(([stat, val]) => (
                    <div key={stat}>
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span className="font-medium tracking-wide">
                          {stat}
                        </span>
                        <span>{val}/100</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "#8B0000" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
