import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import { motion } from "motion/react";

const news = [
  {
    category: "NEW GAME",
    title: "Arctic Runner 2 Announced",
    excerpt:
      "The beloved polar bear is back in a brand new adventure with multiplayer co-op support, new biomes, and a full story campaign.",
    date: "March 10, 2026",
    img: "/assets/generated/carousel-arctic-runner.dim_1200x500.jpg",
  },
  {
    category: "CHARACTER REVEAL",
    title: "Meet Snowbell — New Character",
    excerpt:
      "Introducing Snowbell, a baby seal with the power to freeze time. Snowbell joins the Polarix roster in an upcoming title.",
    date: "March 5, 2026",
    img: "/assets/generated/character-penguin-transparent.dim_400x400.png",
  },
  {
    category: "UPDATE",
    title: "Penguin Catch Season 3 Live",
    excerpt:
      "New fish types, power-ups, and a brand new deep ocean level are now available. Log in to claim your Season 3 rewards.",
    date: "February 28, 2026",
    img: "/assets/generated/carousel-penguin-catch.dim_1200x500.jpg",
  },
  {
    category: "EVENT",
    title: "Polarix Spring Festival 2026",
    excerpt:
      "Join our global in-game event with exclusive rewards, community challenges, and a chance to vote on the next Polarix character.",
    date: "February 20, 2026",
    img: "/assets/generated/carousel-ice-fox.dim_1200x500.jpg",
  },
];

const catColors: Record<string, string> = {
  "NEW GAME": "#8B0000",
  "CHARACTER REVEAL": "#2a5a9a",
  UPDATE: "#1a6a3a",
  EVENT: "#6a3a8a",
};

export function NewsSection() {
  return (
    <section
      id="news"
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
            <Newspaper size={22} color="#8B0000" />
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "#8B0000" }}
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Latest News
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stay up to date with game launches, character reveals, and community
            events.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article, i) => (
            <motion.article
              key={article.title}
              data-ocid={`news.item.${i + 1}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(13,0,0,0.35)" }}
                />
                <div
                  className="absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wider text-white rounded"
                  style={{
                    background: catColors[article.category] ?? "#8B0000",
                  }}
                >
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground mb-2 font-medium tracking-wide">
                  {article.date}
                </p>
                <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-snug">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                  {article.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="w-fit px-0 font-semibold text-sm group/btn"
                  style={{ color: "#8B0000" }}
                  data-ocid={`news.read_more.button.${i + 1}`}
                >
                  Read More{" "}
                  <ArrowRight
                    size={16}
                    className="ml-1 group-hover/btn:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
