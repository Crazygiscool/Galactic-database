import { useMemo, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Planet } from "@/hooks/use-swapi";

interface GalaxyMapProps {
  planets: Planet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

interface PositionedPlanet extends Planet {
  x: number;
  y: number;
}

export function GalaxyMap({ planets, selectedId, onSelect }: GalaxyMapProps) {
  const MAP_WIDTH = 2400;
  const MAP_HEIGHT = 2000;

  const positionedPlanets = useMemo<PositionedPlanet[]>(() => {
    return planets.map((planet) => {
      const numericId = parseInt(planet.id, 10) || 1;
      const x = 150 + seededRandom(numericId * 13.5) * (MAP_WIDTH - 300);
      const y = 150 + seededRandom(numericId * 89.2) * (MAP_HEIGHT - 300);
      return { ...planet, x, y };
    });
  }, [planets]);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect],
  );

  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      className="cursor-crosshair"
    >
      <TransformWrapper
        initialScale={0.5}
        initialPositionX={-200}
        initialPositionY={-100}
        minScale={0.2}
        maxScale={3}
        wheel={{ step: 0.08 }}
        panning={{ allowLeftClickPan: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
              contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
            >
              <div
                className="relative"
                style={{
                  width: MAP_WIDTH,
                  height: MAP_HEIGHT,
                  background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--primary) 5%, var(--background)) 0%, var(--background) 70%, color-mix(in srgb, var(--primary) 2%, var(--background)) 100%)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                      linear-gradient(to right, color-mix(in srgb, var(--primary) 4%, transparent) 1px, transparent 1px),
                      linear-gradient(to bottom, color-mix(in srgb, var(--primary) 4%, transparent) 1px, transparent 1px)
                    `,
                    backgroundSize: "200px 200px",
                    pointerEvents: "none",
                  }}
                />

                {positionedPlanets.map((planet) => {
                  const isSelected = selectedId === planet.id;
                  return (
                    <div
                      key={planet.id}
                      onClick={() => handleSelect(planet.id)}
                      style={{
                        position: "absolute",
                        left: planet.x,
                        top: planet.y,
                        transform: "translate(-50%, -50%)",
                        zIndex: isSelected ? 20 : 10,
                        cursor: "pointer",
                      }}
                      className="group"
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: isSelected ? 40 : 24,
                          height: isSelected ? 40 : 24,
                          borderRadius: "50%",
                          border: `1px solid color-mix(in srgb, var(--primary) ${isSelected ? 80 : 40}%, transparent)`,
                          boxShadow: isSelected
                            ? `0 0 20px color-mix(in srgb, var(--primary) 80%, transparent), 0 0 40px color-mix(in srgb, var(--primary) 40%, transparent)`
                            : `0 0 10px color-mix(in srgb, var(--primary) 30%, transparent)`,
                          transition: "all 0.3s ease",
                          pointerEvents: "none",
                        }}
                      />

                      <div
                        style={{
                          width: isSelected ? 14 : 8,
                          height: isSelected ? 14 : 8,
                          borderRadius: "50%",
                          background: isSelected
                            ? `radial-gradient(circle, #ffffff 0%, var(--primary) 60%, color-mix(in srgb, var(--primary) 50%, #000) 100%)`
                            : `radial-gradient(circle, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #000) 100%)`,
                          boxShadow: isSelected
                            ? `0 0 20px #fff, 0 0 40px var(--primary), 0 0 60px color-mix(in srgb, var(--primary) 50%, transparent)`
                            : `0 0 8px var(--primary), 0 0 15px color-mix(in srgb, var(--primary) 40%, transparent)`,
                          transition: "all 0.3s ease",
                        }}
                        className="group-hover:scale-150"
                      />

                      <div
                        style={{
                          marginTop: 10,
                          color: isSelected
                            ? "var(--foreground)"
                            : "var(--muted-foreground)",
                          fontSize: 9,
                          fontFamily: "'Share Tech Mono', monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          textShadow: isSelected
                            ? `0 0 8px var(--foreground), 0 0 15px var(--primary)`
                            : `0 0 6px color-mix(in srgb, var(--primary) 50%, transparent)`,
                          transform: "translateX(-50%)",
                          position: "absolute",
                          left: "50%",
                        }}
                      >
                        {planet.name}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "100%",
                          marginLeft: 12,
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          padding: "4px 8px",
                          fontSize: 9,
                          fontFamily: "'Share Tech Mono', monospace",
                          color: "var(--primary)",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          opacity: 0,
                          boxShadow: `0 0 10px color-mix(in srgb, var(--primary) 20%, transparent)`,
                        }}
                        className="group-hover:opacity-100 transition-opacity"
                      >
                        SYS: {planet.name.toUpperCase()}
                        <br />
                        REF: {planet.id.padStart(4, "0")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TransformComponent>

            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                zIndex: 30,
              }}
            >
              <button
                onClick={resetTransform as () => void}
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--primary)",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "'Share Tech Mono', monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                title="Reset View"
              >
                ⊙
              </button>
              {selectedId && positionedPlanets.find(p => p.id === selectedId) && (
                <button
                  onClick={() => {
                    const planet = positionedPlanets.find(p => p.id === selectedId);
                    if (planet) {
                      setTransform(planet.x - window.innerWidth / 2, planet.y - window.innerHeight / 2, 1, 300);
                    }
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    background: "color-mix(in srgb, var(--primary) 20%, var(--card))",
                    border: "1px solid var(--primary)",
                    borderRadius: 4,
                    color: "var(--primary)",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'Share Tech Mono', monospace",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary-foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 20%, var(--card))";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  title="Center on Selected"
                >
                  ◎
                </button>
              )}
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
