import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

const font = "'Share Tech Mono', monospace";

export function UserMenu() {
  const { user, session, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: 4,
          fontFamily: font,
          fontSize: 10,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          cursor: "pointer",
        }}
      >
        <User style={{ width: 14, height: 14 }} />
        ACCESS TERMINAL
      </button>
    );
  }

  const factionColors: Record<string, { primary: string; secondary: string }> = {
    jedi: { primary: "#3b82f6", secondary: "#dbeafe" },
    sith: { primary: "#ef4444", secondary: "#fef2f2" },
    rebel: { primary: "#eab308", secondary: "#fef9c3" },
    empire: { primary: "#6b7280", secondary: "#f3f4f6" },
    mandalorian: { primary: "#14b8a6", secondary: "#ccfbf1" },
    neutral: { primary: "#0d9488", secondary: "#ccfbf1" },
  };

  const colors = factionColors[user.faction || "neutral"] || factionColors.neutral;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 8px 4px 4px",
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 4,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        {user.image ? (
          <img src={user.image} alt={user.name} style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${colors.primary}` }} />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: "bold",
              color: "white",
              textTransform: "uppercase",
              border: `2px solid ${colors.primary}`,
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <span style={{ fontSize: 11, color: "var(--foreground)", fontFamily: font, maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.name}
        </span>
        <ChevronDown style={{ width: 12, height: 12, color: "var(--muted-foreground)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 8,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 8,
              minWidth: 220,
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--foreground)", fontFamily: font, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {user.name}
              </p>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={() => { navigate("/profile"); setOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <User style={{ width: 16, height: 16, color: "var(--primary)" }} />
              DOSSIER
            </button>
            <button
              onClick={() => { navigate("/profile?tab=settings"); setOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Settings style={{ width: 16, height: 16, color: "var(--primary)" }} />
              SETTINGS
            </button>
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <button
              onClick={async () => { await signOut(); setOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 4,
                color: "#ef4444",
                fontFamily: font,
                fontSize: 11,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <LogOut style={{ width: 16, height: 16 }} />
              SIGN OUT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}