import React, { useMemo } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Planet } from '@/hooks/use-swapi';

interface GalaxyMapProps {
  planets: Planet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  x: seededRandom(i * 7.3) * 100,
  y: seededRandom(i * 13.7) * 100,
  size: seededRandom(i * 3.1) * 2 + 0.5,
  opacity: seededRandom(i * 5.9) * 0.6 + 0.2,
}));

export function GalaxyMap({ planets, selectedId, onSelect }: GalaxyMapProps) {
  const MAP_WIDTH = 2400;
  const MAP_HEIGHT = 2000;

  const positionedPlanets = useMemo(() => {
    return planets.map(planet => {
      const numericId = parseInt(planet.id, 10) || 1;
      const x = 150 + seededRandom(numericId * 13.5) * (MAP_WIDTH - 300);
      const y = 150 + seededRandom(numericId * 89.2) * (MAP_HEIGHT - 300);
      return { ...planet, x, y };
    });
  }, [planets]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }} className="cursor-crosshair">
      <TransformWrapper
        initialScale={0.35}
        initialPositionX={-280}
        initialPositionY={-150}
        minScale={0.1}
        maxScale={4}
        wheel={{ step: 0.08 }}
        panning={{ allowLeftClickPan: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
        >
          <div
            className="relative"
            style={{
              width: MAP_WIDTH,
              height: MAP_HEIGHT,
              background: 'radial-gradient(ellipse at 50% 50%, #03111e 0%, #000408 70%, #000204 100%)',
            }}
          >
            {/* Starfield */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {STARS.map(star => (
                <circle
                  key={star.id}
                  cx={`${star.x}%`}
                  cy={`${star.y}%`}
                  r={star.size}
                  fill={star.id % 5 === 0 ? '#7df9ff' : '#ffffff'}
                  opacity={star.opacity}
                />
              ))}
            </svg>

            {/* Grid lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(to right, rgba(0,212,255,0.04) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,212,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '200px 200px',
                pointerEvents: 'none',
              }}
            />

            {/* Planets */}
            {positionedPlanets.map(planet => {
              const isSelected = selectedId === planet.id;
              return (
                <div
                  key={planet.id}
                  onClick={() => onSelect(planet.id)}
                  style={{
                    position: 'absolute',
                    left: planet.x,
                    top: planet.y,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 20 : 10,
                    cursor: 'pointer',
                  }}
                  className="group"
                >
                  {/* Glow ring */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: isSelected ? 40 : 24,
                      height: isSelected ? 40 : 24,
                      borderRadius: '50%',
                      border: `1px solid rgba(0,212,255,${isSelected ? 0.8 : 0.4})`,
                      boxShadow: isSelected
                        ? '0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)'
                        : '0 0 10px rgba(0,212,255,0.3)',
                      animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Planet dot */}
                  <div
                    style={{
                      width: isSelected ? 14 : 8,
                      height: isSelected ? 14 : 8,
                      borderRadius: '50%',
                      background: isSelected
                        ? 'radial-gradient(circle, #ffffff 0%, #00d4ff 60%, #0080ff 100%)'
                        : 'radial-gradient(circle, #00d4ff 0%, #0060a0 100%)',
                      boxShadow: isSelected
                        ? '0 0 20px #fff, 0 0 40px #00d4ff, 0 0 60px rgba(0,212,255,0.5)'
                        : '0 0 8px #00d4ff, 0 0 15px rgba(0,212,255,0.4)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                    className="group-hover:scale-150"
                  />

                  {/* Planet name label */}
                  <div
                    style={{
                      marginTop: 10,
                      color: isSelected ? '#ffffff' : 'rgba(0,212,255,0.75)',
                      fontSize: 9,
                      fontFamily: "'Share Tech Mono', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      textShadow: isSelected
                        ? '0 0 8px #fff, 0 0 15px #00d4ff'
                        : '0 0 6px rgba(0,212,255,0.5)',
                      transform: 'translateX(-50%)',
                      position: 'absolute',
                      left: '50%',
                    }}
                  >
                    {planet.name}
                  </div>

                  {/* Hover tooltip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '100%',
                      marginLeft: 12,
                      background: 'rgba(0,4,8,0.92)',
                      border: '1px solid rgba(0,212,255,0.5)',
                      padding: '4px 8px',
                      fontSize: 9,
                      fontFamily: "'Share Tech Mono', monospace",
                      color: 'rgba(0,212,255,0.85)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      opacity: 0,
                      boxShadow: '0 0 10px rgba(0,212,255,0.2)',
                    }}
                    className="group-hover:opacity-100 transition-opacity"
                  >
                    SYS: {planet.name.toUpperCase()}<br/>
                    REF: {planet.id.padStart(4, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
