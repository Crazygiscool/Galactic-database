import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Film, Person, Starship, Vehicle, Planet, useResident, useNameLookup } from '@/hooks/use-swapi';
import { TerminalContainer, TerminalText } from './terminal-effects';

const font = "'Share Tech Mono', monospace";

function Row({ label, value }: { label: string; value: string }) {
  const display = (!value || value === 'unknown' || value === 'n/a') ? 'CLASSIFIED' : value.toUpperCase();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 12, fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(0,212,255,0.55)', flexShrink: 0, width: '40%' }}>
        <ChevronRight style={{ width: 10, height: 10, marginRight: 4, flexShrink: 0 }} />
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ color: '#00d4ff', textAlign: 'right', fontWeight: 'bold', textShadow: '0 0 5px rgba(0,212,255,0.3)', letterSpacing: '0.04em', wordBreak: 'break-word' }}>
        {display}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ fontSize: 10, color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '1px solid rgba(0,212,255,0.15)', paddingBottom: 4, marginBottom: 10, marginTop: 16, fontFamily: font }}>
      [{title}]
    </div>
  );
}

function NameTag({ url }: { url: string }) {
  const { data } = useNameLookup(url);
  const display = data?.name ?? data?.title ?? '...';
  return (
    <div style={{ fontSize: 11, color: '#00d4ff', padding: '3px 6px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
      {display}
    </div>
  );
}

function ResidentRow({ url }: { url: string }) {
  const { data: resident, isLoading } = useResident(url);
  return (
    <div style={{ fontSize: 12, color: '#00d4ff', padding: '5px 8px', border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,0,0,0.3)', fontFamily: font, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.04em' }}>
      {isLoading ? <TerminalText text="DECRYPTING..." speed={40} /> : (resident?.name ?? 'UNKNOWN')}
    </div>
  );
}

interface PanelShellProps { title: string; subtitle: string; onClose: () => void; children: React.ReactNode; }
function PanelShell({ title, subtitle, onClose, children }: PanelShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,8,18,0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(0,212,255,0.5)', letterSpacing: '0.15em', marginBottom: 4, textTransform: 'uppercase' }}>{subtitle}</div>
          <div style={{ fontSize: 20, color: '#ffffff', textShadow: '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2 }}>{title}</div>
          <div style={{ height: 1, background: 'linear-gradient(to right, #00d4ff, rgba(0,212,255,0.3), transparent)', marginTop: 6 }} />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid transparent', padding: 4, cursor: 'pointer', color: 'rgba(0,212,255,0.5)', flexShrink: 0, marginLeft: 8 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,212,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {children}
      </div>
      <div style={{ height: 28, borderTop: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 10, color: 'rgba(0,212,255,0.45)', flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', display: 'inline-block' }} />TERMINAL ONLINE</span>
        <span>SYS.V 1.0.4</span>
      </div>
    </div>
  );
}

export function PlanetDetailPanel({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <PanelShell title={planet.name} subtitle="SYSTEM.DESIGNATION" onClose={onClose}>
      <SectionTitle title="ENVIRONMENTAL.DAT" />
      <Row label="Climate" value={planet.climate} />
      <Row label="Terrain" value={planet.terrain} />
      <Row label="Population" value={planet.population} />
      <Row label="Diameter" value={`${planet.diameter} km`} />
      <Row label="Gravity" value={planet.gravity} />
      <Row label="Orbital Period" value={`${planet.orbital_period} days`} />
      <Row label="Rotation Period" value={`${planet.rotation_period} hrs`} />
      <Row label="Surface Water" value={`${planet.surface_water}%`} />

      {planet.residents.length > 0 && (
        <>
          <SectionTitle title="KNOWN.PERSONNEL" />
          {planet.residents.map(url => <ResidentRow key={url} url={url} />)}
        </>
      )}
    </PanelShell>
  );
}

export function FilmDetailPanel({ film, onClose }: { film: Film; onClose: () => void }) {
  return (
    <PanelShell title={film.title} subtitle={`EPISODE ${film.episode_id}`} onClose={onClose}>
      <SectionTitle title="FILM.DAT" />
      <Row label="Director" value={film.director} />
      <Row label="Producer" value={film.producer} />
      <Row label="Released" value={film.release_date} />

      <SectionTitle title="OPENING.CRAWL" />
      <div style={{ fontSize: 11, color: 'rgba(0,212,255,0.7)', fontFamily: font, lineHeight: 1.7, letterSpacing: '0.04em', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,212,255,0.1)', padding: 10, maxHeight: 160, overflowY: 'auto' }}>
        {film.opening_crawl}
      </div>

      {film.characters.length > 0 && (
        <>
          <SectionTitle title="CHARACTERS" />
          {film.characters.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
      {film.planets.length > 0 && (
        <>
          <SectionTitle title="PLANETS" />
          {film.planets.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
      {film.starships.length > 0 && (
        <>
          <SectionTitle title="STARSHIPS" />
          {film.starships.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
    </PanelShell>
  );
}

export function PersonDetailPanel({ person, onClose }: { person: Person; onClose: () => void }) {
  return (
    <PanelShell title={person.name} subtitle="PERSONNEL.FILE" onClose={onClose}>
      <SectionTitle title="BIO.DAT" />
      <Row label="Birth Year" value={person.birth_year} />
      <Row label="Gender" value={person.gender} />
      <Row label="Height" value={`${person.height} cm`} />
      <Row label="Mass" value={`${person.mass} kg`} />
      <Row label="Hair Color" value={person.hair_color} />
      <Row label="Skin Color" value={person.skin_color} />
      <Row label="Eye Color" value={person.eye_color} />

      {person.starships.length > 0 && (
        <>
          <SectionTitle title="STARSHIPS.PILOTED" />
          {person.starships.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
      {person.vehicles.length > 0 && (
        <>
          <SectionTitle title="VEHICLES.PILOTED" />
          {person.vehicles.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
    </PanelShell>
  );
}

export function StarshipDetailPanel({ starship, onClose }: { starship: Starship; onClose: () => void }) {
  return (
    <PanelShell title={starship.name} subtitle="VESSEL.RECORD" onClose={onClose}>
      <SectionTitle title="VESSEL.DAT" />
      <Row label="Class" value={starship.starship_class} />
      <Row label="Model" value={starship.model} />
      <Row label="Manufacturer" value={starship.manufacturer} />
      <Row label="Cost" value={`${starship.cost_in_credits} credits`} />
      <Row label="Length" value={`${starship.length} m`} />
      <Row label="Crew" value={starship.crew} />
      <Row label="Passengers" value={starship.passengers} />
      <Row label="Cargo" value={`${starship.cargo_capacity} kg`} />
      <Row label="Hyperdrive" value={starship.hyperdrive_rating} />
      <Row label="MGLT" value={starship.MGLT} />
      <Row label="Max Speed" value={starship.max_atmosphering_speed} />

      {starship.pilots.length > 0 && (
        <>
          <SectionTitle title="KNOWN.PILOTS" />
          {starship.pilots.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
    </PanelShell>
  );
}

export function VehicleDetailPanel({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  return (
    <PanelShell title={vehicle.name} subtitle="VEHICLE.RECORD" onClose={onClose}>
      <SectionTitle title="VEHICLE.DAT" />
      <Row label="Class" value={vehicle.vehicle_class} />
      <Row label="Model" value={vehicle.model} />
      <Row label="Manufacturer" value={vehicle.manufacturer} />
      <Row label="Cost" value={`${vehicle.cost_in_credits} credits`} />
      <Row label="Length" value={`${vehicle.length} m`} />
      <Row label="Crew" value={vehicle.crew} />
      <Row label="Passengers" value={vehicle.passengers} />
      <Row label="Cargo" value={`${vehicle.cargo_capacity} kg`} />
      <Row label="Max Speed" value={vehicle.max_atmosphering_speed} />
      <Row label="Consumables" value={vehicle.consumables} />

      {vehicle.pilots.length > 0 && (
        <>
          <SectionTitle title="KNOWN.PILOTS" />
          {vehicle.pilots.map(url => <NameTag key={url} url={url} />)}
        </>
      )}
    </PanelShell>
  );
}
