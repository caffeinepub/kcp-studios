import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export function AdminLogin() {
  const { login } = useAdmin();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(code);
    if (ok) {
      window.location.hash = "#admin";
    } else {
      setError("Invalid access code. Entry denied.");
      setCode("");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0a0a0f" }}
      data-ocid="admin.login.panel"
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md mx-4 ${shake ? "animate-shake" : ""}`}
        style={{
          background: "rgba(15,5,5,0.98)",
          border: "1px solid rgba(139,0,0,0.3)",
          borderRadius: "16px",
          boxShadow: "0 0 60px rgba(139,0,0,0.15), 0 24px 80px rgba(0,0,0,0.8)",
          padding: "48px 40px",
        }}
      >
        {/* Logo area */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/assets/uploads/Screenshot-2026-03-14-at-2.50.38-PM-1.png"
            alt="KCP Studios"
            className="h-14 w-auto object-contain mb-6"
          />
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} style={{ color: "#8B0000" }} />
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: "rgba(139,0,0,0.9)" }}
            >
              Restricted Area
            </span>
            <Shield size={18} style={{ color: "#8B0000" }} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="access-code"
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Access Code
            </Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(139,0,0,0.7)" }}
              />
              <Input
                id="access-code"
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin access code"
                className="pl-10 font-mono"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: error
                    ? "1px solid rgba(255,60,60,0.6)"
                    : "1px solid rgba(139,0,0,0.3)",
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.1em",
                }}
                data-ocid="admin.login.input"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium"
              style={{ color: "#ff6060" }}
              data-ocid="admin.login.error_state"
            >
              ⚠ {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full font-bold tracking-widest uppercase"
            style={{
              background: "#8B0000",
              boxShadow: "0 4px 24px rgba(139,0,0,0.4)",
            }}
            data-ocid="admin.login.submit_button"
          >
            Authenticate
          </Button>
        </form>

        <p
          className="text-center text-xs mt-8"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Unauthorized access attempts are logged.
        </p>
      </motion.div>
    </div>
  );
}
