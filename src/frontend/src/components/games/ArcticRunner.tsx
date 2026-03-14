import { useCallback, useEffect, useRef } from "react";

const W = 800;
const H = 320;
const GROUND_Y = 255;
const BEAR_X = 110;
const BEAR_SIZE = 52;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;

interface Obstacle {
  x: number;
  w: number;
  h: number;
}

interface GS {
  status: "idle" | "playing" | "gameover";
  bearY: number;
  bearVY: number;
  obstacles: Obstacle[];
  score: number;
  speed: number;
  frame: number;
  nextObstacle: number;
}

function makeGS(status: GS["status"] = "idle"): GS {
  return {
    status,
    bearY: GROUND_Y - BEAR_SIZE,
    bearVY: 0,
    obstacles: [],
    score: 0,
    speed: 3,
    frame: 0,
    nextObstacle: 90,
  };
}

export function ArcticRunner({
  onGameOver,
}: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(makeGS());
  const rafRef = useRef<number>(0);
  const cbRef = useRef(onGameOver);
  useEffect(() => {
    cbRef.current = onGameOver;
  });

  const startGame = useCallback(() => {
    gsRef.current = makeGS("playing");
  }, []);

  const tryJump = useCallback(() => {
    const s = gsRef.current;
    if (s.status === "idle" || s.status === "gameover") {
      startGame();
      return;
    }
    if (s.status === "playing" && s.bearY >= GROUND_Y - BEAR_SIZE - 2)
      s.bearVY = JUMP_FORCE;
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        tryJump();
      }
    };
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      tryJump();
    };
    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("click", tryJump);

    function drawBg(frame: number, speed: number) {
      const sky = ctx!.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, "#050520");
      sky.addColorStop(0.6, "#0d1060");
      sky.addColorStop(1, "#1a1a70");
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, W, GROUND_Y);
      ctx!.save();
      ctx!.globalAlpha = 0.22;
      for (let row = 0; row < 3; row++) {
        const ay = 40 + row * 28;
        const ag = ctx!.createLinearGradient(0, ay, 0, ay + 32);
        const hue = [160, 180, 200][row];
        ag.addColorStop(0, "transparent");
        ag.addColorStop(0.5, `hsla(${hue},100%,60%,0.9)`);
        ag.addColorStop(1, "transparent");
        ctx!.fillStyle = ag;
        ctx!.beginPath();
        ctx!.moveTo(0, ay);
        for (let x = 0; x <= W; x += 40)
          ctx!.lineTo(x, ay + Math.sin(x * 0.008 + frame * 0.015 + row) * 10);
        ctx!.lineTo(W, ay + 32);
        ctx!.lineTo(0, ay + 32);
        ctx!.fill();
      }
      ctx!.restore();
      ctx!.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 50; i++) {
        const sx = ((i * 161.8 + frame * 0.15) % (W + 20)) - 10;
        const sy = (i * 67.3) % (GROUND_Y - 100);
        ctx!.fillRect(sx, sy, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
      ctx!.fillStyle = "#12123a";
      ctx!.beginPath();
      ctx!.moveTo(0, GROUND_Y);
      const mp = [
        0,
        190,
        90,
        105,
        180,
        155,
        280,
        85,
        380,
        145,
        480,
        75,
        580,
        130,
        680,
        95,
        800,
        135,
        800,
        GROUND_Y,
      ];
      for (let i = 0; i < mp.length; i += 2) ctx!.lineTo(mp[i], mp[i + 1]);
      ctx!.fill();
      ctx!.fillStyle = "rgba(225,240,255,0.85)";
      for (const [px, py] of [
        [90, 105],
        [280, 85],
        [480, 75],
        [680, 95],
      ] as [number, number][]) {
        ctx!.beginPath();
        ctx!.moveTo(px, py);
        ctx!.lineTo(px - 25, py + 28);
        ctx!.lineTo(px + 25, py + 28);
        ctx!.fill();
      }
      const gnd = ctx!.createLinearGradient(0, GROUND_Y, 0, H);
      gnd.addColorStop(0, "#cce4f0");
      gnd.addColorStop(1, "#8bbbd4");
      ctx!.fillStyle = gnd;
      ctx!.fillRect(0, GROUND_Y, W, H - GROUND_Y);
      ctx!.fillStyle = "rgba(240,252,255,0.6)";
      for (let i = 0; i < 10; i++) {
        const bx = ((i * 100 + W - frame * speed * 0.4) % (W + 100)) - 50;
        ctx!.beginPath();
        ctx!.ellipse(bx, GROUND_Y + 5, 26, 8, 0, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawBear(bx: number, by: number, frame: number) {
      const b = Math.sin(frame * 0.35) * 2;
      ctx!.fillStyle = "rgba(0,0,0,0.12)";
      ctx!.beginPath();
      ctx!.ellipse(bx + 26, GROUND_Y + 4, 20, 6, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f0f0f0";
      ctx!.beginPath();
      ctx!.ellipse(bx + 26, by + BEAR_SIZE - 16 + b, 21, 19, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "#ddd";
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.fillStyle = "#8B0000";
      ctx!.fillRect(bx + 7, by + 32 + b, 38, 8);
      ctx!.fillStyle = "#aa0000";
      ctx!.fillRect(bx + 7, by + 33 + b, 38, 3);
      ctx!.fillStyle = "#f2f2f2";
      ctx!.beginPath();
      ctx!.arc(bx + 26, by + 20 + b, 18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "#ddd";
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.fillStyle = "#ebebeb";
      ctx!.beginPath();
      ctx!.arc(bx + 11, by + 7 + b, 7, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(bx + 41, by + 7 + b, 7, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f8c0c0";
      ctx!.beginPath();
      ctx!.arc(bx + 11, by + 7 + b, 3.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(bx + 41, by + 7 + b, 3.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#1a1a1a";
      ctx!.beginPath();
      ctx!.arc(bx + 20, by + 18 + b, 3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(bx + 32, by + 18 + b, 3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#fff";
      ctx!.beginPath();
      ctx!.arc(bx + 21, by + 17 + b, 1.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(bx + 33, by + 17 + b, 1.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#222";
      ctx!.beginPath();
      ctx!.ellipse(bx + 26, by + 25 + b, 5, 3.5, 0, 0, Math.PI * 2);
      ctx!.fill();
      const lg = Math.sin(frame * 0.4) * 9;
      ctx!.fillStyle = "#e8e8e8";
      ctx!.fillRect(bx + 10 + lg, by + BEAR_SIZE - 6, 11, 12);
      ctx!.fillRect(bx + 29 - lg, by + BEAR_SIZE - 6, 11, 12);
      ctx!.fillStyle = "#d5d5d5";
      ctx!.beginPath();
      ctx!.ellipse(bx + 15 + lg, by + BEAR_SIZE + 6, 7, 5, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.ellipse(bx + 34 - lg, by + BEAR_SIZE + 6, 7, 5, 0, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawObs(obs: Obstacle) {
      const og = ctx!.createLinearGradient(
        obs.x,
        GROUND_Y - obs.h,
        obs.x + obs.w,
        GROUND_Y,
      );
      og.addColorStop(0, "#c8e8f8");
      og.addColorStop(0.5, "#5aa0c8");
      og.addColorStop(1, "#3a7aaa");
      ctx!.fillStyle = og;
      ctx!.fillRect(obs.x, GROUND_Y - obs.h, obs.w, obs.h);
      ctx!.fillStyle = "rgba(255,255,255,0.4)";
      ctx!.fillRect(obs.x + 3, GROUND_Y - obs.h + 3, 7, obs.h * 0.5);
      ctx!.fillRect(obs.x + 3, GROUND_Y - obs.h + 3, obs.w * 0.6, 5);
      ctx!.strokeStyle = "#88c8e8";
      ctx!.lineWidth = 2;
      ctx!.strokeRect(obs.x, GROUND_Y - obs.h, obs.w, obs.h);
    }

    function collides(obs: Obstacle, by: number) {
      const m = 10;
      return (
        BEAR_X + m < obs.x + obs.w - 4 &&
        BEAR_X + BEAR_SIZE - m > obs.x + 4 &&
        by + m < GROUND_Y &&
        by + BEAR_SIZE > GROUND_Y - obs.h + 4
      );
    }

    function loop() {
      const s = gsRef.current;
      ctx!.clearRect(0, 0, W, H);
      drawBg(s.frame, s.speed);
      if (s.status === "idle") {
        drawBear(BEAR_X, s.bearY, s.frame);
        s.frame++;
        ctx!.fillStyle = "rgba(0,0,0,0.55)";
        ctx!.fillRect(W * 0.5 - 220, H * 0.5 - 65, 440, 130);
        ctx!.strokeStyle = "rgba(139,0,0,0.8)";
        ctx!.lineWidth = 2;
        ctx!.strokeRect(W * 0.5 - 220, H * 0.5 - 65, 440, 130);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 38px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText("ARCTIC RUNNER", W * 0.5, H * 0.5 - 14);
        ctx!.fillStyle = "#aaa";
        ctx!.font = "18px sans-serif";
        ctx!.fillText("SPACE / Tap to Start", W * 0.5, H * 0.5 + 25);
      } else if (s.status === "playing") {
        s.frame++;
        s.bearVY += GRAVITY;
        s.bearY += s.bearVY;
        if (s.bearY >= GROUND_Y - BEAR_SIZE) {
          s.bearY = GROUND_Y - BEAR_SIZE;
          s.bearVY = 0;
        }
        s.nextObstacle--;
        if (s.nextObstacle <= 0) {
          const h = 28 + Math.random() * 45;
          s.obstacles.push({ x: W + 20, w: 28 + Math.random() * 22, h });
          s.nextObstacle = 55 + Math.random() * 55;
        }
        s.obstacles = s.obstacles
          .map((o) => ({ ...o, x: o.x - s.speed }))
          .filter((o) => o.x > -80);
        for (const obs of s.obstacles) {
          if (collides(obs, s.bearY)) {
            s.status = "gameover";
            cbRef.current?.(s.score);
            break;
          }
        }
        s.score = Math.floor(s.frame / 8);
        s.speed = 3 + Math.floor(s.frame / 250) * 0.6;
        for (const obs of s.obstacles) drawObs(obs);
        drawBear(BEAR_X, s.bearY, s.frame);
        ctx!.fillStyle = "rgba(0,0,0,0.45)";
        ctx!.fillRect(W - 155, 10, 145, 44);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 24px sans-serif";
        ctx!.textAlign = "right";
        ctx!.fillText(`Score: ${s.score}`, W - 16, 40);
      } else {
        for (const obs of s.obstacles) drawObs(obs);
        drawBear(BEAR_X, s.bearY, s.frame);
        ctx!.fillStyle = "rgba(0,0,0,0.72)";
        ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = "#8B0000";
        ctx!.font = "bold 48px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", W * 0.5, H * 0.5 - 40);
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 30px sans-serif";
        ctx!.fillText(`Score: ${s.score}`, W * 0.5, H * 0.5 + 10);
        ctx!.fillStyle = "#aaa";
        ctx!.font = "18px sans-serif";
        ctx!.fillText("SPACE / Tap to Restart", W * 0.5, H * 0.5 + 52);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("click", tryJump);
    };
  }, [tryJump]);

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="game-canvas w-full rounded-xl cursor-pointer block"
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        SPACE / ↑ to jump &nbsp;|&nbsp; Tap on mobile
      </p>
    </div>
  );
}
