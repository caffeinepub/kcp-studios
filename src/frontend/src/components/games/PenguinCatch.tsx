import { useCallback, useEffect, useRef } from "react";

const W = 800;
const H = 420;
const GROUND_Y = 368;
const PENGUIN_H = 60;
const PENGUIN_W = 44;
const CATCH_R = 36;
const SPD = 6;

interface Item {
  x: number;
  y: number;
  vy: number;
  type: "fish" | "rock";
  size: number;
  wobble: number;
}

interface PGS {
  status: "idle" | "playing" | "gameover";
  px: number;
  score: number;
  lives: number;
  items: Item[];
  frame: number;
  nextItem: number;
  keys: Set<string>;
  touchDX: number;
}

function makeGS(status: PGS["status"] = "idle", keys = new Set<string>()): PGS {
  return {
    status,
    px: W / 2 - PENGUIN_W / 2,
    score: 0,
    lives: 3,
    items: [],
    frame: 0,
    nextItem: 60,
    keys,
    touchDX: 0,
  };
}

export function PenguinCatch({
  onGameOver,
}: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<PGS>(makeGS());
  const rafRef = useRef<number>(0);
  const cbRef = useRef(onGameOver);
  const txRef = useRef(0);
  useEffect(() => {
    cbRef.current = onGameOver;
  });

  const startGame = useCallback(() => {
    gsRef.current = makeGS("playing", gsRef.current.keys);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") gsRef.current.keys.add(e.code);
      else gsRef.current.keys.delete(e.code);
      if (
        (e.code === "Space" || e.code === "Enter") &&
        gsRef.current.status !== "playing"
      )
        startGame();
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      txRef.current = e.touches[0].clientX;
      if (gsRef.current.status !== "playing") startGame();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      gsRef.current.touchDX = (e.touches[0].clientX - txRef.current) * 0.08;
      txRef.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      gsRef.current.touchDX = 0;
    };
    const onClick = () => {
      if (gsRef.current.status !== "playing") startGame();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("click", onClick);

    function drawBg(frame: number) {
      const bg = ctx!.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#001a3a");
      bg.addColorStop(0.5, "#003366");
      bg.addColorStop(1, "#005588");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);
      ctx!.fillStyle = "rgba(150,220,255,0.18)";
      for (let i = 0; i < 20; i++) {
        const bx = (i * 193 + frame * 0.3) % W;
        const by = (i * 87 + frame * 0.8) % H;
        ctx!.beginPath();
        ctx!.arc(bx, by, 3 + (i % 5), 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.fillStyle = "#cc3344";
      for (const [cx, cy] of [
        [60, GROUND_Y],
        [200, GROUND_Y],
        [500, GROUND_Y],
        [700, GROUND_Y],
      ] as [number, number][]) {
        for (let b = -2; b <= 2; b++) {
          ctx!.beginPath();
          ctx!.moveTo(cx + b * 12, cy);
          ctx!.lineTo(cx + b * 12 - 5, cy - 33);
          ctx!.lineTo(cx + b * 12 + 5, cy - 33);
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(cx, cy - 36, 6, 0, Math.PI * 2);
        ctx!.fill();
      }
      const fl = ctx!.createLinearGradient(0, GROUND_Y, 0, H);
      fl.addColorStop(0, "#4a6a3a");
      fl.addColorStop(1, "#2a4a2a");
      ctx!.fillStyle = fl;
      ctx!.fillRect(0, GROUND_Y, W, H - GROUND_Y);
      ctx!.strokeStyle = "#3a8a3a";
      ctx!.lineWidth = 4;
      for (let i = 0; i < 12; i++) {
        const sx = (i * 80 + 40 + Math.sin(frame * 0.02) * 5) % W;
        ctx!.beginPath();
        ctx!.moveTo(sx, H);
        for (let j = 0; j < 4; j++) {
          const wv = Math.sin(frame * 0.03 + j + i) * 8;
          ctx!.quadraticCurveTo(
            sx + wv + 10,
            H - j * 15 - 10,
            sx + wv,
            H - j * 15 - 15,
          );
        }
        ctx!.stroke();
      }
      ctx!.save();
      ctx!.globalAlpha = 0.06;
      for (let i = 0; i < 5; i++) {
        const rx = 100 + i * 150;
        ctx!.fillStyle = "#aaddff";
        ctx!.beginPath();
        ctx!.moveTo(rx + Math.sin(frame * 0.01 + i) * 20, 0);
        ctx!.lineTo(rx + 30, H * 0.6);
        ctx!.lineTo(rx - 20, H * 0.6);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawPenguin(px: number, frame: number) {
      const py = GROUND_Y - PENGUIN_H;
      const wb = Math.sin(frame * 0.3) * 2;
      ctx!.fillStyle = "rgba(0,0,0,0.18)";
      ctx!.beginPath();
      ctx!.ellipse(px + PENGUIN_W / 2, GROUND_Y + 4, 20, 6, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#111";
      ctx!.beginPath();
      ctx!.ellipse(px + PENGUIN_W / 2, py + 35 + wb, 20, 28, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f5f5f0";
      ctx!.beginPath();
      ctx!.ellipse(px + PENGUIN_W / 2, py + 38 + wb, 12, 20, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#1a3a8a";
      ctx!.fillRect(px + 4, py + 3 + wb, PENGUIN_W - 8, 12);
      ctx!.fillRect(px + 2, py + 13 + wb, PENGUIN_W - 4, 5);
      ctx!.fillStyle = "#cc2233";
      ctx!.fillRect(px + 4, py + 12 + wb, PENGUIN_W - 8, 3);
      ctx!.fillStyle = "#111";
      ctx!.beginPath();
      ctx!.arc(px + PENGUIN_W / 2, py + 18 + wb, 15, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f5f5f0";
      ctx!.beginPath();
      ctx!.ellipse(px + PENGUIN_W / 2, py + 20 + wb, 10, 12, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#1a1a1a";
      ctx!.beginPath();
      ctx!.arc(px + PENGUIN_W / 2 - 5, py + 17 + wb, 3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(px + PENGUIN_W / 2 + 5, py + 17 + wb, 3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#fff";
      ctx!.beginPath();
      ctx!.arc(px + PENGUIN_W / 2 - 4, py + 16 + wb, 1.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(px + PENGUIN_W / 2 + 6, py + 16 + wb, 1.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#ff8800";
      ctx!.beginPath();
      ctx!.moveTo(px + PENGUIN_W / 2 - 5, py + 22 + wb);
      ctx!.lineTo(px + PENGUIN_W / 2 + 5, py + 22 + wb);
      ctx!.lineTo(px + PENGUIN_W / 2, py + 28 + wb);
      ctx!.fill();
      const fa = Math.sin(frame * 0.3) * 0.3;
      ctx!.fillStyle = "#111";
      ctx!.save();
      ctx!.translate(px + 4, py + 32 + wb);
      ctx!.rotate(-fa);
      ctx!.fillRect(-3, 0, 9, 20);
      ctx!.restore();
      ctx!.save();
      ctx!.translate(px + PENGUIN_W - 4, py + 32 + wb);
      ctx!.rotate(fa);
      ctx!.fillRect(-6, 0, 9, 20);
      ctx!.restore();
      ctx!.fillStyle = "#ff8800";
      const fs = Math.sin(frame * 0.4) * 6;
      ctx!.beginPath();
      ctx!.ellipse(px + 14 + fs, GROUND_Y + 2, 10, 5, 0.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.ellipse(px + 30 - fs, GROUND_Y + 2, 10, 5, -0.2, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawItem(item: Item) {
      if (item.type === "fish") {
        const w = Math.sin(item.wobble) * 0.2;
        ctx!.save();
        ctx!.translate(item.x, item.y);
        ctx!.rotate(w);
        ctx!.fillStyle = "#ffaa22";
        ctx!.beginPath();
        ctx!.ellipse(0, 0, item.size, item.size * 0.6, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.moveTo(item.size - 2, 0);
        ctx!.lineTo(item.size + 10, -8);
        ctx!.lineTo(item.size + 10, 8);
        ctx!.fill();
        ctx!.fillStyle = "#1a1a1a";
        ctx!.beginPath();
        ctx!.arc(-item.size * 0.4, -2, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "#fff";
        ctx!.beginPath();
        ctx!.arc(-item.size * 0.4, -3, 1, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      } else {
        ctx!.fillStyle = "#6a6a6a";
        ctx!.beginPath();
        ctx!.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "rgba(255,255,255,0.15)";
        ctx!.beginPath();
        ctx!.arc(
          item.x - item.size * 0.3,
          item.y - item.size * 0.3,
          item.size * 0.3,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
        ctx!.strokeStyle = "#888";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }
    }

    function drawHUD(score: number, lives: number) {
      ctx!.fillStyle = "rgba(0,0,0,0.5)";
      ctx!.fillRect(8, 8, 160, 48);
      ctx!.fillStyle = "#fff";
      ctx!.font = "bold 22px sans-serif";
      ctx!.textAlign = "left";
      ctx!.fillText(`Score: ${score}`, 18, 38);
      ctx!.fillStyle = "rgba(0,0,0,0.5)";
      ctx!.fillRect(W - 130, 8, 122, 48);
      ctx!.fillStyle = "#ff4444";
      ctx!.font = "bold 26px sans-serif";
      ctx!.textAlign = "right";
      ctx!.fillText(
        "\u2665".repeat(lives) + "\u2661".repeat(Math.max(0, 3 - lives)),
        W - 14,
        40,
      );
    }

    function loop() {
      const s = gsRef.current;
      ctx!.clearRect(0, 0, W, H);
      drawBg(s.frame);
      if (s.status === "idle") {
        drawPenguin(s.px, s.frame);
        s.frame++;
        ctx!.fillStyle = "rgba(0,0,0,0.6)";
        ctx!.fillRect(W * 0.5 - 230, H * 0.5 - 65, 460, 130);
        ctx!.strokeStyle = "rgba(139,0,0,0.8)";
        ctx!.lineWidth = 2;
        ctx!.strokeRect(W * 0.5 - 230, H * 0.5 - 65, 460, 130);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 38px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText("PENGUIN CATCH", W * 0.5, H * 0.5 - 12);
        ctx!.fillStyle = "#aaa";
        ctx!.font = "18px sans-serif";
        ctx!.fillText("Click / Tap to Start", W * 0.5, H * 0.5 + 28);
      } else if (s.status === "playing") {
        s.frame++;
        const left = s.keys.has("ArrowLeft") || s.keys.has("KeyA");
        const right = s.keys.has("ArrowRight") || s.keys.has("KeyD");
        if (left) s.px = Math.max(0, s.px - SPD);
        if (right) s.px = Math.min(W - PENGUIN_W, s.px + SPD);
        if (s.touchDX)
          s.px = Math.max(0, Math.min(W - PENGUIN_W, s.px + s.touchDX * SPD));
        s.nextItem--;
        if (s.nextItem <= 0) {
          const isFish = Math.random() < 0.65;
          s.items.push({
            x: 30 + Math.random() * (W - 60),
            y: -20,
            vy: 2 + Math.random() * 2.5 + Math.floor(s.frame / 500) * 0.5,
            type: isFish ? "fish" : "rock",
            size: isFish ? 14 + Math.random() * 6 : 12 + Math.random() * 8,
            wobble: 0,
          });
          s.nextItem = 40 + Math.random() * 40;
        }
        const pcx = s.px + PENGUIN_W / 2;
        const pcy = GROUND_Y - PENGUIN_H / 2;
        const next: Item[] = [];
        for (const item of s.items) {
          item.y += item.vy;
          item.wobble += 0.15;
          const dist = Math.hypot(item.x - pcx, item.y - pcy);
          if (
            dist < CATCH_R + item.size &&
            item.y > GROUND_Y - PENGUIN_H - 10
          ) {
            if (item.type === "fish") s.score += 10;
            else {
              s.lives--;
              if (s.lives <= 0) {
                s.status = "gameover";
                cbRef.current?.(s.score);
              }
            }
          } else if (item.y < H + 40) next.push(item);
        }
        s.items = next;
        for (const item of s.items) drawItem(item);
        drawPenguin(s.px, s.frame);
        drawHUD(s.score, s.lives);
      } else {
        for (const item of s.items) drawItem(item);
        drawPenguin(s.px, s.frame);
        ctx!.fillStyle = "rgba(0,0,0,0.72)";
        ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = "#8B0000";
        ctx!.font = "bold 48px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", W * 0.5, H * 0.5 - 40);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 30px sans-serif";
        ctx!.fillText(`Score: ${s.score}`, W * 0.5, H * 0.5 + 12);
        ctx!.fillStyle = "#aaa";
        ctx!.font = "18px sans-serif";
        ctx!.fillText("Click / Tap to Restart", W * 0.5, H * 0.5 + 55);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("click", onClick);
    };
  }, [startGame]);

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="game-canvas w-full rounded-xl cursor-pointer block"
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        ← → / A D to move &nbsp;|&nbsp; Catch fish, dodge rocks &nbsp;|&nbsp;
        Touch &amp; drag on mobile
      </p>
    </div>
  );
}
