import { Shield, Sparkles, Stars } from "lucide-react";
import { motion } from "motion/react";

const pillars = [
  {
    icon: Sparkles,
    title: "Play First",
    description:
      "We design for fun above all else. If a five-year-old can't understand it within seconds, we go back to the drawing board. Complexity is never a feature.",
  },
  {
    icon: Stars,
    title: "Timeless Characters",
    description:
      "We create mascots with enduring charm that grow with our players across generations. A great character is a lifelong companion, not a marketing tool.",
  },
  {
    icon: Shield,
    title: "Quality Always",
    description:
      "We never ship until it's ready. Every pixel, every frame, every sound is intentional. We'd rather wait than disappoint the players who trust us.",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
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
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#8B0000" }}
            />
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "#8B0000" }}
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Our Philosophy
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Inspired by the masters who proved that joy, simplicity, and craft
            are the only ingredients a great game truly needs.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center p-8 rounded-2xl"
              style={{
                background: "#1a0505",
                border: "1px solid rgba(139,0,0,0.25)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: "rgba(139,0,0,0.2)",
                  border: "1px solid rgba(139,0,0,0.4)",
                }}
              >
                <pillar.icon size={30} color="#cc2222" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1a0505 0%, #2a0808 50%, #1a0505 100%)",
            border: "1px solid rgba(139,0,0,0.35)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #8B0000 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8B0000 0%, transparent 50%)",
            }}
          />
          <p className="font-display text-2xl md:text-4xl font-extrabold text-white relative mb-2">
            “We don’t make games.
          </p>
          <p
            className="font-display text-2xl md:text-4xl font-extrabold relative mb-6"
            style={{ color: "#8B0000" }}
          >
            We make memories.”
          </p>
          <p className="text-white/50 text-base tracking-widest uppercase font-medium">
            — Polarix Games Studio
          </p>
        </motion.div>
      </div>
    </section>
  );
}
