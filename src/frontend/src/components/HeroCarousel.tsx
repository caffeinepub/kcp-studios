import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    img: "/assets/generated/carousel-arctic-runner.dim_1200x500.jpg",
    title: "Arctic Runner",
    subtitle: "Play Now Available",
    tag: "GAME OUT NOW",
    cta: "#games",
  },
  {
    img: "/assets/generated/carousel-penguin-catch.dim_1200x500.jpg",
    title: "Penguin Catch",
    subtitle: "New Season Update",
    tag: "SEASON UPDATE",
    cta: "#games",
  },
  {
    img: "/assets/generated/carousel-ice-fox.dim_1200x500.jpg",
    title: "Frost Fox Chronicles",
    subtitle: "Coming Soon",
    tag: "COMING SOON",
    cta: "#news",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ height: "clamp(340px,56vw,560px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
          data-ocid={`carousel.item.${current + 1}`}
        >
          <img
            src={slides[current].img}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(13,0,0,0.85) 0%, rgba(13,0,0,0.5) 50%, rgba(13,0,0,0.15) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-3 px-3 py-1 text-xs font-bold tracking-widest uppercase text-white rounded-sm w-fit"
              style={{ background: "#8B0000" }}
            >
              {slides[current].tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-none text-shadow-dark mb-3"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 font-medium mb-8 text-shadow-dark"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => scrollTo(slides[current].cta)}
              className="w-fit px-8 py-3 text-white font-bold text-base uppercase tracking-widest rounded-sm transition-all duration-200 hover:scale-105"
              style={{
                background: "#8B0000",
                boxShadow: "0 4px 20px rgba(139,0,0,0.5)",
              }}
              data-ocid="carousel.primary_button"
            >
              Explore
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={prev}
        data-ocid="carousel.pagination_prev"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        type="button"
        onClick={next}
        data-ocid="carousel.pagination_next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((slide, i) => (
          <button
            type="button"
            key={slide.title}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-3" : "w-3 h-3"}`}
            style={{
              background: i === current ? "#8B0000" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #f9f5f5)",
        }}
      />
    </section>
  );
}
