import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Film,
  User,
  Rocket,
  Truck,
  X,
  ChevronDown,
  Users,
  Bone,
  Bot,
  MapPin,
  Shield,
  Sparkles,
  Palette,
} from "lucide-react";
import { Section } from "@/hooks/use-swapi";

export type Theme =
  | "imperial"
  | "sith"
  | "jedi"
  | "rebellion"
  | "hutt"
  | "mandalorian"
  | "ahsoka";

interface TopNavProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  search: string;
  onSearchChange: (v: string) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

const THEMES: { key: Theme; label: string; color: string }[] = [
  { key: "imperial", label: "IMPERIAL", color: "#00d4ff" },
  { key: "sith", label: "SITH", color: "#ff3333" },
  { key: "jedi", label: "JEDI", color: "#33ff66" },
  { key: "rebellion", label: "REBELLION", color: "#ff9933" },
  { key: "hutt", label: " HUTT", color: "#9933ff" },
  { key: "mandalorian", label: "MANDALORIAN", color: "#999999" },
  { key: "ahsoka", label: "AHSOKA", color: "#ffdd33" },
];

const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "planets", label: "PLANETS", icon: Globe },
  { key: "films", label: "FILMS", icon: Film },
  { key: "characters", label: "CHARACTERS", icon: Users },
  { key: "starships", label: "STARSHIPS", icon: Rocket },
  { key: "vehicles", label: "VEHICLES", icon: Truck },
  { key: "creatures", label: "CREATURES", icon: Bone },
  { key: "droids", label: "DROIDS", icon: Bot },
  { key: "locations", label: "LOCATIONS", icon: MapPin },
  { key: "organizations", label: "GROUPS", icon: Shield },
  { key: "species", label: "SPECIES", icon: Sparkles },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

export function TopNav({
  activeSection,
  onSectionChange,
  search,
  onSearchChange,
  theme,
  onThemeChange,
}: TopNavProps) {
  const isMobile = useIsMobile();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const currentTheme = THEMES.find((t) => t.key === theme) ?? THEMES[0];
  const activeItem = NAV_ITEMS.find((i) => i.key === activeSection)!;
  const ActiveIcon = activeItem.icon;

  if (isMobile) {
    return (
      <div
        style={{
          background: "hsl(var(--card))",
          borderBottom: "1px solid hsl(var(--border))",
          fontFamily: "'Share Tech Mono', monospace",
          flexShrink: 0,
          boxShadow: "0 2px 20px hsl(var(--primary)/0.08)",
          position: "relative",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: 48 }}>
          <div
            style={{
              padding: "0 14px",
              borderRight: "1px solid hsl(var(--border))",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "hsl(var(--primary))",
                textShadow: "0 0 8px hsl(var(--primary))",
                letterSpacing: "0.16em",
              }}
            >
              GALACTIC
            </span>
          </div>

          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            <ActiveIcon
              style={{
                width: 13,
                height: 13,
                color: "hsl(var(--primary))",
                flexShrink: 0,
                marginRight: 8,
              }}
            />
            <select
              value={activeSection}
              onChange={(e) => onSectionChange(e.target.value as Section)}
              style={{
                flex: 1,
                appearance: "none",
                WebkitAppearance: "none",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "hsl(var(--primary))",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.14em",
                cursor: "pointer",
                textShadow: "0 0 6px hsl(var(--primary))",
              }}
            >
              {NAV_ITEMS.map((item) => (
                <option
                  key={item.key}
                  value={item.key}
                  style={{
                    background: "hsl(var(--background))",
                    color: "hsl(var(--primary))",
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              style={{
                width: 13,
                height: 13,
                color: "hsl(var(--muted-foreground))",
                flexShrink: 0,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid hsl(var(--border))",
            padding: "0 12px",
            height: 40,
          }}
        >
          <Search
            style={{
              width: 13,
              height: 13,
              color: "hsl(var(--muted-foreground))",
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH DATABASE..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "hsl(var(--foreground))",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              padding: "0 8px",
              caretColor: "hsl(var(--primary))",
            }}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                key="clear-mobile"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => onSearchChange("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "hsl(var(--muted-foreground))",
                  padding: 2,
                }}
              >
                <X style={{ width: 12, height: 12 }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 52,
        background: "hsl(var(--card))",
        borderBottom: "1px solid hsl(var(--border))",
        fontFamily: "'Share Tech Mono', monospace",
        flexShrink: 0,
        boxShadow: "0 2px 20px hsl(var(--primary)/0.08)",
        position: "relative",
        zIndex: 30,
      }}
    >
      <div
        style={{
          padding: "0 20px",
          borderRight: "1px solid hsl(var(--border))",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "hsl(var(--primary))",
            textShadow: "0 0 8px hsl(var(--primary))",
            letterSpacing: "0.18em",
            whiteSpace: "nowrap",
          }}
        >
          GALACTIC DATABASE
        </div>
      </div>

      <div style={{ display: "flex", height: "100%", flexShrink: 0 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 18px",
                height: "100%",
                cursor: "pointer",
                background: active ? "hsl(var(--primary)/0.1)" : "transparent",
                color: active
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
                border: "none",
                borderBottom: "2px solid transparent",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textShadow: active ? "0 0 8px hsl(var(--primary))" : "none",
                transition: "color 0.2s, background 0.2s, text-shadow 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "hsl(var(--primary))",
                    boxShadow:
                      "0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--primary)/0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderLeft: "1px solid hsl(var(--border))",
        }}
      >
        <Search
          style={{
            width: 14,
            height: 14,
            color: "hsl(var(--muted-foreground))",
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH DATABASE..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "hsl(var(--foreground))",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            padding: "0 10px",
            caretColor: "hsl(var(--primary))",
          }}
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => onSearchChange("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "hsl(var(--muted-foreground))",
                padding: 2,
              }}
            >
              <X style={{ width: 12, height: 12 }} />
            </motion.button>
          )}
        </AnimatePresence>

        <div style={{ position: "relative", marginLeft: 12 }}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: currentTheme.color,
              padding: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
            }}
            title="Change Theme"
          >
            <Palette size={14} style={{ color: currentTheme.color }} />
            {currentTheme.label}
          </button>
          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 4,
                  padding: 8,
                  zIndex: 100,
                  minWidth: 150,
                }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      onThemeChange(t.key);
                      setShowThemeMenu(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "8px 12px",
                      background:
                        theme === t.key
                          ? "hsl(var(--primary)/0.15)"
                          : "transparent",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      color: t.color,
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "hsl(var(--primary)/0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === t.key
                          ? "hsl(var(--primary)/0.15)"
                          : "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: t.color,
                        boxShadow: `0 0 8px ${t.color}`,
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
