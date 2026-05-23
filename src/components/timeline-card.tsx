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
  const props = { style: { width: 14, height: 14 } };
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

export function TimelineCard({ entry, side }: { entry: TimelineEntry; side: "above" | "below" }) {
  const [expanded, setExpanded] = useState(false);

  const typeCfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.Movie;
  const hasDetail = entry.description || entry.creator || entry.note || entry.status;

  const compactSection = (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
        <Clock style={{ width: 11, height: 11, color: "var(--muted-foreground)" }} />
        <span style={{ fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>
          {entry.date}
        </span>
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          fontSize: 9,
          color: typeCfg.color,
          background: typeCfg.bg,
          padding: "2px 6px",
          letterSpacing: "0.1em",
          marginBottom: 4,
        }}
      >
        <TypeIcon type={entry.type} />
        {typeCfg.label}
      </span>
      <div
        style={{
          fontSize: 11,
          color: expanded ? "var(--foreground)" : "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          lineHeight: 1.3,
          textShadow: expanded ? "0 0 4px var(--primary)" : "none",
          marginTop: 2,
          wordBreak: "break-word",
        }}
      >
        {entry.title}
      </div>
    </div>
  );

  const detailSection = (
    <motion.div
      initial={false}
      animate={{
        height: expanded && hasDetail ? "auto" : 0,
        opacity: expanded && hasDetail ? 1 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }}>
        {entry.status && (
          <div style={{ fontSize: 9, color: "#ff6b6b", letterSpacing: "0.1em", marginTop: 6, marginBottom: 3 }}>
            {entry.status.toUpperCase()}
          </div>
        )}
        {entry.creator && (
          <div style={{ fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em", marginBottom: 3 }}>
            {entry.creator.toUpperCase()}
          </div>
        )}
        {entry.description && (
          <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4, letterSpacing: "0.04em" }}>
            {entry.description}
          </div>
        )}
        {entry.note && (
          <div style={{ fontSize: 9, color: "var(--muted-foreground)", fontStyle: "italic", letterSpacing: "0.06em", marginTop: 3 }}>
            [{entry.note}]
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onTap={() => setExpanded((e) => !e)}
      style={{
        width: 280,
        background: "var(--card)",
        border: `1px solid ${expanded ? "var(--primary)" : "var(--border)"}`,
        boxShadow: expanded
          ? "0 0 20px color-mix(in srgb, var(--primary) 20%, transparent)"
          : "0 0 6px rgba(0,0,0,0.3)",
        fontFamily: font,
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      {side === "above" ? (
        <>
          {detailSection}
          {compactSection}
          <div
            style={{
              width: 0,
              height: 0,
              alignSelf: "center",
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "14px solid var(--card)",
              marginTop: -1,
              flexShrink: 0,
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              width: 0,
              height: 0,
              alignSelf: "center",
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "14px solid var(--card)",
              marginBottom: -1,
              flexShrink: 0,
            }}
          />
          {compactSection}
          {detailSection}
        </>
      )}
    </motion.div>
  );
}
