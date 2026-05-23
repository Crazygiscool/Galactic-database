import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { TIMELINE_ERAS, TimelineEntry } from "@/data/timeline";
import { TimelineCard } from "@/components/timeline-card";

const font = "'Share Tech Mono', monospace";

const ERA_COLORS = [
  { primary: "var(--primary)", dim: "color-mix(in srgb, var(--primary) 20%, transparent)" },
  { primary: "#ff6b6b", dim: "color-mix(in srgb, #ff6b6b 20%, transparent)" },
  { primary: "#4d96ff", dim: "color-mix(in srgb, #4d96ff 20%, transparent)" },
  { primary: "#ffd93d", dim: "color-mix(in srgb, #ffd93d 20%, transparent)" },
  { primary: "#e67e22", dim: "color-mix(in srgb, #e67e22 20%, transparent)" },
  { primary: "#6bcb77", dim: "color-mix(in srgb, #6bcb77 20%, transparent)" },
  { primary: "#9b59b6", dim: "color-mix(in srgb, #9b59b6 20%, transparent)" },
  { primary: "#3498db", dim: "color-mix(in srgb, #3498db 20%, transparent)" },
  { primary: "#95a5a6", dim: "color-mix(in srgb, #95a5a6 20%, transparent)" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const cardDownVariants = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function splitEntries(entries: TimelineEntry[]): { above: TimelineEntry[]; below: TimelineEntry[] } {
  const nonPhase = entries.filter((e) => e.type !== "Phase");

  const above: TimelineEntry[] = [];
  const below: TimelineEntry[] = [];

  nonPhase.forEach((e, i) => {
    if (i % 2 === 0) {
      above.push(e);
    } else {
      below.push(e);
    }
  });

  return { above, below };
}

function EraColumn({
  era,
  index,
}: {
  era: (typeof TIMELINE_ERAS)[number];
  index: number;
}) {
  const color = ERA_COLORS[index % ERA_COLORS.length];
  const { above, below } = splitEntries(era.entries);
  const phaseEntries = era.entries.filter((e) => e.type === "Phase");

  const cardW = 280;
  const gap = 28;
  const pad = 40;
  const columnWidth = Math.max(
    340,
    Math.max(above.length, below.length) * cardW + Math.max(0, Math.max(above.length, below.length) - 1) * gap + pad,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: columnWidth,
        maxWidth: columnWidth,
        height: "100%",
        position: "relative",
        flexShrink: 0,
        scrollSnapAlign: "start",
      }}
    >
      {/* Era header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "14px 20px",
          background: "linear-gradient(180deg, var(--background) 60%, transparent)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            borderLeft: `2px solid ${color.primary}`,
            paddingLeft: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: color.primary,
              fontFamily: font,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textShadow: `0 0 8px ${color.primary}`,
            }}
          >
            {era.name}
          </span>
          <span
            style={{
              fontSize: 9,
              color: "var(--muted-foreground)",
              fontFamily: font,
              letterSpacing: "0.1em",
              marginTop: 2,
            }}
          >
            {era.dateRange}
          </span>
          <span
            style={{
              fontSize: 8,
              color: "var(--muted-foreground)",
              fontFamily: font,
              letterSpacing: "0.06em",
              marginTop: 6,
              lineHeight: 1.5,
              maxWidth: 300,
            }}
          >
            {era.description}
          </span>
        </div>
      </div>

      {/* Above river */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: 28,
          padding: "60px 20px 4px",
        }}
      >
        {above.map((entry) => (
          <motion.div key={entry.id} variants={cardUpVariants}>
            <TimelineCard entry={entry} side="above" />
          </motion.div>
        ))}
      </motion.div>

      {/* Phase nodes on the river line */}
      {phaseEntries.length > 0 && phaseEntries.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              background: color.primary,
              transform: "rotate(45deg)",
              boxShadow: `0 0 8px ${color.primary}`,
            }}
          />
          <span
            style={{
              fontSize: 7,
              color: color.primary,
              fontFamily: font,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 4,
              whiteSpace: "nowrap",
              textShadow: `0 0 6px ${color.primary}`,
            }}
          >
            {p.title}
          </span>
        </div>
      ))}

      {/* Below river */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 28,
          padding: "4px 20px 60px",
        }}
      >
        {below.map((entry) => (
          <motion.div key={entry.id} variants={cardDownVariants}>
            <TimelineCard entry={entry} side="below" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function TimelineView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Horizontal scroll via vertical wheel — capture on outer container to beat framer-motion
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const target = scrollRef.current;
      if (!target) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      target.scrollLeft += delta;
    };
    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (glowRef.current) {
      glowRef.current.style.left = `${e.clientX - rect.left - 120}px`;
    }
  };

  const handleMouseEnter = () => {
    if (glowRef.current) glowRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={outerRef}
      tabIndex={0}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--background)",
        outline: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <style>{`
        @keyframes river-pulse {
          0%, 100% { box-shadow: 0 0 20px var(--primary), 0 0 60px color-mix(in srgb, var(--primary) 40%, transparent); }
          50% { box-shadow: 0 0 30px var(--primary), 0 0 90px color-mix(in srgb, var(--primary) 50%, transparent); }
        }
      `}</style>

      {/* Central river line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, var(--primary) 10%, var(--primary) 90%, transparent 100%)",
          boxShadow: "0 0 20px var(--primary), 0 0 60px color-mix(in srgb, var(--primary) 40%, transparent)",
          animation: "river-pulse 3s ease-in-out infinite",
          zIndex: 2,
          transform: "translateY(-1px)",
          pointerEvents: "none",
        }}
      />

      {/* River reflection glow */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 40px)",
          left: 0,
          right: 0,
          height: 80,
          background: "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--primary) 6%, transparent) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
          transform: "translateY(-1px)",
        }}
      />

      {/* Hover glow on the river line */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: "calc(50% - 24px)",
          left: -9999,
          width: 240,
          height: 48,
          background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--primary) 50%, transparent) 0%, transparent 70%)`,
          zIndex: 3,
          pointerEvents: "none",
          opacity: 0,
          transition: "left 0.04s linear",
        }}
      />

      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(90deg, var(--background) 0%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(270deg, var(--background) 0%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Scrollable timeline content */}
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          height: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
          position: "relative",
          zIndex: 4,
        }}
      >
        <div style={{ display: "flex", height: "100%", minWidth: "100%", position: "relative" }}>
          {TIMELINE_ERAS.map((era, i) => (
            <EraColumn key={era.id} era={era} index={i} />
          ))}
          <div style={{ minWidth: 80, flexShrink: 0 }} />
        </div>
      </div>

    </div>
  );
}
