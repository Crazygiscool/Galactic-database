import { useState } from "react";
import { motion } from "framer-motion";
import { TimelineEntry } from "@/data/timeline";
import {
  Film,
  Monitor,
  BookOpen,
  BookMarked,
  Headphones,
  Gamepad2,
  BookText,
  Clock,
  Sparkles,
} from "lucide-react";

const font = "'Share Tech Mono', monospace";

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Movie: { color: "var(--primary)", bg: "color-mix(in srgb, var(--primary) 15%, transparent)", label: "FILM" },
  Series: { color: "#6bcb77", bg: "color-mix(in srgb, #6bcb77 15%, transparent)", label: "SERIES" },
  Novel: { color: "#4d96ff", bg: "color-mix(in srgb, #4d96ff 15%, transparent)", label: "NOVEL" },
  Comic: { color: "#ffd93d", bg: "color-mix(in srgb, #ffd93d 15%, transparent)", label: "COMIC" },
  "Audio Drama": { color: "#9b59b6", bg: "color-mix(in srgb, #9b59b6 15%, transparent)", label: "AUDIO" },
  Game: { color: "#e67e22", bg: "color-mix(in srgb, #e67e22 15%, transparent)", label: "GAME" },
  Reference: { color: "#95a5a6", bg: "color-mix(in srgb, #95a5a6 15%, transparent)", label: "REF" },
  Upcoming: { color: "#ff6b6b", bg: "color-mix(in srgb, #ff6b6b 15%, transparent)", label: "UPCOMING" },
  Phase: { color: "var(--muted-foreground)", bg: "transparent", label: "" },
};

function TypeIcon({ type }: { type: string }) {
  const props = { style: { width: 12, height: 12 } };
  switch (type) {
    case "Movie": return <Film {...props} />;
    case "Series": return <Monitor {...props} />;
    case "Novel": return <BookOpen {...props} />;
    case "Comic": return <BookMarked {...props} />;
    case "Audio Drama": return <Headphones {...props} />;
    case "Game": return <Gamepad2 {...props} />;
    case "Reference": return <BookText {...props} />;
    case "Upcoming": return <Sparkles {...props} />;
    default: return null;
  }
}

export function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const [expanded, setExpanded] = useState(false);

  const isPhase = entry.type === "Phase";

  if (isPhase) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ width: 1, height: 16, background: "var(--primary)", opacity: 0.4 }} />
        <span
          style={{
            fontSize: 9,
            color: "var(--muted-foreground)",
            fontFamily: font,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {entry.title}{entry.description ? ` — ${entry.description}` : ""}
        </span>
      </div>
    );
  }

  const typeCfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.Movie;
  const hasDetail = entry.description || entry.creator || entry.note || entry.status;

  return (
    <motion.div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onTap={() => setExpanded((e) => !e)}
      style={{
        width: expanded ? 260 : 200,
        background: "var(--card)",
        border: `1px solid ${expanded ? "var(--primary)" : "var(--border)"}`,
        boxShadow: expanded
          ? "0 0 20px color-mix(in srgb, var(--primary) 20%, transparent)"
          : "0 0 8px rgba(0,0,0,0.3)",
        fontFamily: font,
        cursor: "pointer",
        flexShrink: 0,
        transition: "width 0.25s ease, border-color 0.25s, box-shadow 0.25s",
      }}
    >
      <div style={{ padding: "8px 10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 4,
          }}
        >
          <Clock style={{ width: 10, height: 10, color: "var(--muted-foreground)" }} />
          <span
            style={{
              fontSize: 9,
              color: "var(--muted-foreground)",
              letterSpacing: "0.08em",
            }}
          >
            {entry.date}
          </span>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 8,
            color: typeCfg.color,
            background: typeCfg.bg,
            padding: "1px 5px",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          <TypeIcon type={entry.type} />
          {typeCfg.label}
        </span>

        <div
          style={{
            fontSize: expanded ? 11 : 10,
            color: "var(--foreground)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.3,
            textShadow: expanded ? "0 0 4px var(--primary)" : "none",
            marginTop: 2,
          }}
        >
          {entry.title}
        </div>

        <motion.div
          initial={false}
          animate={{
            height: expanded && hasDetail ? "auto" : 0,
            opacity: expanded && hasDetail ? 1 : 0,
            marginTop: expanded && hasDetail ? 6 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {entry.status && (
            <div
              style={{
                fontSize: 8,
                color: "#ff6b6b",
                letterSpacing: "0.1em",
                marginBottom: 3,
              }}
            >
              {entry.status.toUpperCase()}
            </div>
          )}

          {entry.creator && (
            <div
              style={{
                fontSize: 8,
                color: "var(--muted-foreground)",
                letterSpacing: "0.08em",
                marginBottom: 3,
              }}
            >
              {entry.creator.toUpperCase()}
            </div>
          )}

          {entry.description && (
            <div
              style={{
                fontSize: 9,
                color: "var(--muted-foreground)",
                lineHeight: 1.4,
                letterSpacing: "0.04em",
              }}
            >
              {entry.description}
            </div>
          )}

          {entry.note && (
            <div
              style={{
                fontSize: 8,
                color: "var(--muted-foreground)",
                fontStyle: "italic",
                letterSpacing: "0.06em",
                marginTop: 2,
              }}
            >
              [{entry.note}]
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
