import React, { useState } from 'react';
import { usePlanets } from '@/hooks/use-swapi';
import { GalaxyMap } from '@/components/galaxy-map';
import { PlanetPanel } from '@/components/planet-panel';
import { ScanlineOverlay, TerminalText } from '@/components/terminal-effects';
import { Activity, Database, Server } from 'lucide-react';

export default function Home() {
  const { data: planets, isLoading, error } = usePlanets();
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

  const selectedPlanet = planets?.find(p => p.id === selectedPlanetId) || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: '#000408', fontFamily: "'Share Tech Mono', monospace" }}>
      <ScanlineOverlay />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,4,8,0.96)' }}>
          <Database style={{ width: 64, height: 64, color: '#00d4ff', marginBottom: 24 }} className="animate-pulse" />
          <div style={{ fontSize: 22, color: '#00d4ff', textShadow: '0 0 10px #00d4ff', marginBottom: 8, borderBottom: '1px solid #00d4ff', paddingBottom: 8, paddingLeft: 32, paddingRight: 32 }}>
            <TerminalText text="INITIALIZING GALACTIC SCAN" speed={50} />
          </div>
          <div style={{ color: 'rgba(0,212,255,0.6)', fontSize: 12, marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <TerminalText text="> Establishing secure uplink to SWAPI network..." speed={20} />
            <TerminalText text="> Bypassing Imperial firewalls..." speed={30} />
            <TerminalText text="> Downloading planetary coordinates..." speed={40} />
          </div>
          <div style={{ width: 256, height: 8, border: '1px solid #00d4ff', marginTop: 32, padding: 2 }}>
            <div style={{ height: '100%', background: '#00d4ff', animation: 'pulse 1s ease-in-out infinite' }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,4,8,0.96)' }}>
          <Server style={{ width: 64, height: 64, color: '#ff0000', marginBottom: 24 }} className="animate-pulse" />
          <div style={{ fontSize: 22, color: '#ff0000', border: '1px solid #ff0000', padding: '16px 32px', background: 'rgba(255,0,0,0.1)' }}>
            CRITICAL FAILURE: {error.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '8px 24px', border: '1px solid #00d4ff', color: '#00d4ff', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.2em' }}
          >
            Reboot Terminal
          </button>
        </div>
      )}

      {/* Map Area - takes remaining space */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, height: '100%', borderRight: '1px solid rgba(0,212,255,0.2)', overflow: 'hidden' }}>
        {/* Top-left HUD */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ fontSize: 11, color: 'rgba(0,212,255,0.7)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity style={{ width: 14, height: 14, color: '#00d4ff' }} className="animate-pulse" />
            SECTOR OVERVIEW
          </div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 8px #00d4ff, 0 0 15px rgba(0,212,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Outer Rim Territories
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(0,212,255,0.3)', marginTop: 8 }} />
          <div style={{ fontSize: 10, color: 'rgba(0,212,255,0.5)', marginTop: 4 }}>
            SYSTEMS SCANNED: {planets?.length || 0}
          </div>
        </div>

        {/* The Map */}
        {planets && planets.length > 0 && (
          <GalaxyMap 
            planets={planets} 
            selectedId={selectedPlanetId} 
            onSelect={setSelectedPlanetId} 
          />
        )}
      </div>

      {/* Right Panel - always visible */}
      <div style={{ width: 380, height: '100%', background: 'rgba(0,8,18,0.92)', position: 'relative', zIndex: 20, flexShrink: 0, borderLeft: '1px solid rgba(0,212,255,0.2)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
        <PlanetPanel 
          planet={selectedPlanet} 
          onClose={() => setSelectedPlanetId(null)} 
        />
      </div>
    </div>
  );
}
