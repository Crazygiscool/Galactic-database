import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Github, Mail, Lock, User, Star, UserPlus } from "lucide-react";

const font = "'Share Tech Mono', monospace";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [faction, setFaction] = useState("neutral");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const FACTIONS = [
    { id: "jedi", label: "Jedi Order", color: "#3b82f6" },
    { id: "sith", label: "Sith Empire", color: "#ef4444" },
    { id: "rebel", label: "Rebel Alliance", color: "#eab308" },
    { id: "empire", label: "Galactic Empire", color: "#6b7280" },
    { id: "mandalorian", label: "Mandalorian Clans", color: "#14b8a6" },
    { id: "neutral", label: "Neutral", color: "#0d9488" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (!name.trim()) {
        setError("Callsign is required");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, name.trim(), faction);
      if (result.error) setError(result.error);
    }
    setLoading(false);
  };

  const handleSocialSignIn = async (provider: "github" | "google" | "discord") => {
    setLoading(true);
    await signInWithProvider(provider);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        fontFamily: font,
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "40px 32px",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Star style={{ width: 48, height: 48, color: "var(--primary)", margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: 24, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
            GALACTIC DATABASE
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {mode === "login" ? "TERMINAL ACCESS REQUIRED" : "NEW RECRUIT REGISTRATION"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: font,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <div>
              <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                FACTION ALLEGIANCE
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {FACTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFaction(f.id)}
                    style={{
                      padding: "10px 8px",
                      border: `2px solid ${faction === f.id ? f.color : "var(--border)"}`,
                      background: faction === f.id ? `${f.color}20` : "var(--muted)",
                      borderRadius: 4,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: f.color,
                      }}
                    />
                    <span style={{ fontSize: 9, color: faction === f.id ? f.color : "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "register" && (
            <div>
              <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                CALLSIGN (DISPLAY NAME)
              </label>
              <div style={{ position: "relative" }}>
                <UserPlus style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--muted-foreground)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Commander Rex"
                  required
                  autoComplete="name"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 42px",
                    background: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    color: "var(--foreground)",
                    fontFamily: font,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              TRANSMISSION FREQUENCY (EMAIL)
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--muted-foreground)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilot@rebellion.org"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 42px",
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--foreground)",
                  fontFamily: font,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              ENCRYPTION KEY (PASSWORD)
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--muted-foreground)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 42px",
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--foreground)",
                  fontFamily: font,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                CONFIRM ENCRYPTION KEY
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--muted-foreground)" }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 42px",
                    background: "var(--muted)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    color: "var(--foreground)",
                    fontFamily: font,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              borderRadius: 4,
              fontFamily: font,
              fontSize: 12,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.2s",
              marginTop: 8,
            }}
          >
            {loading ? "PROCESSING..." : mode === "login" ? "ESTABLISH LINK" : "ENLIST"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 10, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={loading}
              style={{
                padding: "10px 16px",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 11,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <Github style={{ width: 16, height: 16 }} /> GITHUB
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              style={{
                padding: "10px 16px",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 11,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <Mail style={{ width: 16, height: 16 }} /> GOOGLE
            </button>
          </div>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "var(--muted-foreground)" }}>
          {mode === "login" ? "NO ACCESS CODE? " : "ALREADY ENLISTED? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontFamily: font,
              fontSize: 11,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {mode === "login" ? "ENLIST NOW" : "ACCESS TERMINAL"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}