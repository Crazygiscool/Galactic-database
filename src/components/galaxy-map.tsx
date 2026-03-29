import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { Planet } from "@/hooks/use-swapi";

interface GalaxyMapProps {
  planets: Planet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBlurChange?: (blur: number) => void;
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

const REGION_TO_RING: Record<string, number> = {
  "Deep Core": 1,
  "Core": 2,
  "Colonies": 3,
  "Expansion Region": 4,
  "Inner Rim Territories": 5,
  "Mid Rim Territories": 6,
  "Outer Rim Territories": 7,
  "Hutt Space": 7,
  "Unknown Regions": 8,
  "Wild Space": 8,
  "Talcene Sector": 7,
  "The Centrality": 7,
  "Tingel Arm": 6,
  "Extragalactic": 8,
};

interface PositionedPlanet extends Planet {
  worldX: number;
  worldY: number;
  baseAngle: number;
  radius: number;
  orbitSpeed: number;
}

export function GalaxyMap({ planets, selectedId, onSelect, onBlurChange }: GalaxyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 3 });
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const [quoteOpacity, setQuoteOpacity] = useState(0);
  const [hoveredPlanet, setHoveredPlanet] = useState<PositionedPlanet | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    onBlurChange?.(quoteOpacity * 8);
  }, [quoteOpacity, onBlurChange]);

  const MAP_WIDTH = 60000;
  const MAP_HEIGHT = 60000;
  const SCALE = 2500;
  const OFFSET_X = MAP_WIDTH / 2;
  const OFFSET_Y = MAP_HEIGHT / 2;

  const positionedPlanets = useMemo<PositionedPlanet[]>(() => {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    return planets.map((planet) => {
      let x: number, y: number;
      let baseAngle = 0;
      let radius = 0;
      let orbitSpeed = 0;
      const hash = hashCode(planet.name);

      if (planet.x !== undefined && planet.y !== undefined) {
        const dbX = (planet.x as number) - 10;
        const dbY = (planet.y as number) - 10;
        const dist = Math.sqrt(dbX * dbX + dbY * dbY);
        baseAngle = Math.atan2(dbY, dbX);
        const ring = planet.region ? REGION_TO_RING[planet.region] || 4 : 4;
        const ringInner = (ring - 1) * 100000;
        const ringOuter = ring * 100000;
        radius = ringInner + 20000 + (dist / 15) * (ringOuter - ringInner - 40000);
        x = Math.cos(baseAngle) * radius;
        y = Math.sin(baseAngle) * radius;
        orbitSpeed = 0.01 + (hash % 30) / 3000;
      } else {
        const ring = planet.region ? REGION_TO_RING[planet.region] || 4 : 4;
        const ringInner = (ring - 1) * 100000;
        const ringOuter = ring * 100000;
        baseAngle = ((hash % 360) / 360) * Math.PI * 2;
        radius = ringInner + 20000 + (hash % (ringOuter - ringInner - 40000));
        orbitSpeed = 0.02 + (hash % 50) / 2500;
        x = Math.cos(baseAngle) * radius;
        y = Math.sin(baseAngle) * radius;
      }

      return { ...planet, worldX: x, worldY: y, baseAngle, radius, orbitSpeed };
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

    const CLUSTER_THRESHOLD = 2;
    const CLUSTER_GRID_SIZE = 50;

    const visiblePlanets = positionedPlanets.filter(p => {
      const orbitAngle = p.baseAngle + time * p.orbitSpeed;
      const worldX = Math.cos(orbitAngle) * p.radius;
      const worldY = Math.sin(orbitAngle) * p.radius;
      const screenX = (centerX + viewport.x) + worldX / SCALE * viewport.scale;
      const screenY = (centerY + viewport.y) + worldY / SCALE * viewport.scale;
      return screenX >= -100 && screenX <= width + 100 && 
             screenY >= -100 && screenY <= height + 100;
    });

    const useClusters = viewport.scale < CLUSTER_THRESHOLD;

    if (useClusters) {
      const clusters = new Map<string, { planets: PositionedPlanet[]; sumX: number; sumY: number; count: number }>();

      for (const planet of visiblePlanets) {
        if (planet.id === selectedId) continue;
        const orbitAngle = planet.baseAngle + time * planet.orbitSpeed;
        const worldX = Math.cos(orbitAngle) * planet.radius;
        const worldY = Math.sin(orbitAngle) * planet.radius;
        const screenX = (centerX + viewport.x) + worldX / SCALE * viewport.scale;
        const screenY = (centerY + viewport.y) + worldY / SCALE * viewport.scale;

        const gridX = Math.floor(screenX / CLUSTER_GRID_SIZE);
        const gridY = Math.floor(screenY / CLUSTER_GRID_SIZE);
        const key = `${gridX},${gridY}`;

        if (!clusters.has(key)) {
          clusters.set(key, { planets: [], sumX: 0, sumY: 0, count: 0 });
        }
        const cluster = clusters.get(key)!;
        cluster.planets.push(planet);
        cluster.sumX += screenX;
        cluster.sumY += screenY;
        cluster.count++;
      }

      for (const cluster of clusters.values()) {
        const cx = cluster.sumX / cluster.count;
        const cy = cluster.sumY / cluster.count;
        const size = Math.min(3 + cluster.count * 0.5, 12);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size + 5);
        gradient.addColorStop(0, "rgba(0, 212, 255, 0.6)");
        gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
        ctx.beginPath();
        ctx.arc(cx, cy, size + 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.9)";
        ctx.fill();

        if (cluster.count > 1) {
          ctx.font = `${Math.max(8, 10 / viewport.scale)}px "Share Tech Mono", monospace`;
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(cluster.count), cx, cy);
        }
      }
    } else {
      const baseSize = 5;

      for (const planet of visiblePlanets) {
        if (planet.id === selectedId) continue;

        const orbitAngle = planet.baseAngle + time * planet.orbitSpeed;
        const worldX = Math.cos(orbitAngle) * planet.radius;
        const worldY = Math.sin(orbitAngle) * planet.radius;
        const screenX = (centerX + viewport.x) + worldX / SCALE * viewport.scale;
        const screenY = (centerY + viewport.y) + worldY / SCALE * viewport.scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, baseSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(screenX, screenY, baseSize + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 212, 255, 0.4)";
        ctx.lineWidth = 1 / viewport.scale;
        ctx.stroke();
      }
    }

    const selectedPlanet = visiblePlanets.find(p => p.id === selectedId);
    if (selectedPlanet) {
      const orbitAngle = selectedPlanet.baseAngle + time * selectedPlanet.orbitSpeed;
      const worldX = Math.cos(orbitAngle) * selectedPlanet.radius;
      const worldY = Math.sin(orbitAngle) * selectedPlanet.radius;
      const screenX = (centerX + viewport.x) + worldX / SCALE * viewport.scale;
      const screenY = (centerY + viewport.y) + worldY / SCALE * viewport.scale;
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
      ctx.lineWidth = 2 / viewport.scale;
      ctx.stroke();
    }
  }, [dimensions, positionedPlanets, selectedId, viewport, time]);

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

    const ringCenterX = centerX + viewport.x;
    const ringCenterY = centerY + viewport.y;

    ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 5]);

    const regionLabels = ["DEEP CORE", "CORE", "COLONIES", "EXPANSION", "INNER RIM", "MID RIM", "OUTER RIM", "UNKNOWN"];

    for (let i = 1; i <= 8; i++) {
      const radius = i * 100000 * viewport.scale / SCALE;
      ctx.beginPath();
      ctx.arc(ringCenterX, ringCenterY, radius, 0, Math.PI * 2);
      ctx.stroke();

      const labelX = ringCenterX;
      const labelY = ringCenterY - radius;
      const fontSize = Math.max(8, 12 / viewport.scale);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      ctx.fillStyle = `rgba(0, 212, 255, ${0.6 * (1 - quoteOpacity)})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(regionLabels[i - 1], labelX, labelY);
    }

    ctx.setLineDash([]);
  }, [dimensions, viewport, quoteOpacity]);

  useEffect(() => {
    drawMap();
    drawRings();
  }, [drawMap, drawRings]);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      const t = Date.now() / 1000;
      timeRef.current = t;
      setTime(t);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const targetOpacity = viewport.scale <= 0.1 ? 1 : 0;
    const step = 0.08;
    let currentOpacity = quoteOpacity;
    
    const animateOpacity = () => {
      if (currentOpacity < targetOpacity) {
        currentOpacity = Math.min(currentOpacity + step, targetOpacity);
      } else if (currentOpacity > targetOpacity) {
        currentOpacity = Math.max(currentOpacity - step, targetOpacity);
      }
      setQuoteOpacity(currentOpacity);
      
      if (currentOpacity !== targetOpacity) {
        requestAnimationFrame(animateOpacity);
      }
    };
    
    requestAnimationFrame(animateOpacity);
  }, [viewport.scale]);

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

    const mapX = (clickX - centerX - viewport.x) / viewport.scale;
    const mapY = (clickY - centerY - viewport.y) / viewport.scale;

    let closestPlanet: PositionedPlanet | null = null;
    let closestDist = Infinity;
    const clickRadius = 30 / viewport.scale;

    for (const planet of positionedPlanets) {
      const screenX = (planet.worldX - MAP_WIDTH / 2) / SCALE;
      const screenY = (planet.worldY - MAP_HEIGHT / 2) / SCALE;
      const dx = screenX - mapX;
      const dy = screenY - mapY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < clickRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    if (closestPlanet) {
      onSelect(closestPlanet.id);
    }
  }, [dimensions, positionedPlanets, onSelect, viewport]);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(0.02, Math.min(50, prev.scale * delta)),
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

  const handleMouseMoveCanvas = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const mapX = ((clickX - centerX - viewport.x) / viewport.scale) * SCALE + MAP_WIDTH / 2;
    const mapY = ((clickY - centerY - viewport.y) / viewport.scale) * SCALE + MAP_HEIGHT / 2;
    setMousePos({ x: Math.round(mapX), y: Math.round(mapY) });

    let foundPlanet: PositionedPlanet | null = null;
    const hoverRadius = 30;

    for (const planet of positionedPlanets) {
      const orbitAngle = planet.baseAngle + timeRef.current * planet.orbitSpeed;
      const worldX = Math.cos(orbitAngle) * planet.radius;
      const worldY = Math.sin(orbitAngle) * planet.radius;
      const screenX = (centerX + viewport.x) + worldX / SCALE * viewport.scale;
      const screenY = (centerY + viewport.y) + worldY / SCALE * viewport.scale;
      const dx = clickX - screenX;
      const dy = clickY - screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < hoverRadius) {
        foundPlanet = planet;
        break;
      }
    }

    setHoveredPlanet(foundPlanet);
    if (foundPlanet) {
      setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 10 });
    }
  }, [dimensions, viewport, positionedPlanets]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        overflow: "hidden", 
        position: "relative",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => { handleMouseMove(e); handleMouseMoveCanvas(e); }}
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

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: "8px 12px",
          fontSize: 12,
          fontFamily: "'Share Tech Mono', monospace",
          color: "var(--muted-foreground)",
          zIndex: 100,
        }}
      >
        {mousePos ? `X: ${mousePos.x}  Y: ${mousePos.y}` : "Move cursor over map"}  |  Zoom: {viewport.scale.toFixed(1)}x
      </div>

      {hoveredPlanet && (
        <div
          style={{
            position: "absolute",
            left: tooltipPos.x,
            top: tooltipPos.y,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "'Share Tech Mono', monospace",
            color: "var(--foreground)",
            zIndex: 200,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            minWidth: 160,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4, color: "var(--primary)" }}>
            {hoveredPlanet.name}
          </div>
          {hoveredPlanet.region && (
            <div style={{ color: "var(--muted-foreground)", marginBottom: 2 }}>
              {hoveredPlanet.region}
            </div>
          )}
          {hoveredPlanet.climate && (
            <div style={{ color: "var(--muted-foreground)", marginBottom: 2 }}>
              Climate: {hoveredPlanet.climate}
            </div>
          )}
          {hoveredPlanet.population && (
            <div style={{ color: "var(--muted-foreground)" }}>
              Pop: {hoveredPlanet.population}
            </div>
          )}
        </div>
      )}

      {quoteOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 48,
            fontWeight: "bold",
            fontStyle: "italic",
            color: `rgba(0, 212, 255, ${quoteOpacity})`,
            textShadow: `0 0 30px rgba(0, 212, 255, ${quoteOpacity * 0.8})`,
            zIndex: 50,
            textAlign: "center",
            pointerEvents: "none",
            background: `rgba(0, 0, 0, ${quoteOpacity * 0.5})`,
            backdropFilter: `blur(${quoteOpacity * 10}px)`,
            padding: "20px 40px",
            borderRadius: "8px",
          }}
        >
          so beautiful... it's unbearable
          <br />
          <span style={{ fontSize: 24, fontWeight: "bold", opacity: 0.7 }}>-Anakin, AOTC</span>
        </div>
      )}
    </div>
  );
}


