import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Activity, Globe, Users, Navigation } from 'lucide-react';
import { Planet, useResident } from '@/hooks/use-swapi';
import { TerminalContainer, TerminalText } from './terminal-effects';

interface PlanetPanelProps {
  planet: Planet | null;
  onClose: () => void;
}

export function PlanetPanel({ planet, onClose }: PlanetPanelProps) {
  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <div className="p-4 border-b border-primary/30 bg-card/90 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-xl font-bold glow-text tracking-widest uppercase">
          {planet ? "TACTICAL ANALYSIS" : "STANDBY MODE"}
        </h2>
        {planet && (
          <button 
            onClick={onClose}
            className="text-primary/50 hover:text-white transition-colors p-1 border border-transparent hover:border-primary/50 hover:bg-primary/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {!planet ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center opacity-50"
            >
              <Navigation className="w-16 h-16 text-primary/40 mb-4 animate-pulse-fast" />
              <TerminalText text="AWAITING TARGET SELECTION..." className="text-primary/60 tracking-widest" />
              <div className="mt-4 text-xs text-primary/40 max-w-[200px]">
                USE MAP INTERFACE TO DESIGNATE A PLANETARY BODY FOR SCANNING
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Header Section */}
              <div className="mb-8">
                <div className="text-xs text-primary/50 mb-1">SYSTEM.DESIGNATION</div>
                <h1 className="text-4xl font-bold text-white glow-text-bright uppercase tracking-tighter truncate">
                  {planet.name}
                </h1>
                <div className="w-full h-px bg-gradient-to-r from-primary via-primary/50 to-transparent mt-2" />
              </div>

              {/* Stats Grid */}
              <TerminalContainer title="ENVIRONMENTAL.DAT">
                <div className="grid grid-cols-1 gap-y-3 gap-x-4">
                  <StatRow icon={<Globe />} label="CLIMATE" value={planet.climate} />
                  <StatRow icon={<Activity />} label="TERRAIN" value={planet.terrain} />
                  <StatRow icon={<Users />} label="POPULATION" value={planet.population} />
                  
                  <div className="col-span-1 h-px bg-primary/20 my-2" />
                  
                  <StatRow label="DIAMETER" value={`${planet.diameter} km`} />
                  <StatRow label="GRAVITY" value={planet.gravity} />
                  <StatRow label="ORBITAL PERIOD" value={`${planet.orbital_period} days`} />
                </div>
              </TerminalContainer>

              {/* Residents Section */}
              <TerminalContainer title="KNOWN.PERSONNEL" className="mt-6">
                {planet.residents.length === 0 ? (
                  <div className="text-primary/50 text-sm py-4 text-center">
                    [ NO POPULATION DATA DETECTED ]
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {planet.residents.map((url, i) => (
                      <ResidentItem key={url} url={url} delay={i * 0.1} />
                    ))}
                  </div>
                )}
              </TerminalContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Status Bar */}
      <div className="h-8 border-t border-primary/30 bg-background/90 flex items-center px-4 text-[10px] text-primary/60 justify-between backdrop-blur-md mt-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          TERMINAL ONLINE
        </div>
        <div>SYS.V 1.0.4</div>
      </div>
    </div>
  );
}

function StatRow({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between text-sm group">
      <div className="flex items-center text-primary/60 w-1/3">
        {icon && <span className="mr-2 opacity-70 w-4 h-4">{icon}</span>}
        {!icon && <ChevronRight className="w-3 h-3 mr-1 opacity-50" />}
        <span className="uppercase">{label}</span>
      </div>
      <div className="text-primary text-right w-2/3 break-words uppercase font-bold glow-text group-hover:text-white transition-colors">
        {value === 'unknown' ? 'CLASSIFIED' : value}
      </div>
    </div>
  );
}

function ResidentItem({ url, delay }: { url: string, delay: number }) {
  const { data: resident, isLoading, isError } = useResident(url);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between p-2 border border-primary/20 bg-background hover:bg-primary/10 hover:border-primary/50 transition-all cursor-crosshair group"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-1 h-full min-h-[20px] bg-primary/30 group-hover:bg-primary transition-colors" />
        {isLoading ? (
          <TerminalText text="DECRYPTING FILE..." speed={40} className="text-xs text-primary/70" />
        ) : isError ? (
          <span className="text-xs text-destructive uppercase">CORRUPTED FILE</span>
        ) : (
          <span className="text-sm text-primary uppercase truncate group-hover:text-white glow-text">
            {resident.name}
          </span>
        )}
      </div>
      {resident && (
        <div className="text-[10px] text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity">
          ID:{url.split('/').filter(Boolean).pop()?.padStart(4, '0')}
        </div>
      )}
    </motion.div>
  );
}
