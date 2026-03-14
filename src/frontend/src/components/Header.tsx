import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Games", href: "#games" },
  { label: "Characters", href: "#characters" },
  { label: "News", href: "#news" },
  { label: "About", href: "#about" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-brand" : ""}`}
      style={{
        background: "rgba(13,0,0,0.97)",
        borderBottom: "1px solid rgba(139,0,0,0.25)",
      }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between max-w-7xl">
        <button
          type="button"
          onClick={() => scrollTo("#home")}
          className="flex items-center hover:opacity-85 transition-opacity"
          aria-label="Polarix Games"
        >
          <img
            src="/assets/generated/polarix-logo-transparent.dim_400x200.png"
            alt="Polarix Games"
            className="h-12 w-auto object-contain"
          />
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-2 text-sm font-semibold text-white/75 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 tracking-wide uppercase"
            >
              {link.label}
            </button>
          ))}
          <Button
            size="sm"
            className="ml-4 font-bold tracking-wide uppercase"
            style={{
              background: "#8B0000",
              boxShadow: "0 4px 20px rgba(139,0,0,0.4)",
            }}
            onClick={() => scrollTo("#games")}
            data-ocid="nav.play_button"
          >
            Play Now
          </Button>
        </nav>
        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "#0d0000",
              borderTop: "1px solid rgba(139,0,0,0.2)",
            }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 text-white/75 hover:text-white hover:bg-white/10 rounded-md transition-all font-semibold uppercase tracking-wide text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
