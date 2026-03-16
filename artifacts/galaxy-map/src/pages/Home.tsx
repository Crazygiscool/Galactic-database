import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Section,
  usePlanets, useFilms, usePeople, useStarships, useVehicles,
  Planet, Film, Person, Starship, Vehicle,
} from '@/hooks/use-swapi';
import { GalaxyMap } from '@/components/galaxy-map';
import { ScanlineOverlay } from '@/components/terminal-effects';
import { TopNav } from '@/components/top-nav';
import { FilmsList, PeopleList, StarshipsList, VehiclesList } from '@/components/list-view';
import {
  PlanetDetailPanel, FilmDetailPanel, PersonDetailPanel,
  StarshipDetailPanel, VehicleDetailPanel,
} from '@/components/detail-panel';
import { Database, Activity } from 'lucide-react';

function LoadingScreen({ label }: { label: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,4,8,0.97)', fontFamily: "'Share Tech Mono', monospace" }}>
      <Database style={{ width: 48, height: 48, color: '#00d4ff', marginBottom: 20 }} className="animate-pulse" />
      <div style={{ fontSize: 18, color: '#00d4ff', textShadow: '0 0 10px #00d4ff', letterSpacing: '0.15em' }}>
        LOADING {label}...
      </div>
      <div style={{ width: 200, height: 6, border: '1px solid rgba(0,212,255,0.4)', marginTop: 24, padding: 1 }}>
        <div style={{ height: '100%', background: '#00d4ff', animation: 'pulse 1s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function filterBySearch<T extends { name?: string; title?: string }>(items: T[], search: string): T[] {
  if (!search.trim()) return items;
  const q = search.toLowerCase();
  return items.filter(item =>
    (item.name ?? '').toLowerCase().includes(q) ||
    (item.title ?? '').toLowerCase().includes(q)
  );
}

export default function Home() {
  const [section, setSection] = useState<Section>('planets');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: planets, isLoading: planetsLoading } = usePlanets();
  const { data: films,   isLoading: filmsLoading   } = useFilms();
  const { data: people,  isLoading: peopleLoading  } = usePeople();
  const { data: ships,   isLoading: shipsLoading   } = useStarships();
  const { data: vehicles,isLoading: vehiclesLoading} = useVehicles();

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setSearch('');
    setSelectedId(null);
  };

  const filteredPlanets   = useMemo(() => filterBySearch(planets   ?? [], search), [planets,   search]);
  const filteredFilms     = useMemo(() => filterBySearch(films     ?? [], search), [films,     search]);
  const filteredPeople    = useMemo(() => filterBySearch(people    ?? [], search), [people,    search]);
  const filteredShips     = useMemo(() => filterBySearch(ships     ?? [], search), [ships,     search]);
  const filteredVehicles  = useMemo(() => filterBySearch(vehicles  ?? [], search), [vehicles,  search]);

  const selectedPlanet   = section === 'planets'   ? (planets   ?? []).find(p => p.id === selectedId)   : undefined;
  const selectedFilm     = section === 'films'     ? (films     ?? []).find(f => f.id === selectedId)   : undefined;
  const selectedPerson   = section === 'people'    ? (people    ?? []).find(p => p.id === selectedId)   : undefined;
  const selectedShip     = section === 'starships' ? (ships     ?? []).find(s => s.id === selectedId)   : undefined;
  const selectedVehicle  = section === 'vehicles'  ? (vehicles  ?? []).find(v => v.id === selectedId)   : undefined;

  const hasDetail = !!(selectedPlanet || selectedFilm || selectedPerson || selectedShip || selectedVehicle);

  const isLoading =
    (section === 'planets'   && planetsLoading)  ||
    (section === 'films'     && filmsLoading)    ||
    (section === 'people'    && peopleLoading)   ||
    (section === 'starships' && shipsLoading)    ||
    (section === 'vehicles'  && vehiclesLoading);

  const totalCount = {
    planets:   planets?.length ?? 0,
    films:     films?.length ?? 0,
    people:    people?.length ?? 0,
    starships: ships?.length ?? 0,
    vehicles:  vehicles?.length ?? 0,
  }[section];

  const filteredCount = {
    planets:   filteredPlanets.length,
    films:     filteredFilms.length,
    people:    filteredPeople.length,
    starships: filteredShips.length,
    vehicles:  filteredVehicles.length,
  }[section];

  const font = "'Share Tech Mono', monospace";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#000408', fontFamily: font }}>
      <ScanlineOverlay />

      <TopNav
        activeSection={section}
        onSectionChange={handleSectionChange}
        search={search}
        onSearchChange={v => { setSearch(v); setSelectedId(null); }}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Main content — animated on section change */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key={`loading-${section}`} style={{ flex: 1, display: 'flex' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingScreen label={section.toUpperCase()} />
            </motion.div>
          ) : section === 'planets' ? (
            /* ── PLANETS: galaxy map ── */
            <motion.div key="planets" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 20, pointerEvents: 'none', fontFamily: font }}>
                <div style={{ fontSize: 10, color: 'rgba(0,212,255,0.65)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Activity style={{ width: 12, height: 12 }} className="animate-pulse" />
                  GALACTIC DATABASE
                </div>
                <div style={{ fontSize: 20, color: '#fff', textShadow: '0 0 8px #00d4ff, 0 0 15px rgba(0,212,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  All Known Planets
                </div>
                <div style={{ height: 1, background: 'rgba(0,212,255,0.3)', marginTop: 6 }} />
                <div style={{ fontSize: 10, color: 'rgba(0,212,255,0.45)', marginTop: 4 }}>
                  {search ? `RESULTS: ${filteredCount} / ${totalCount}` : `SYSTEMS SCANNED: ${totalCount}`}
                </div>
              </div>
              {filteredPlanets.length > 0 && (
                <GalaxyMap
                  planets={filteredPlanets}
                  selectedId={selectedId}
                  onSelect={id => setSelectedId(prev => prev === id ? null : id)}
                />
              )}
            </motion.div>
          ) : (
            /* ── LIST VIEW ── */
            <motion.div key={section} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(0,212,255,0.12)', fontSize: 10, color: 'rgba(0,212,255,0.5)', fontFamily: font, flexShrink: 0 }}>
                {search ? `SHOWING ${filteredCount} OF ${totalCount} RECORDS` : `${totalCount} RECORDS IN DATABASE`}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
                {section === 'films'     && <FilmsList     films={filteredFilms}       selectedId={selectedId} onSelect={id => setSelectedId(prev => prev === id ? null : id)} />}
                {section === 'people'    && <PeopleList    people={filteredPeople}     selectedId={selectedId} onSelect={id => setSelectedId(prev => prev === id ? null : id)} />}
                {section === 'starships' && <StarshipsList starships={filteredShips}   selectedId={selectedId} onSelect={id => setSelectedId(prev => prev === id ? null : id)} />}
                {section === 'vehicles'  && <VehiclesList  vehicles={filteredVehicles} selectedId={selectedId} onSelect={id => setSelectedId(prev => prev === id ? null : id)} />}
                {filteredCount === 0 && (
                  <div style={{ textAlign: 'center', color: 'rgba(0,212,255,0.4)', padding: 40, fontFamily: font, fontSize: 13, letterSpacing: '0.1em' }}>
                    [ NO RECORDS MATCH QUERY ]
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail panel — slides in/out from the right */}
        <AnimatePresence>
          {hasDetail && (
            <motion.div
              key="detail-panel"
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0,   opacity: 1 }}
              exit={{   x: 380, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{ width: 380, height: '100%', background: 'rgba(0,8,18,0.95)', borderLeft: '1px solid rgba(0,212,255,0.2)', flexShrink: 0, overflow: 'hidden', boxShadow: '-8px 0 24px rgba(0,0,0,0.6)' }}
            >
              {selectedPlanet  && <PlanetDetailPanel   planet={selectedPlanet}   onClose={() => setSelectedId(null)} />}
              {selectedFilm    && <FilmDetailPanel     film={selectedFilm}       onClose={() => setSelectedId(null)} />}
              {selectedPerson  && <PersonDetailPanel   person={selectedPerson}   onClose={() => setSelectedId(null)} />}
              {selectedShip    && <StarshipDetailPanel starship={selectedShip}   onClose={() => setSelectedId(null)} />}
              {selectedVehicle && <VehicleDetailPanel  vehicle={selectedVehicle} onClose={() => setSelectedId(null)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
