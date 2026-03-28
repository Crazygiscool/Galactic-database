import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { Planet } from "@/hooks/use-swapi";

interface GalaxyMapProps {
  planets: Planet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const REGION_COORDS: Record<string, { x: number; y: number }> = {
  "Deep Core": { x: 8, y: 10 },
  "Core": { x: 9, y: 9 },
  "Colonies": { x: 10, y: 8 },
  "Expansion Region": { x: 11, y: 11 },
  "Inner Rim Territories": { x: 13, y: 12 },
  "Mid Rim Territories": { x: 15, y: 13 },
  "Outer Rim Territories": { x: 17, y: 15 },
  "Hutt Space": { x: 18, y: 12 },
  "Wild Space": { x: 2, y: 5 },
  "Unknown Regions": { x: 1, y: 1 },
  "Talcene Sector": { x: 19, y: 8 },
  "The Centrality": { x: 16, y: 16 },
  "Tingel Arm": { x: 3, y: 15 },
  "Extragalactic": { x: 0, y: 0 },
};

const RING_REGIONS = [
  { name: "DEEP CORE", ring: 1, color: "#ff6b6b", angle: 135 },
  { name: "CORE", ring: 2, color: "#ffd93d", angle: 180 },
  { name: "COLONIES", ring: 3, color: "#6bcb77", angle: 225 },
  { name: "EXPANSION", ring: 4, color: "#4d96ff", angle: 270 },
  { name: "INNER RIM", ring: 5, color: "#9b59b6", angle: 315 },
  { name: "MID RIM", ring: 6, color: "#e67e22", angle: 0 },
  { name: "OUTER RIM", ring: 7, color: "#3498db", angle: 45 },
  { name: "UNKNOWN", ring: 8, color: "#2c3e50", angle: 90 },
];

interface PositionedPlanet extends Planet {
  worldX: number;
  worldY: number;
}

export function GalaxyMap({ planets, selectedId, onSelect }: GalaxyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: -20000, y: -20000, scale: 0.15 });
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  const MAP_WIDTH = 60000;
  const MAP_HEIGHT = 60000;
  const SCALE = 2500;
  const OFFSET_X = MAP_WIDTH / 2;
  const OFFSET_Y = MAP_HEIGHT / 2;

  const positionedPlanets = useMemo<PositionedPlanet[]>(() => {
    return planets.map((planet) => {
      let x: number, y: number;

      if (planet.x !== undefined && planet.y !== undefined) {
        x = OFFSET_X + (planet.x - 10) * SCALE;
        y = OFFSET_Y + (planet.y - 10) * SCALE;
      } else {
        const baseX = planet.region && REGION_COORDS[planet.region] ? REGION_COORDS[planet.region].x : 10;
        const baseY = planet.region && REGION_COORDS[planet.region] ? REGION_COORDS[planet.region].y : 10;
        x = OFFSET_X + (baseX - 10) * SCALE;
        y = OFFSET_Y + (baseY - 10) * SCALE;
      }

      x = Math.max(200, Math.min(MAP_WIDTH - 200, x));
      y = Math.max(200, Math.min(MAP_HEIGHT - 200, y));

      return { ...planet, worldX: x, worldY: y };
    });
  }, [planets]);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    const visiblePlanets = positionedPlanets.filter(p => {
      const screenX = centerX + (p.worldX - MAP_WIDTH / 2) / SCALE;
      const screenY = centerY + (p.worldY - MAP_HEIGHT / 2) / SCALE;
      return screenX >= -50 && screenX <= width + 50 && screenY >= -50 && screenY <= height + 50;
    });

    const baseSize = 5;

    for (const planet of visiblePlanets) {
      if (planet.id === selectedId) continue;

      const screenX = centerX + (planet.worldX - MAP_WIDTH / 2) / SCALE;
      const screenY = centerY + (planet.worldY - MAP_HEIGHT / 2) / SCALE;

      ctx.beginPath();
      ctx.arc(screenX, screenY, baseSize, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 212, 255, 0.8)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screenX, screenY, baseSize + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 212, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const selectedPlanet = visiblePlanets.find(p => p.id === selectedId);
    if (selectedPlanet) {
      const screenX = centerX + (selectedPlanet.worldX - MAP_WIDTH / 2) / SCALE;
      const screenY = centerY + (selectedPlanet.worldY - MAP_HEIGHT / 2) / SCALE;
      const glowSize = 20;

      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowSize);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(0.3, "rgba(0, 212, 255, 0.6)");
      gradient.addColorStop(1, "rgba(0, 212, 255, 0)");

      ctx.beginPath();
      ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screenX, screenY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screenX, screenY, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [dimensions, positionedPlanets, selectedId]);

  const drawRings = useCallback(() => {
    const canvas = ringsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 5]);

    for (let i = 1; i <= 8; i++) {
      const radius = i * (4000 / SCALE);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, [dimensions]);

  useEffect(() => {
    drawMap();
    drawRings();
  }, [drawMap, drawRings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    let closestPlanet: PositionedPlanet | null = null;
    let closestDist = Infinity;
    const clickRadius = 30;

    for (const planet of positionedPlanets) {
      const screenX = centerX + (planet.worldX - MAP_WIDTH / 2) / SCALE;
      const screenY = centerY + (planet.worldY - MAP_HEIGHT / 2) / SCALE;
      const dx = screenX - clickX;
      const dy = screenY - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < clickRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    if (closestPlanet) {
      onSelect(closestPlanet.id);
    }
  }, [dimensions, positionedPlanets, onSelect]);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(0.05, Math.min(2, prev.scale * delta)),
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setViewport((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          cursor: isDragging.current ? "grabbing" : "grab",
          position: "relative",
          background: "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--primary) 5%, var(--background)) 0%, var(--background) 70%)",
        }}
      >
        <canvas
          ref={ringsCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />

        <canvas
          ref={canvasRef}
          onClick={handleClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "crosshair",
          }}
        />
      </div>

      <Minimap
        planets={positionedPlanets}
        selectedId={selectedId}
        viewport={viewport}
        dimensions={dimensions}
        onSelect={onSelect}
      />
    </div>
  );
}

function Minimap({
  planets,
  selectedId,
  viewport,
  dimensions,
  onSelect,
}: {
  planets: PositionedPlanet[];
  selectedId: string | null;
  viewport: { x: number; y: number; scale: number };
  dimensions: { width: number; height: number };
  onSelect: (id: string) => void;
}) {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const MINIMAP_WIDTH = 180;
  const MINIMAP_HEIGHT = 150;
  const MAP_WIDTH = 60000;
  const MAP_HEIGHT = 60000;

  useEffect(() => {
    const canvas = minimapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINIMAP_WIDTH * dpr;
    canvas.height = MINIMAP_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);

    const minimapScaleX = MINIMAP_WIDTH / MAP_WIDTH;
    const minimapScaleY = MINIMAP_HEIGHT / MAP_HEIGHT;

    ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 8; i++) {
      const radius = i * 4000 * minimapScaleX;
      ctx.beginPath();
      ctx.arc(MINIMAP_WIDTH / 2, MINIMAP_HEIGHT / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const planet of planets) {
      const px = planet.worldX * minimapScaleX;
      const py = planet.worldY * minimapScaleY;
      if (px < 0 || px > MINIMAP_WIDTH || py < 0 || py > MINIMAP_HEIGHT) continue;

      ctx.beginPath();
      ctx.arc(px, py, planet.id === selectedId ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = planet.id === selectedId ? "#ffffff" : "rgba(0, 212, 255, 0.6)";
      ctx.fill();
    }

    const vpWidth = (dimensions.width / viewport.scale) * minimapScaleX;
    const vpHeight = (dimensions.height / viewport.scale) * minimapScaleY;
    const vpX = (-viewport.x / viewport.scale) * minimapScaleX;
    const vpY = (-viewport.y / viewport.scale) * minimapScaleY;

    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
    ctx.fillStyle = "rgba(0, 212, 255, 0.1)";
    ctx.fillRect(vpX, vpY, vpWidth, vpHeight);

  }, [planets, selectedId, viewport, dimensions]);

  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = minimapRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const minimapScaleX = MINIMAP_WIDTH / MAP_WIDTH;
    const minimapScaleY = MINIMAP_HEIGHT / MAP_HEIGHT;

    const worldX = clickX / minimapScaleX;
    const worldY = clickY / minimapScaleY;

    let closestPlanet: PositionedPlanet | null = null;
    let closestDist = Infinity;
    const clickRadius = 30 / minimapScaleX;

    for (const planet of planets) {
      const dx = planet.worldX - worldX;
      const dy = planet.worldY - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < clickRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    if (closestPlanet) {
      onSelect(closestPlanet.id);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "4px 8px",
          borderBottom: "1px solid var(--border)",
          fontSize: 8,
          fontFamily: "'Share Tech Mono', monospace",
          color: "var(--muted-foreground)",
          letterSpacing: "0.1em",
        }}
      >
        GALAXY MAP
      </div>
      <canvas
        ref={minimapRef}
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        onClick={handleMinimapClick}
        style={{
          width: MINIMAP_WIDTH,
          height: MINIMAP_HEIGHT,
          cursor: "pointer",
          display: "block",
        }}
      />
    </div>
  );
}
