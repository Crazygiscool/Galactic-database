import { useRef, useEffect, useState } from "react";
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

function splitEntries(entries: TimelineEntry[]): { above: TimelineEntry[]; below: TimelineEntry[] } {
  const nonPhase = entries.filter((e) => e.type !== "Phase");
  const phaseEntries = entries.filter((e) => e.type === "Phase");

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

  const columnWidth = Math.max(
    300,
    Math.max(above.length, below.length) * 90 + 120,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: columnWidth,
        maxWidth: columnWidth + 80,
        height: "100%",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Era header — angled vertical badge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "10px 14px",
          background: "linear-gradient(180deg, var(--background) 60%, transparent)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            borderLeft: `2px solid ${color.primary}`,
            paddingLeft: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
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
              fontSize: 8,
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
              marginTop: 4,
              lineHeight: 1.4,
              maxWidth: 280,
            }}
          >
            {era.description}
          </span>
        </div>
      </div>

      {/* Above river */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-end",
          justifyContent: "center",
          gap: 8,
          padding: "60px 14px 16px",
        }}
      >
        {above.map((entry) => (
          <TimelineCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Phase dividers on the river line */}
      {phaseEntries.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            padding: "2px 14px",
            position: "relative",
            zIndex: 5,
          }}
        >
          {phaseEntries.map((p) => (
            <span
              key={p.id}
              style={{
                fontSize: 7,
                color: "var(--muted-foreground)",
                fontFamily: font,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "var(--background)",
                padding: "0 6px",
                whiteSpace: "nowrap",
              }}
            >
              {p.title}{p.description ? `: ${p.description}` : ""}
            </span>
          ))}
        </div>
      )}

      {/* Below river */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "center",
          gap: 8,
          padding: "16px 14px 60px",
        }}
      >
        {below.map((entry) => (
          <TimelineCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export function TimelineView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollLeft);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--background)",
      }}
    >
      {/* Central river line — fixed glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, var(--primary) 10%, var(--primary) 90%, transparent 100%)",
          boxShadow: "0 0 20px var(--primary), 0 0 60px color-mix(in srgb, var(--primary) 40%, transparent)",
          zIndex: 2,
          transform: "translateY(-1px)",
          pointerEvents: "none",
        }}
      />

      {/* River reflection glow */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 30px)",
          left: 0,
          right: 0,
          height: 60,
          background: "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
          transform: "translateY(-1px)",
        }}
      />

      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 60,
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
          width: 60,
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
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div style={{ display: "flex", height: "100%", minWidth: "100%" }}>
          {TIMELINE_ERAS.map((era, i) => (
            <EraColumn key={era.id} era={era} index={i} />
          ))}

          {/* End spacer */}
          <div style={{ minWidth: 60, flexShrink: 0 }} />
        </div>
      </div>

      {/* Star-like particles floating along river */}
      <ParticleField scrollY={scrollY} />
    </div>
  );
}

function ParticleField({ scrollY }: { scrollY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: { x: number; y: number; size: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * h * 0.4,
        size: 0.5 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.4,
        alpha: 0.1 + Math.random() * 0.3,
      });
    }

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
        p.x = ((p.x - p.speed * 0.5 - (scrollY * 0.01) % w) % w + w) % w;
      }
    };
    const tick = () => { draw(); requestAnimationFrame(tick); };
    const id = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(id); };
  }, [scrollY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
