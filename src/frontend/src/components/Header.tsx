import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAdmin } from "../context/AdminContext";

const ADMIN_CODE = "122567891k7364738276shjhfhfjhsh";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Games", href: "#games" },
  { label: "Characters", href: "#characters" },
  { label: "News", href: "#news" },
  { label: "About", href: "#about" },
];

export function Header() {
  const { login } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showAdminPrompt) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showAdminPrompt]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setShowAdminPrompt(true);
    setCode("");
    setError("");
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      login(code);
      setShowAdminPrompt(false);
      setCode("");
      window.location.hash = "#admin";
    } else {
      setError("Incorrect password.");
      setCode("");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <>
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
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-85 transition-opacity cursor-pointer"
            aria-label="KCP Studios"
            data-ocid="nav.logo.button"
          >
            <img
              src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
              alt="KCP Studios"
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

      {/* Hidden admin login overlay */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAdminPrompt(false);
                setCode("");
                setError("");
              }
            }}
            data-ocid="admin.prompt.modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.25 }}
              className={shake ? "animate-shake" : ""}
              style={{
                background: "rgba(12,3,3,0.99)",
                border: "1px solid rgba(139,0,0,0.35)",
                borderRadius: "14px",
                boxShadow:
                  "0 0 60px rgba(139,0,0,0.2), 0 24px 80px rgba(0,0,0,0.9)",
                padding: "36px 32px",
                width: "100%",
                maxWidth: "380px",
                margin: "0 16px",
              }}
            >
              <div className="flex flex-col items-center mb-7">
                <img
                  src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
                  alt="KCP Studios"
                  className="h-10 w-auto object-contain mb-5"
                />
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  Admin Access
                </h2>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(139,0,0,0.7)" }}
                  />
                  <Input
                    ref={inputRef}
                    type="password"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password"
                    className="pl-9 font-mono text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: error
                        ? "1px solid rgba(255,60,60,0.6)"
                        : "1px solid rgba(139,0,0,0.3)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                    data-ocid="admin.prompt.input"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium"
                    style={{ color: "#ff6060" }}
                    data-ocid="admin.prompt.error_state"
                  >
                    ⚠ {error}
                  </motion.p>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onClick={() => {
                      setShowAdminPrompt(false);
                      setCode("");
                      setError("");
                    }}
                    data-ocid="admin.prompt.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 font-bold text-sm tracking-wider uppercase"
                    style={{
                      background: "#8B0000",
                      boxShadow: "0 4px 20px rgba(139,0,0,0.35)",
                    }}
                    data-ocid="admin.prompt.submit_button"
                  >
                    Enter
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
