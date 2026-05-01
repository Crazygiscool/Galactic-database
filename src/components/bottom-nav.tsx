import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Film,
  Users,
  Rocket,
  Truck,
  Bone,
  Bot,
  MapPin,
  Shield,
  Sparkles,
  Search,
  Palette,
  X,
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

interface BottomNavProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
}

const THEMES: { key: Theme; label: string; color: string }[] = [
  { key: "imperial", label: "IMPERIAL", color: "#00d4ff" },
  { key: "sith", label: "SITH", color: "#ff3333" },
  { key: "jedi", label: "JEDI", color: "#33ff66" },
  { key: "rebellion", label: "REBELLION", color: "#ff9933" },
  { key: "hutt", label: "HUTT", color: "#9933ff" },
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

export function BottomNav({
  activeSection,
  onSectionChange,
}: BottomNavProps) {
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<Section | null>(null);

  return (
    <div
      className="bottom-bar-glass"
      style={{
        display: "flex",
        alignItems: "flex-end",
        paddingTop: isMobile ? 8 : 0,
        paddingBottom: isMobile ? "calc(env(safe-area-inset-bottom) + 34px)" : 0,
        paddingLeft: isMobile ? 0 : 16,
        paddingRight: isMobile ? 0 : 16,
        position: "relative",
        zIndex: 30,
        fontFamily: "'Share Tech Mono', monospace",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          gap: isMobile ? 0 : 4,
          paddingLeft: isMobile ? 8 : 0,
          paddingRight: isMobile ? 8 : 0,
          flex: 1,
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.key;
          const hovered = hoveredItem === item.key;
          const Icon = item.icon;
          const showLabel = active || hovered;

          return (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              onMouseEnter={() => !isMobile && setHoveredItem(item.key)}
              onMouseLeave={() => !isMobile && setHoveredItem(null)}
              onTouchStart={() => setHoveredItem(item.key)}
              onTouchEnd={() => setHoveredItem(null)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? (active ? 2 : 1) : 3,
                padding: isMobile ? "8px 0" : "6px 12px",
                minWidth: isMobile ? 60 : 52,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                color: active ? "var(--primary)" : "var(--muted-foreground)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: isMobile ? 9 : 9,
                letterSpacing: "0.03em",
                textShadow: active ? "0 0 8px var(--primary)" : "none",
                transition: "color 0.2s, text-shadow 0.2s",
                flexShrink: 0,
                scrollSnapAlign: "center",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isMobile ? 20 : 24,
                    height: 3,
                    borderRadius: 2,
                    background: "var(--primary)",
                    boxShadow: "0 0 8px var(--primary)",
                  }}
                />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                <Icon
                  style={{
                    width: isMobile ? 22 : 20,
                    height: isMobile ? 22 : 20,
                    transition: "transform 0.2s",
                    transform: active ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </div>
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  whiteSpace: "nowrap",
                  fontSize: isMobile ? 8 : 8,
                  opacity: active ? 1 : 0.7,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TopBar({
  search,
  onSearchChange,
  theme,
  onThemeChange,
  globalSearchResults,
  onGlobalSearchSelect,
  showGlobalResults,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  globalSearchResults: { id: string; name: string; section: string }[];
  onGlobalSearchSelect: (result: { id: string; name: string; section: string }) => void;
  showGlobalResults: boolean;
}) {
  const isMobile = useIsMobile();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const currentTheme = THEMES.find((t) => t.key === theme) ?? THEMES[0];

  if (isMobile) {
    return (
      <div
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          fontFamily: "'Share Tech Mono', monospace",
          flexShrink: 0,
          boxShadow:
            "0 2px 20px color-mix(in srgb, var(--primary) 8%, transparent)",
          position: "relative",
          zIndex: 30,
          paddingTop: "calc(env(safe-area-inset-top) + 8px)",
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: 40, gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--primary)",
              textShadow: "0 0 8px var(--primary)",
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}
          >
            GALACTIC DB
          </span>

        <div
          ref={(el) => {
            // Store ref for positioning
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            marginLeft: 12,
            marginRight: 4,
            background: "var(--muted)",
            borderRadius: 8,
            padding: "0 8px",
            height: 28,
            border: "1px solid var(--border)",
            position: "relative",
          }}
        >
          <Search
            style={{
              width: 12,
              height: 12,
              color: "var(--muted-foreground)",
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--foreground)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.06em",
              padding: "0 6px",
              caretColor: "var(--primary)",
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
                  color: "var(--muted-foreground)",
                  padding: 2,
                }}
              >
                <X style={{ width: 11, height: 11 }} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGlobalResults && globalSearchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  maxHeight: "50vh",
                  overflowY: "auto",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  zIndex: 100,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 9,
                    color: "var(--muted-foreground)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Search size={12} />
                  {globalSearchResults.length} RESULTS FOUND
                </div>
                {globalSearchResults.map((result, i) => (
                  <button
                    key={`${result.section}-${result.id}`}
                    onClick={() => onGlobalSearchSelect(result)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom:
                        i < globalSearchResults.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary-foreground)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--foreground)";
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--muted-foreground)",
                        textTransform: "uppercase",
                        minWidth: 80,
                      }}
                    >
                      {result.section}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--foreground)",
                        fontFamily: "'Share Tech Mono', monospace",
                      }}
                    >
                      {result.name}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: currentTheme.color,
              padding: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Change Theme"
          >
            <Palette size={18} style={{ color: currentTheme.color }} />
          </button>
        </div>

        <AnimatePresence>
          {showThemeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderTop: "none",
                zIndex: 100,
                maxHeight: "50vh",
                overflowY: "auto",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 9,
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.1em",
                }}
              >
                SELECT THEME
              </div>
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
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    background:
                      theme === t.key
                        ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                        : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    color: t.color,
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
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
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 44,
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        fontFamily: "'Share Tech Mono', monospace",
        flexShrink: 0,
        boxShadow: "0 2px 20px color-mix(in srgb, var(--primary) 8%, transparent)",
        position: "relative",
        zIndex: 30,
      }}
    >
      <div
        style={{
          padding: "0 20px",
          borderRight: "1px solid var(--border)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "var(--primary)",
            textShadow: "0 0 8px var(--primary)",
            letterSpacing: "0.18em",
            whiteSpace: "nowrap",
          }}
        >
          GALACTIC DATABASE
        </div>
      </div>

      <div
        style={{
          flex:1,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          position: "relative",
        }}
      >
        <Search
          style={{
            width: 14,
            height: 14,
            color: "var(--muted-foreground)",
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
            color: "var(--foreground)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            padding: "0 10px",
            caretColor: "var(--primary)",
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
                color: "var(--muted-foreground)",
                padding: 2,
              }}
            >
              <X style={{ width: 12, height: 12 }} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGlobalResults && globalSearchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 8,
                width: 400,
                maxHeight: "50vh",
                overflowY: "auto",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                zIndex: 100,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Search size={12} />
                {globalSearchResults.length} RESULTS FOUND
              </div>
              {globalSearchResults.map((result, i) => (
                <button
                  key={`${result.section}-${result.id}`}
                  onClick={() => onGlobalSearchSelect(result)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      i < globalSearchResults.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary-foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      minWidth: 80,
                    }}
                  >
                    {result.section}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--foreground)",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {result.name}
                  </span>
                </button>
              ))}
            </motion.div>
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
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: 8,
                  zIndex: 100,
                  minWidth: 150,
                  backdropFilter: "blur(20px)",
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
                          ? "color-mix(in srgb, var(--primary) 15%, transparent)"
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
                      e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 10%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === t.key
                          ? "color-mix(in srgb, var(--primary) 15%, transparent)"
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
