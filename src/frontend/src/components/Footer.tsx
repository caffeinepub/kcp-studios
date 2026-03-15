import { Heart } from "lucide-react";

const navGroups = [
  {
    title: "Navigate",
    links: [
      { label: "Games", href: "#games" },
      { label: "Characters", href: "#characters" },
      { label: "News", href: "#news" },
      { label: "About", href: "#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "#about" },
      { label: "Press", href: "#about" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="pt-16 pb-8"
      style={{
        background: "#0d0000",
        borderTop: "1px solid rgba(139,0,0,0.3)",
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <img
              src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
              alt="KCP Studios"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-white/50 text-sm leading-relaxed">
              Creating joyful, timeless gaming experiences for players of all
              ages. Based in the frozen north.
            </p>
            <p className="text-white/40 text-sm mt-4 font-display font-bold tracking-widest uppercase">
              Play. Imagine. Explore.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-white/80 text-xs font-bold tracking-widest uppercase mb-4">
                  {group.title}
                </h4>
                <div className="space-y-2">
                  {group.links.map((l) => (
                    <button
                      type="button"
                      key={l.label}
                      onClick={() => scrollTo(l.href)}
                      className="block text-white/50 hover:text-white text-sm transition-colors"
                      data-ocid={`footer.${l.label.toLowerCase()}.link`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h4 className="text-white/80 text-xs font-bold tracking-widest uppercase mb-4">
                Our Games
              </h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => scrollTo("#games")}
                  className="block text-white/50 hover:text-white text-sm transition-colors"
                >
                  Arctic Runner
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("#games")}
                  className="block text-white/50 hover:text-white text-sm transition-colors"
                >
                  Penguin Catch
                </button>
                <span className="block text-white/30 text-sm">
                  Frost Fox Chronicles
                </span>
                <span
                  className="block text-xs font-semibold tracking-wide"
                  style={{ color: "#8B0000" }}
                >
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-white/35 text-sm">
            © {year} KCP Studios. All rights reserved.
          </p>
          <p className="text-white/35 text-sm flex items-center gap-1.5">
            Built with{" "}
            <Heart
              size={13}
              className="fill-current"
              style={{ color: "#8B0000" }}
            />{" "}
            using
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
