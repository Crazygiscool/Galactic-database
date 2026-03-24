import React from "react";
import { motion } from "framer-motion";
import { Film, Person, Starship, Vehicle } from "@/hooks/use-swapi";
import {
  Film as FilmIcon,
  User,
  Rocket,
  Truck,
  ChevronRight,
} from "lucide-react";

const font = "'Share Tech Mono', monospace";

function ListCard({
  id,
  title,
  sub1,
  sub2,
  sub3,
  icon,
  onClick,
  selected,
}: {
  id: string;
  title: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  icon: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        cursor: "pointer",
        background: selected ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--card)",
        border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
        boxShadow: selected ? "0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)" : "none",
        fontFamily: font,
        transition: "all 0.15s",
        marginBottom: 6,
      }}
      whileHover={{
        borderColor: "var(--primary)",
        background: "color-mix(in srgb, var(--primary) 7%, transparent)",
      }}
    >
      <div
        style={{
          color: selected
            ? "var(--primary)"
            : "var(--muted-foreground)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: selected ? "var(--foreground)" : "var(--primary)",
            textShadow: selected ? "0 0 8px var(--primary)" : "none",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {sub1 && (
          <div
            style={{
              fontSize: 10,
              color: "var(--muted-foreground)",
              marginTop: 2,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {sub1}
          </div>
        )}
        {sub2 && (
          <div
            style={{
              fontSize: 10,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {sub2}
          </div>
        )}
        {sub3 && (
          <div
            style={{
              fontSize: 10,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {sub3}
          </div>
        )}
      </div>
      <ChevronRight
        style={{
          width: 14,
          height: 14,
          color: "var(--muted-foreground)",
          flexShrink: 0,
        }}
      />
    </motion.div>
  );
}

interface FilmsListProps {
  films: Film[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function FilmsList({ films, selectedId, onSelect }: FilmsListProps) {
  const sorted = [...films].sort((a, b) => a.episode_id - b.episode_id);
  return (
    <div>
      {sorted.map((f) => (
        <ListCard
          key={f.id}
          id={f.id}
          selected={selectedId === f.id}
          title={`EP ${f.episode_id}: ${f.title}`}
          sub1={`DIR: ${f.director}`}
          sub2={`RELEASED: ${f.release_date}`}
          icon={<FilmIcon style={{ width: 16, height: 16 }} />}
          onClick={() => onSelect(f.id)}
        />
      ))}
    </div>
  );
}

interface PeopleListProps {
  people: Person[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function PeopleList({ people, selectedId, onSelect }: PeopleListProps) {
  return (
    <div>
      {people.map((p) => (
        <ListCard
          key={p.id}
          id={p.id}
          selected={selectedId === p.id}
          title={p.name}
          sub1={`SPECIES: ${p.gender !== "unknown" ? p.gender.toUpperCase() : "UNCLASSIFIED"} · BORN: ${p.birth_year}`}
          sub2={`HEIGHT: ${p.height}cm · MASS: ${p.mass}kg`}
          icon={<User style={{ width: 16, height: 16 }} />}
          onClick={() => onSelect(p.id)}
        />
      ))}
    </div>
  );
}

interface StarshipsListProps {
  starships: Starship[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function StarshipsList({
  starships,
  selectedId,
  onSelect,
}: StarshipsListProps) {
  return (
    <div>
      {starships.map((s) => (
        <ListCard
          key={s.id}
          id={s.id}
          selected={selectedId === s.id}
          title={s.name}
          sub1={`CLASS: ${s.starship_class.toUpperCase()}`}
          sub2={`MODEL: ${s.model}`}
          sub3={`HYPERDRIVE: ${s.hyperdrive_rating} · CREW: ${s.crew}`}
          icon={<Rocket style={{ width: 16, height: 16 }} />}
          onClick={() => onSelect(s.id)}
        />
      ))}
    </div>
  );
}

interface VehiclesListProps {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function VehiclesList({
  vehicles,
  selectedId,
  onSelect,
}: VehiclesListProps) {
  return (
    <div>
      {vehicles.map((v) => (
        <ListCard
          key={v.id}
          id={v.id}
          selected={selectedId === v.id}
          title={v.name}
          sub1={`CLASS: ${v.vehicle_class.toUpperCase()}`}
          sub2={`MODEL: ${v.model}`}
          sub3={`CREW: ${v.crew} · MAX SPEED: ${v.max_atmosphering_speed}`}
          icon={<Truck style={{ width: 16, height: 16 }} />}
          onClick={() => onSelect(v.id)}
        />
      ))}
    </div>
  );
}
