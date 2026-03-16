import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Film, User, Rocket, Truck, X } from 'lucide-react';
import { Section } from '@/hooks/use-swapi';

interface TopNavProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'planets',   label: 'PLANETS',   icon: <Globe   style={{ width: 14, height: 14 }} /> },
  { key: 'films',     label: 'FILMS',     icon: <Film    style={{ width: 14, height: 14 }} /> },
  { key: 'people',    label: 'PERSONS',   icon: <User    style={{ width: 14, height: 14 }} /> },
  { key: 'starships', label: 'STARSHIPS', icon: <Rocket  style={{ width: 14, height: 14 }} /> },
  { key: 'vehicles',  label: 'VEHICLES',  icon: <Truck   style={{ width: 14, height: 14 }} /> },
];

const C = {
  bar:      'rgba(0,8,20,0.97)',
  border:   'rgba(0,212,255,0.18)',
  active:   '#00d4ff',
  activeBg: 'rgba(0,212,255,0.10)',
  inactive: 'rgba(0,212,255,0.42)',
  font:     "'Share Tech Mono', monospace",
};

export function TopNav({ activeSection, onSectionChange, search, onSearchChange }: TopNavProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      height: 52, background: C.bar,
      borderBottom: `1px solid ${C.border}`,
      fontFamily: C.font, flexShrink: 0,
      boxShadow: '0 2px 20px rgba(0,212,255,0.08)',
      position: 'relative', zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 20px', borderRight: `1px solid ${C.border}`,
        height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ fontSize: 11, color: '#00d4ff', textShadow: '0 0 8px #00d4ff', letterSpacing: '0.18em', whiteSpace: 'nowrap' }}>
          ◈ IMPERIAL DATABASE
        </div>
      </div>

      {/* Nav items with sliding indicator */}
      <div style={{ display: 'flex', height: '100%', flexShrink: 0 }}>
        {NAV_ITEMS.map(item => {
          const active = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 18px', height: '100%', cursor: 'pointer',
                background: active ? C.activeBg : 'transparent',
                color: active ? C.active : C.inactive,
                border: 'none', borderBottom: '2px solid transparent',
                fontFamily: C.font, fontSize: 11, letterSpacing: '0.15em',
                textShadow: active ? '0 0 8px #00d4ff' : 'none',
                transition: 'color 0.2s, background 0.2s, text-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {item.icon}
              {item.label}

              {/* Sliding underline indicator */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute', bottom: -1, left: 0, right: 0,
                    height: 2, background: '#00d4ff',
                    boxShadow: '0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', borderLeft: `1px solid ${C.border}` }}>
        <Search style={{ width: 14, height: 14, color: 'rgba(0,212,255,0.5)', flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="SEARCH DATABASE..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#00d4ff', fontFamily: C.font, fontSize: 12,
            letterSpacing: '0.1em', padding: '0 10px',
            caretColor: '#00d4ff',
          }}
        />
        {search && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => onSearchChange('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,212,255,0.5)', padding: 2 }}
          >
            <X style={{ width: 12, height: 12 }} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
