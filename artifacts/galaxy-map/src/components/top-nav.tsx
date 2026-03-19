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
} from "lucide-react";
import { Section } from "@/hooks/use-swapi";

interface TopNavProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "planets", label: "PLANETS", icon: Globe },
  { key: "films", label: "FILMS", icon: Film },
  { key: "characters", label: "CHARACTERS", icon: Users },
  { key: "starships", label: "STARSHIPS", icon: Rocket },
  { key: "vehicles", label: "VEHICLES", icon: Truck },
  { key: "creatures", label: "CREATURES", icon: Bone },
  { key: "droids", label: "DROIDS", icon: Bot },
  { key: "organizations", label: "GROUPS", icon: Shield },
  { key: "species", label: "SPECIES", icon: Sparkles },
];

const C = {
  bar: "rgba(0,8,20,0.97)",
  border: "rgba(0,212,255,0.18)",
  active: "#00d4ff",
  activeBg: "rgba(0,212,255,0.10)",
  inactive: "rgba(0,212,255,0.42)",
  font: "'Share Tech Mono', monospace",
};

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
}: TopNavProps) {
  const isMobile = useIsMobile();
  const activeItem = NAV_ITEMS.find((i) => i.key === activeSection)!;
  const ActiveIcon = activeItem.icon;

  if (isMobile) {
    return (
      <div
        style={{
          background: C.bar,
          borderBottom: `1px solid ${C.border}`,
          fontFamily: C.font,
          flexShrink: 0,
          boxShadow: "0 2px 20px rgba(0,212,255,0.08)",
          position: "relative",
          zIndex: 30,
        }}
      >
        {/* Row 1: logo + dropdown */}
        <div style={{ display: "flex", alignItems: "center", height: 48 }}>
          <div
            style={{
              padding: "0 14px",
              borderRight: `1px solid ${C.border}`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#00d4ff",
                textShadow: "0 0 8px #00d4ff",
                letterSpacing: "0.16em",
              }}
            >
              ◈ GALACTIC
            </span>
          </div>

          {/* Styled native select — most touch-friendly */}
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
                color: C.active,
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
                color: C.active,
                fontFamily: C.font,
                fontSize: 12,
                letterSpacing: "0.14em",
                cursor: "pointer",
                textShadow: "0 0 6px #00d4ff",
              }}
            >
              {NAV_ITEMS.map((item) => (
                <option
                  key={item.key}
                  value={item.key}
                  style={{
                    background: "#000c1a",
                    color: "#00d4ff",
                    fontFamily: C.font,
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
                color: C.inactive,
                flexShrink: 0,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Row 2: search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${C.border}`,
            padding: "0 12px",
            height: 40,
          }}
        >
          <Search
            style={{
              width: 13,
              height: 13,
              color: "rgba(0,212,255,0.5)",
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
              color: "#00d4ff",
              fontFamily: C.font,
              fontSize: 11,
              letterSpacing: "0.08em",
              padding: "0 8px",
              caretColor: "#00d4ff",
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
                  color: "rgba(0,212,255,0.5)",
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

  /* ── Desktop layout ── */
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 52,
        background: C.bar,
        borderBottom: `1px solid ${C.border}`,
        fontFamily: C.font,
        flexShrink: 0,
        boxShadow: "0 2px 20px rgba(0,212,255,0.08)",
        position: "relative",
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "0 20px",
          borderRight: `1px solid ${C.border}`,
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#00d4ff",
            textShadow: "0 0 8px #00d4ff",
            letterSpacing: "0.18em",
            whiteSpace: "nowrap",
          }}
        >
          ◈ GALACTIC DATABASE
        </div>
      </div>

      {/* Nav tabs with sliding indicator */}
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
                background: active ? C.activeBg : "transparent",
                color: active ? C.active : C.inactive,
                border: "none",
                borderBottom: "2px solid transparent",
                fontFamily: C.font,
                fontSize: 11,
                letterSpacing: "0.15em",
                textShadow: active ? "0 0 8px #00d4ff" : "none",
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
                    background: "#00d4ff",
                    boxShadow: "0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderLeft: `1px solid ${C.border}`,
        }}
      >
        <Search
          style={{
            width: 14,
            height: 14,
            color: "rgba(0,212,255,0.5)",
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
            color: "#00d4ff",
            fontFamily: C.font,
            fontSize: 12,
            letterSpacing: "0.1em",
            padding: "0 10px",
            caretColor: "#00d4ff",
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
                color: "rgba(0,212,255,0.5)",
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
