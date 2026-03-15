import { useEffect, useRef, useState } from "react";

interface SaveThePrincessProps {
  onGameOver: (score: number) => void;
}

const CANVAS_W = 800;
const CANVAS_H = 480;
const LEVEL_W = 5200;
const GRAVITY = 0.55;
const PLAYER_SPEED = 3.5;
const JUMP_FORCE = -13;
const GROUND_Y = CANVAS_H - 60;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Platform extends Rect {
  hasSnow?: boolean;
}
interface Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  alive: boolean;
  leftBound: number;
  rightBound: number;
  walkFrame: number;
}
interface Snowflake {
  x: number;
  y: number;
  w: number;
  h: number;
  collected: boolean;
}
interface BgSnowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}
interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  onGround: boolean;
  alive: boolean;
  facingRight: boolean;
  walkFrame: number;
  invincible: number;
}

function rectOverlap(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function makePlatforms(): Platform[] {
  const ground: Platform = {
    x: 0,
    y: GROUND_Y,
    w: LEVEL_W,
    h: 60,
    hasSnow: true,
  };
  const plats: Platform[] = [
    { x: 200, y: 360, w: 140, h: 18, hasSnow: true },
    { x: 400, y: 300, w: 120, h: 18, hasSnow: true },
    { x: 580, y: 240, w: 160, h: 18, hasSnow: true },
    { x: 800, y: 310, w: 130, h: 18, hasSnow: true },
    { x: 1000, y: 260, w: 150, h: 18, hasSnow: true },
    { x: 1220, y: 320, w: 100, h: 18, hasSnow: true },
    { x: 1380, y: 220, w: 180, h: 18, hasSnow: true },
    { x: 1620, y: 300, w: 130, h: 18, hasSnow: true },
    { x: 1800, y: 240, w: 120, h: 18, hasSnow: true },
    { x: 2000, y: 350, w: 140, h: 18, hasSnow: true },
    { x: 2200, y: 270, w: 110, h: 18, hasSnow: true },
    { x: 2360, y: 200, w: 150, h: 18, hasSnow: true },
    { x: 2560, y: 280, w: 140, h: 18, hasSnow: true },
    { x: 2760, y: 220, w: 120, h: 18, hasSnow: true },
    { x: 2940, y: 310, w: 160, h: 18, hasSnow: true },
    { x: 3160, y: 240, w: 130, h: 18, hasSnow: true },
    { x: 3350, y: 180, w: 160, h: 18, hasSnow: true },
    { x: 3570, y: 260, w: 140, h: 18, hasSnow: true },
    { x: 3760, y: 320, w: 130, h: 18, hasSnow: true },
    { x: 3950, y: 230, w: 150, h: 18, hasSnow: true },
    { x: 4150, y: 290, w: 130, h: 18, hasSnow: true },
    { x: 4340, y: 220, w: 120, h: 18, hasSnow: true },
    { x: 4520, y: 310, w: 160, h: 18, hasSnow: true },
    { x: 4740, y: 240, w: 140, h: 18, hasSnow: true },
    { x: 4940, y: 330, w: 120, h: 18, hasSnow: true },
  ];
  return [ground, ...plats];
}

function makeEnemies(platforms: Platform[]): Enemy[] {
  const enemyPlats = [1, 3, 5, 8, 11, 14, 17, 20, 22];
  return enemyPlats.map((pi) => {
    const p = platforms[pi];
    return {
      x: p.x + 10,
      y: p.y - 32,
      w: 30,
      h: 32,
      vx: 1.2,
      alive: true,
      leftBound: p.x + 2,
      rightBound: p.x + p.w - 32,
      walkFrame: 0,
    };
  });
}

function makeSnowflakes(platforms: Platform[]): Snowflake[] {
  const flakes: Snowflake[] = [];
  for (let x = 150; x < LEVEL_W - 300; x += 280) {
    flakes.push({ x, y: GROUND_Y - 30, w: 20, h: 20, collected: false });
  }
  for (let i = 1; i < platforms.length; i++) {
    const p = platforms[i];
    const count = Math.floor(p.w / 50);
    for (let j = 0; j < count; j++) {
      flakes.push({
        x: p.x + 20 + j * 50,
        y: p.y - 28,
        w: 20,
        h: 20,
        collected: false,
      });
    }
  }
  return flakes;
}

function makeBgSnowflakes(): BgSnowflake[] {
  return Array.from({ length: 60 }, () => ({
    x: Math.random() * CANVAS_W,
    y: Math.random() * CANVAS_H,
    size: 1 + Math.random() * 3,
    speed: 0.4 + Math.random() * 1.2,
    opacity: 0.3 + Math.random() * 0.6,
  }));
}

function makePlayer(): Player {
  return {
    x: 80,
    y: GROUND_Y - 50,
    w: 36,
    h: 48,
    vx: 0,
    vy: 0,
    onGround: false,
    alive: true,
    facingRight: true,
    walkFrame: 0,
    invincible: 0,
  };
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  camX: number,
) {
  const x = p.x - camX;
  ctx.fillStyle = "#3a6fa8";
  ctx.fillRect(x, p.y, p.w, p.h);
  ctx.fillStyle = "#5a9fd4";
  ctx.fillRect(x, p.y, p.w, 5);
  if (p.hasSnow && p.h < 40) {
    ctx.fillStyle = "#e8f4fd";
    ctx.beginPath();
    ctx.ellipse(x + p.w / 2, p.y - 2, p.w / 2, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x + p.w / 2, p.y - 4, p.w / 2.2, 5, 0, 0, Math.PI);
    ctx.fill();
  }
}

function drawGround(ctx: CanvasRenderingContext2D, p: Platform, camX: number) {
  const x = p.x - camX;
  ctx.fillStyle = "#1a4a7a";
  ctx.fillRect(x, p.y, p.w, p.h);
  ctx.strokeStyle = "#2a6aaa";
  ctx.lineWidth = 1;
  for (let i = 0; i < p.w; i += 60) {
    ctx.beginPath();
    ctx.moveTo(x + i, p.y);
    ctx.lineTo(x + i, p.y + p.h);
    ctx.stroke();
  }
  ctx.fillStyle = "#ddf0ff";
  ctx.fillRect(x, p.y, p.w, 10);
  ctx.fillStyle = "#ffffff";
  for (let i = 20; i < p.w; i += 80) {
    ctx.beginPath();
    ctx.ellipse(x + i, p.y + 3, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBlizzard(ctx: CanvasRenderingContext2D, p: Player, camX: number) {
  const x = p.x - camX;
  const y = p.y;
  if (p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0) return;
  ctx.save();
  if (!p.facingRight) {
    ctx.translate(x + p.w, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }
  const wb = p.onGround ? Math.sin(p.walkFrame * 0.3) * 2 : 0;
  ctx.fillStyle = "#f0ede8";
  ctx.beginPath();
  ctx.ellipse(18, 30 + wb, 16, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(18, 11 + wb, 13, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 2 + wb, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(28, 2 + wb, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8c8b8";
  ctx.beginPath();
  ctx.arc(8, 2 + wb, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(28, 2 + wb, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(12, 10 + wb, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(24, 10 + wb, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(13, 9 + wb, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(25, 9 + wb, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a1a1a";
  ctx.beginPath();
  ctx.ellipse(18, 14 + wb, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  const lo = p.onGround ? Math.sin(p.walkFrame * 0.3) * 5 : 0;
  ctx.fillStyle = "#e0ddd8";
  ctx.fillRect(9, 44 + wb - lo, 8, 12);
  ctx.fillRect(20, 44 + wb + lo, 8, 12);
  ctx.fillStyle = "#8B0000";
  ctx.fillRect(6, 19 + wb, 24, 5);
  ctx.fillStyle = "#aa0000";
  ctx.fillRect(6, 19 + wb, 24, 2);
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number) {
  if (!e.alive) return;
  const x = e.x - camX;
  const y = e.y;
  const bob = Math.sin(e.walkFrame * 0.25) * 2;
  ctx.fillStyle = "#7ec8e3";
  ctx.beginPath();
  ctx.ellipse(x + 15, y + 18 + bob, 13, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9ed8f0";
  ctx.beginPath();
  ctx.ellipse(x + 15, y + 5 + bob, 11, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c0e8f8";
  ctx.beginPath();
  ctx.moveTo(x + 7, y - bob);
  ctx.lineTo(x + 5, y - 10 + bob);
  ctx.lineTo(x + 11, y - 1 + bob);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 23, y - bob);
  ctx.lineTo(x + 25, y - 10 + bob);
  ctx.lineTo(x + 19, y - 1 + bob);
  ctx.fill();
  ctx.fillStyle = "#cc2200";
  ctx.beginPath();
  ctx.arc(x + 10, y + 4 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20, y + 4 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  const lo = Math.sin(e.walkFrame * 0.25) * 4;
  ctx.fillStyle = "#6ab8d3";
  ctx.fillRect(x + 6, y + 28 + bob, 7, 9 + lo);
  ctx.fillRect(x + 17, y + 28 + bob, 7, 9 - lo);
}

function drawPip(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  camX: number,
  frame: number,
) {
  const x = px - camX;
  const y = py;
  const wave = Math.sin(frame * 0.04) > 0 ? 1 : -1;
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.ellipse(x + 13, y + 22, 10, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0f0f0";
  ctx.beginPath();
  ctx.ellipse(x + 13, y + 24, 6, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(x + 13, y + 8, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 9, y + 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 17, y + 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(x + 10, y + 7, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18, y + 7, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.moveTo(x + 13, y + 11);
  ctx.lineTo(x + 10, y + 14);
  ctx.lineTo(x + 16, y + 14);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.save();
  ctx.translate(x + 23, y + 18);
  ctx.rotate(wave * 0.4);
  ctx.fillRect(0, 0, 9, 5);
  ctx.restore();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 2, y - 18, 32, 14);
  ctx.fillStyle = "#7ec8e3";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("PIP", x + 13, y - 8);
}

function drawPrincessVix(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  camX: number,
  frame: number,
) {
  const x = cx - camX;
  const y = cy;
  const bob = Math.sin(frame * 0.05) * 3;
  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 26 + bob, 12, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf0";
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 28 + bob, 7, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.arc(x + 16, y + 10 + bob, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf0";
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 12 + bob, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 2 + bob);
  ctx.lineTo(x + 5, y - 7 + bob);
  ctx.lineTo(x + 14, y + 1 + bob);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 2 + bob);
  ctx.lineTo(x + 27, y - 7 + bob);
  ctx.lineTo(x + 18, y + 1 + bob);
  ctx.fill();
  ctx.fillStyle = "#f8d0a0";
  ctx.beginPath();
  ctx.moveTo(x + 9, y + 1 + bob);
  ctx.lineTo(x + 7, y - 4 + bob);
  ctx.lineTo(x + 13, y + bob);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 23, y + 1 + bob);
  ctx.lineTo(x + 25, y - 4 + bob);
  ctx.lineTo(x + 19, y + bob);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(x + 11, y + 10 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 21, y + 10 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 12, y + 9 + bob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 22, y + 9 + bob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 1 + bob);
  ctx.lineTo(x + 9, y - 5 + bob);
  ctx.lineTo(x + 12, y - 1 + bob);
  ctx.lineTo(x + 16, y - 7 + bob);
  ctx.lineTo(x + 20, y - 1 + bob);
  ctx.lineTo(x + 23, y - 5 + bob);
  ctx.lineTo(x + 24, y + 1 + bob);
  ctx.fill();
  ctx.fillStyle = "#ff6680";
  ctx.beginPath();
  ctx.arc(x + 16, y - 8 + bob, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 8, y - 25, 50, 14);
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("PRINCESS VIX", x + 16, y - 15);
}

function drawCastle(ctx: CanvasRenderingContext2D, camX: number) {
  const cx = LEVEL_W - 400;
  const x = cx - camX;
  const baseY = GROUND_Y;
  const castleH = 260;
  ctx.fillStyle = "#2a3560";
  ctx.fillRect(x, baseY - castleH, 200, castleH);
  ctx.fillStyle = "#1a2440";
  for (let i = 0; i < 5; i++)
    ctx.fillRect(x + i * 40, baseY - castleH - 30, 24, 30);
  ctx.fillStyle = "#0d0d1a";
  ctx.beginPath();
  ctx.arc(x + 100, baseY - 50, 35, Math.PI, 0);
  ctx.fillRect(x + 65, baseY - 50, 70, 50);
  ctx.fill();
  ctx.fillStyle = "#7ec8e3";
  ctx.fillRect(x + 30, baseY - castleH + 40, 30, 40);
  ctx.fillRect(x + 140, baseY - castleH + 40, 30, 40);
  ctx.fillRect(x + 85, baseY - castleH + 120, 30, 40);
  ctx.fillStyle = "#1a2440";
  ctx.fillRect(x - 20, baseY - castleH - 40, 50, castleH + 40);
  ctx.fillStyle = "#8B0000";
  ctx.beginPath();
  ctx.moveTo(x - 20, baseY - castleH - 40);
  ctx.lineTo(x + 5, baseY - castleH - 100);
  ctx.lineTo(x + 30, baseY - castleH - 40);
  ctx.fill();
  ctx.fillStyle = "#1a2440";
  ctx.fillRect(x + 170, baseY - castleH - 40, 50, castleH + 40);
  ctx.fillStyle = "#8B0000";
  ctx.beginPath();
  ctx.moveTo(x + 170, baseY - castleH - 40);
  ctx.lineTo(x + 195, baseY - castleH - 100);
  ctx.lineTo(x + 220, baseY - castleH - 40);
  ctx.fill();
  ctx.fillStyle = "#8B0000";
  ctx.fillRect(x + 2, baseY - castleH - 100, 3, 50);
  ctx.fillStyle = "#cc0000";
  ctx.beginPath();
  ctx.moveTo(x + 5, baseY - castleH - 100);
  ctx.lineTo(x + 25, baseY - castleH - 88);
  ctx.lineTo(x + 5, baseY - castleH - 76);
  ctx.fill();
  ctx.fillStyle = "#e8f4fd";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(
      x + i * 40 + 12,
      baseY - castleH - 30,
      16,
      6,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  sf: Snowflake,
  camX: number,
) {
  if (sf.collected) return;
  const x = sf.x - camX + sf.w / 2;
  const y = sf.y + sf.h / 2;
  const r = 8;
  ctx.strokeStyle = "#a8d8f0";
  ctx.lineWidth = 2;
  for (let a = 0; a < 6; a++) {
    const angle = (a * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
    ctx.stroke();
    const bx = x + Math.cos(angle) * r * 0.6;
    const by = y + Math.sin(angle) * r * 0.6;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(angle + 1) * 4, by + Math.sin(angle + 1) * 4);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(168,216,240,0.8)";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  camX: number,
  bgSnow: BgSnowflake[],
) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, "#071528");
  grad.addColorStop(0.5, "#0d2a4a");
  grad.addColorStop(1, "#1a3a6a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const starOffX = camX * 0.05;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  const stars = [
    [100, 40],
    [200, 70],
    [350, 30],
    [480, 90],
    [580, 20],
    [700, 60],
    [50, 110],
    [620, 130],
    [140, 160],
    [400, 50],
    [760, 80],
    [240, 35],
  ];
  for (const [sx, sy] of stars) {
    const rx = (sx - (starOffX % CANVAS_W) + CANVAS_W) % CANVAS_W;
    ctx.beginPath();
    ctx.arc(rx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  const auroraX = camX * 0.1;
  ctx.globalAlpha = 0.12;
  const aurora = ctx.createLinearGradient(0, 60, 0, 200);
  aurora.addColorStop(0, "#00ff88");
  aurora.addColorStop(0.5, "#0088ff");
  aurora.addColorStop(1, "transparent");
  ctx.fillStyle = aurora;
  ctx.beginPath();
  ctx.ellipse(CANVAS_W / 2 - (auroraX % 200), 100, 300, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#c8e8f8";
  for (const s of bgSnow) {
    ctx.globalAlpha = s.opacity;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const mOffX = camX * 0.2;
  ctx.fillStyle = "#0a1e3a";
  const peaks = [0, 120, 240, 320, 440, 540, 680, 800];
  for (let i = 0; i < peaks.length; i++) {
    const mx = (((peaks[i] - mOffX) % CANVAS_W) + CANVAS_W) % CANVAS_W;
    const mh = 80 + (i % 3) * 40;
    ctx.beginPath();
    ctx.moveTo(mx - 60, GROUND_Y - 40);
    ctx.lineTo(mx, GROUND_Y - 40 - mh);
    ctx.lineTo(mx + 60, GROUND_Y - 40);
    ctx.fill();
    ctx.fillStyle = "#d8eef8";
    ctx.beginPath();
    ctx.moveTo(mx - 15, GROUND_Y - 40 - mh + 20);
    ctx.lineTo(mx, GROUND_Y - 40 - mh);
    ctx.lineTo(mx + 15, GROUND_Y - 40 - mh + 20);
    ctx.fill();
    ctx.fillStyle = "#0a1e3a";
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  lives: number,
  timeLeft: number,
) {
  ctx.fillStyle = "rgba(139,0,0,0.85)";
  ctx.fillRect(0, 0, CANVAS_W, 44);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 40, CANVAS_W, 4);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.textAlign = "left";
  ctx.fillText(`\u2744 ${score}`, 16, 28);
  ctx.textAlign = "center";
  ctx.fillText(`\u2665 x${lives}`, CANVAS_W / 2 - 60, 28);
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  ctx.fillText(
    `\u23f1 ${mins}:${secs.toString().padStart(2, "0")}`,
    CANVAS_W / 2 + 60,
    28,
  );
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "10px 'Courier New', monospace";
  ctx.textAlign = "right";
  ctx.fillText("KCP STUDIOS", CANVAS_W - 12, 28);
}

function drawStartScreen(ctx: CanvasRenderingContext2D, frame: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, "#060f1f");
  grad.addColorStop(1, "#0d2a4a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "rgba(200,230,255,0.6)";
  for (let i = 0; i < 30; i++) {
    const sx = (i * 137 + frame * 0.5) % CANVAS_W;
    const sy = (i * 97 + frame * (0.5 + i * 0.02)) % CANVAS_H;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  const pulse = Math.sin(frame * 0.04) * 4;
  ctx.shadowColor = "#5599ff";
  ctx.shadowBlur = 30 + pulse;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 54px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("SAVE THE", CANVAS_W / 2, 140);
  ctx.fillStyle = "#FFD700";
  ctx.fillText("PRINCESS", CANVAS_W / 2, 200);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(200,220,255,0.9)";
  ctx.font = "16px 'Courier New', monospace";
  ctx.fillText("KCP Studios  \u00b7  Now Available!", CANVAS_W / 2, 240);
  const fakePlayer: Player = {
    x: CANVAS_W / 2 - 100,
    y: 280,
    w: 36,
    h: 48,
    vx: 0,
    vy: 0,
    onGround: true,
    alive: true,
    facingRight: true,
    walkFrame: frame,
    invincible: 0,
  };
  drawBlizzard(ctx, fakePlayer, 0);
  drawPrincessVix(ctx, CANVAS_W / 2 + 60, 280, 0, frame);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(CANVAS_W / 2 - 220, 360, 440, 60);
  ctx.fillStyle = "#a8d8f0";
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillText(
    "\u2190 \u2192 / A D  Move   |   SPACE / \u2191  Jump   |   Stomp enemies!",
    CANVAS_W / 2,
    381,
  );
  ctx.fillText(
    "Collect \u2744 snowflakes \u00b7 Rescue Princess Vix from the fortress!",
    CANVAS_W / 2,
    401,
  );
  const blinkAlpha = Math.sin(frame * 0.08) * 0.5 + 0.5;
  ctx.globalAlpha = blinkAlpha;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Courier New', monospace";
  ctx.fillText("\u2014 PRESS SPACE TO START \u2014", CANVAS_W / 2, 450);
  ctx.globalAlpha = 1;
}

function drawWinScreen(
  ctx: CanvasRenderingContext2D,
  score: number,
  frame: number,
) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, "#060f1f");
  grad.addColorStop(1, "#0d2a4a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const colors = ["#FFD700", "#ff88aa", "#88ccff", "#aaffcc"];
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(
      (i * 157 + frame * 2) % CANVAS_W,
      (i * 73 + frame * (0.5 + i * 0.05)) % CANVAS_H,
      3 + (i % 3),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 42px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("YOU SAVED", CANVAS_W / 2, 150);
  ctx.fillText("PRINCESS VIX!", CANVAS_W / 2, 200);
  ctx.shadowBlur = 0;
  drawPrincessVix(ctx, CANVAS_W / 2 - 20, 220, 0, frame);
  const fp: Player = {
    x: CANVAS_W / 2 - 90,
    y: 225,
    w: 36,
    h: 48,
    vx: 0,
    vy: 0,
    onGround: true,
    alive: true,
    facingRight: true,
    walkFrame: frame,
    invincible: 0,
  };
  drawBlizzard(ctx, fp, 0);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px 'Courier New', monospace";
  ctx.fillText(`Final Score: ${score}`, CANVAS_W / 2, 330);
  const blinkAlpha = Math.sin(frame * 0.08) * 0.5 + 0.5;
  ctx.globalAlpha = blinkAlpha;
  ctx.fillStyle = "#a8d8f0";
  ctx.font = "18px 'Courier New', monospace";
  ctx.fillText("Press SPACE to play again", CANVAS_W / 2, 420);
  ctx.globalAlpha = 1;
}

function drawGameOverScreen(
  ctx: CanvasRenderingContext2D,
  score: number,
  frame: number,
) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, "#1a0000");
  grad.addColorStop(1, "#3a0000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 30;
  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 64px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", CANVAS_W / 2, 200);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px 'Courier New', monospace";
  ctx.fillText(`Score: ${score}`, CANVAS_W / 2, 270);
  ctx.fillStyle = "#aaaacc";
  ctx.font = "16px 'Courier New', monospace";
  ctx.fillText("Princess Vix is still waiting...", CANVAS_W / 2, 310);
  const blinkAlpha = Math.sin(frame * 0.08) * 0.5 + 0.5;
  ctx.globalAlpha = blinkAlpha;
  ctx.fillStyle = "#ffcccc";
  ctx.font = "18px 'Courier New', monospace";
  ctx.fillText("Press SPACE to try again", CANVAS_W / 2, 400);
  ctx.globalAlpha = 1;
}

export function SaveThePrincess({ onGameOver }: SaveThePrincessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const stateRef = useRef({
    gameState: "start" as "start" | "playing" | "gameover" | "win",
    player: makePlayer(),
    platforms: [] as Platform[],
    enemies: [] as Enemy[],
    snowflakes: [] as Snowflake[],
    bgSnow: makeBgSnowflakes(),
    camX: 0,
    score: 0,
    lives: 3,
    timeLeft: 300,
    frameCount: 0,
    keys: new Set<string>(),
    lastTime: 0,
    tickAccum: 0,
    pipPlatformIdx: 7,
  });
  const animRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    const initGame = () => {
      const platforms = makePlatforms();
      s.player = makePlayer();
      s.platforms = platforms;
      s.enemies = makeEnemies(platforms);
      s.snowflakes = makeSnowflakes(platforms);
      s.camX = 0;
      s.score = 0;
      s.lives = 3;
      s.timeLeft = 300;
      s.frameCount = 0;
      s.gameState = "playing";
    };

    const handleKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key;
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          " ",
          "a",
          "d",
          "w",
          "A",
          "D",
          "W",
        ].includes(k)
      )
        e.preventDefault();
      if (down) {
        s.keys.add(k);
        if ((k === " " || k === "Enter") && s.gameState !== "playing") {
          if (s.gameState !== "start") onGameOverRef.current(s.score);
          initGame();
        }
      } else {
        s.keys.delete(k);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.focus();

    timerRef.current = setInterval(() => {
      if (s.gameState === "playing") {
        s.timeLeft = Math.max(0, s.timeLeft - 1);
        if (s.timeLeft === 0) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameState = "gameover";
          } else {
            s.timeLeft = 300;
            const p = s.player;
            p.x = 80;
            p.y = GROUND_Y - 50;
            p.vx = 0;
            p.vy = 0;
            p.invincible = 120;
            s.camX = 0;
          }
        }
      }
    }, 1000);

    let jumped = false;

    const tick = () => {
      const p = s.player;
      if (s.gameState !== "playing") return;
      const left =
        s.keys.has("ArrowLeft") || s.keys.has("a") || s.keys.has("A");
      const right =
        s.keys.has("ArrowRight") || s.keys.has("d") || s.keys.has("D");
      const jump =
        s.keys.has(" ") ||
        s.keys.has("ArrowUp") ||
        s.keys.has("w") ||
        s.keys.has("W");
      p.vx = 0;
      if (left) {
        p.vx = -PLAYER_SPEED;
        p.facingRight = false;
      }
      if (right) {
        p.vx = PLAYER_SPEED;
        p.facingRight = true;
      }
      if (jump && p.onGround && !jumped) {
        p.vy = JUMP_FORCE;
        p.onGround = false;
        jumped = true;
      }
      if (!jump) jumped = false;
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 0;
      if (p.x + p.w > LEVEL_W) p.x = LEVEL_W - p.w;
      p.onGround = false;
      for (const plat of s.platforms) {
        if (
          p.x + p.w > plat.x &&
          p.x < plat.x + plat.w &&
          p.y + p.h > plat.y &&
          p.y + p.h < plat.y + plat.h + 12 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
        }
      }
      if (p.y > CANVAS_H + 60) {
        s.lives--;
        if (s.lives <= 0) {
          s.gameState = "gameover";
        } else {
          p.x = Math.max(80, s.camX + 80);
          p.y = GROUND_Y - 80;
          p.vx = 0;
          p.vy = 0;
          p.invincible = 120;
        }
      }
      if (p.vx !== 0 && p.onGround) p.walkFrame++;
      else if (!p.onGround) p.walkFrame = 0;
      if (p.invincible > 0) p.invincible--;
      const targetCam = p.x - CANVAS_W / 3;
      s.camX += (targetCam - s.camX) * 0.15;
      s.camX = Math.max(0, Math.min(LEVEL_W - CANVAS_W, s.camX));
      for (const e of s.enemies) {
        if (!e.alive) continue;
        e.x += e.vx;
        if (e.x <= e.leftBound || e.x + e.w >= e.rightBound) e.vx *= -1;
        e.walkFrame++;
        if (p.invincible > 0) continue;
        if (!rectOverlap(p, e)) continue;
        if (p.vy > 0 && p.y + p.h < e.y + e.h * 0.6) {
          e.alive = false;
          p.vy = JUMP_FORCE * 0.6;
          s.score += 100;
        } else {
          s.lives--;
          p.invincible = 120;
          p.vy = JUMP_FORCE * 0.5;
          if (s.lives <= 0) s.gameState = "gameover";
        }
      }
      for (const sf of s.snowflakes) {
        if (!sf.collected && rectOverlap(p, sf)) {
          sf.collected = true;
          s.score += 10;
        }
      }
      const castleX = LEVEL_W - 400;
      if (p.x + p.w > castleX + 60 && p.x < castleX + 200) s.gameState = "win";
    };

    const render = (timestamp: number) => {
      s.frameCount++;
      for (const bs of s.bgSnow) {
        bs.y += bs.speed;
        if (bs.y > CANVAS_H) {
          bs.y = -5;
          bs.x = Math.random() * CANVAS_W;
        }
      }
      if (s.gameState === "start") {
        drawStartScreen(ctx, s.frameCount);
      } else if (s.gameState === "gameover") {
        drawGameOverScreen(ctx, s.score, s.frameCount);
      } else if (s.gameState === "win") {
        drawWinScreen(ctx, s.score, s.frameCount);
      } else {
        const dt = Math.min(timestamp - s.lastTime, 50);
        s.tickAccum += dt;
        const TICK_MS = 1000 / 60;
        while (s.tickAccum >= TICK_MS) {
          tick();
          s.tickAccum -= TICK_MS;
        }
        drawBackground(ctx, s.camX, s.bgSnow);
        drawGround(ctx, s.platforms[0], s.camX);
        for (let i = 1; i < s.platforms.length; i++)
          drawPlatform(ctx, s.platforms[i], s.camX);
        drawCastle(ctx, s.camX);
        drawPrincessVix(
          ctx,
          LEVEL_W - 400 + 90,
          GROUND_Y - 70,
          s.camX,
          s.frameCount,
        );
        if (s.platforms.length > s.pipPlatformIdx) {
          const pp = s.platforms[s.pipPlatformIdx];
          drawPip(ctx, pp.x + pp.w / 2 - 13, pp.y - 40, s.camX, s.frameCount);
        }
        for (const sf of s.snowflakes) drawSnowflake(ctx, sf, s.camX);
        for (const e of s.enemies) drawEnemy(ctx, e, s.camX);
        drawBlizzard(ctx, s.player, s.camX);
        drawHUD(ctx, s.score, s.lives, s.timeLeft);
      }
      s.lastTime = timestamp;
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        tabIndex={0}
        data-ocid="game.canvas_target"
        className="rounded-lg outline-none"
        style={{
          maxWidth: "100%",
          border: "3px solid #8B0000",
          boxShadow: "0 0 40px rgba(139,0,0,0.4), 0 0 80px rgba(0,50,100,0.3)",
          cursor: "default",
        }}
      />
      <p className="text-center text-xs text-slate-400 font-mono">
        Click the game then use Arrow Keys / WASD to move \u00b7 SPACE to jump
      </p>
    </div>
  );
}
