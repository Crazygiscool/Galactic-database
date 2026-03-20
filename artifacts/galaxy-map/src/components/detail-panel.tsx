import React from "react";
import { X, ChevronRight } from "lucide-react";
import {
  Film,
  Person,
  Starship,
  Vehicle,
  Planet,
  useResident,
  useNameLookup,
  Section,
} from "@/hooks/use-swapi";

const font = "'Share Tech Mono', monospace";

interface LinkHandler {
  onLinkClick?: (section: Section, id: string) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  const display =
    !value || value === "unknown" || value === "n/a"
      ? "CLASSIFIED"
      : value.toUpperCase();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 8,
        fontSize: 12,
        fontFamily: font,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "hsl(var(--muted-foreground))",
          flexShrink: 0,
          width: "40%",
        }}
      >
        <ChevronRight
          style={{ width: 10, height: 10, marginRight: 4, flexShrink: 0 }}
        />
        <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </span>
      </div>
      <div
        style={{
          color: "hsl(var(--primary))",
          textAlign: "right",
          fontWeight: "bold",
          textShadow: "0 0 5px hsl(var(--primary)/0.3)",
          letterSpacing: "0.04em",
          wordBreak: "break-word",
        }}
      >
        {display}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: "hsl(var(--muted-foreground))",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        borderBottom: "1px solid hsl(var(--border))",
        paddingBottom: 4,
        marginBottom: 10,
        marginTop: 16,
        fontFamily: font,
      }}
    >
      [{title}]
    </div>
  );
}

function LinkTag({
  url,
  onLinkClick,
  type,
}: {
  url: string;
  onLinkClick?: (section: Section, id: string) => void;
  type: "person" | "planet" | "starship" | "vehicle" | "film" | "species";
}) {
  const { data } = useNameLookup(url);
  const display = data?.name ?? data?.title ?? "...";
  const id = url.split("/").filter(Boolean).pop() ?? "";

  const sectionMap: Record<string, Section> = {
    people: "characters",
    planets: "planets",
    starships: "starships",
    vehicles: "vehicles",
    films: "films",
    species: "species",
  };

  const section = sectionMap[type] ?? type;

  return (
    <button
      onClick={() => onLinkClick && onLinkClick(section, id)}
      style={{
        fontSize: 11,
        color: "hsl(var(--primary))",
        padding: "3px 6px",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--primary)/0.08)",
        fontFamily: font,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 4,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "hsl(var(--primary)/0.2)";
        e.currentTarget.style.borderColor = "hsl(var(--primary))";
        e.currentTarget.style.color = "hsl(var(--foreground))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "hsl(var(--primary)/0.08)";
        e.currentTarget.style.borderColor = "hsl(var(--border))";
        e.currentTarget.style.color = "hsl(var(--primary))";
      }}
    >
      {display}
    </button>
  );
}

function ResidentRow({
  url,
  onLinkClick,
}: {
  url: string;
  onLinkClick?: (section: Section, id: string) => void;
}) {
  const { data: resident, isLoading } = useResident(url);
  const id = url.split("/").filter(Boolean).pop() ?? "";

  if (isLoading) {
    return (
      <div
        style={{
          fontSize: 12,
          color: "hsl(var(--primary))",
          padding: "5px 8px",
          border: "1px solid hsl(var(--border))",
          background: "hsl(var(--muted))",
          fontFamily: font,
          textTransform: "uppercase",
          marginBottom: 4,
          letterSpacing: "0.04em",
        }}
      >
        ...
      </div>
    );
  }

  return (
    <button
      onClick={() => onLinkClick && onLinkClick("characters", id)}
      style={{
        fontSize: 12,
        color: "hsl(var(--primary))",
        padding: "5px 8px",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--muted))",
        fontFamily: font,
        textTransform: "uppercase",
        marginBottom: 4,
        letterSpacing: "0.04em",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "hsl(var(--primary)/0.1)";
        e.currentTarget.style.borderColor = "hsl(var(--primary))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "hsl(var(--muted))";
        e.currentTarget.style.borderColor = "hsl(var(--border))";
      }}
    >
      {resident?.name ?? "UNKNOWN"}
    </button>
  );
}

interface PanelShellProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}
function PanelShell({ title, subtitle, onClose, children }: PanelShellProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: font,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid hsl(var(--border))",
          background: "hsl(var(--muted))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "hsl(var(--muted-foreground))",
              letterSpacing: "0.15em",
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "hsl(var(--foreground))",
              textShadow:
                "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)/0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)/0.3), transparent)",
              marginTop: 6,
            }}
          />
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid transparent",
            padding: 4,
            cursor: "pointer",
            color: "hsl(var(--muted-foreground))",
            flexShrink: 0,
            marginLeft: 8,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "hsl(var(--foreground))";
            (e.currentTarget as HTMLElement).style.borderColor =
              "hsl(var(--border))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "hsl(var(--muted-foreground))";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {children}
      </div>
      <div
        style={{
          height: 28,
          borderTop: "1px solid hsl(var(--border))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          fontSize: 10,
          color: "hsl(var(--muted-foreground))",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "hsl(var(--primary))",
              display: "inline-block",
            }}
          />
          TERMINAL ONLINE
        </span>
        <span>SYS.V 1.0.4</span>
      </div>
    </div>
  );
}

export function PlanetDetailPanel({
  planet,
  onClose,
  onLinkClick,
  locations,
}: {
  planet: Planet;
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
  locations?: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
  }>;
}) {
  return (
    <PanelShell
      title={planet.name}
      subtitle="SYSTEM.DESIGNATION"
      onClose={onClose}
    >
      <SectionTitle title="ENVIRONMENTAL.DAT" />
      <Row label="Climate" value={planet.climate} />
      <Row label="Terrain" value={planet.terrain} />
      <Row label="Population" value={planet.population} />
      <Row label="Diameter" value={`${planet.diameter} km`} />
      <Row label="Gravity" value={planet.gravity} />
      <Row label="Orbital Period" value={`${planet.orbital_period} days`} />
      <Row label="Rotation Period" value={`${planet.rotation_period} hrs`} />
      <Row label="Surface Water" value={`${planet.surface_water}%`} />

      {locations && locations.length > 0 && (
        <>
          <SectionTitle title="KNOWN.LOCATIONS" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onLinkClick && onLinkClick("locations", loc.id)}
                style={{
                  fontSize: 10,
                  color: "hsl(var(--primary))",
                  padding: "4px 8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--primary)/0.08)",
                  fontFamily: font,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(var(--primary)/0.2)";
                  e.currentTarget.style.borderColor = "hsl(var(--primary))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "hsl(var(--primary)/0.08)";
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                }}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </>
      )}

      {planet.residents.length > 0 && (
        <>
          <SectionTitle title="KNOWN.PERSONNEL" />
          {planet.residents.map((url) => (
            <ResidentRow key={url} url={url} onLinkClick={onLinkClick} />
          ))}
        </>
      )}
    </PanelShell>
  );
}

export function FilmDetailPanel({
  film,
  onClose,
  onLinkClick,
}: {
  film: Film;
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}) {
  return (
    <PanelShell
      title={film.title}
      subtitle={`EPISODE ${film.episode_id}`}
      onClose={onClose}
    >
      <SectionTitle title="FILM.DAT" />
      <Row label="Director" value={film.director} />
      <Row label="Producer" value={film.producer} />
      <Row label="Released" value={film.release_date} />

      <SectionTitle title="OPENING.CRAWL" />
      <div
        style={{
          fontSize: 11,
          color: "hsl(var(--muted-foreground))",
          fontFamily: font,
          lineHeight: 1.7,
          letterSpacing: "0.04em",
          whiteSpace: "pre-wrap",
          background: "hsl(var(--muted))",
          border: "1px solid hsl(var(--border))",
          padding: 10,
          maxHeight: 160,
          overflowY: "auto",
        }}
      >
        {film.opening_crawl}
      </div>

      {film.characters.length > 0 && (
        <>
          <SectionTitle title="CHARACTERS" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {film.characters.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="person"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
      {film.planets.length > 0 && (
        <>
          <SectionTitle title="PLANETS" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {film.planets.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="planet"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
      {film.starships.length > 0 && (
        <>
          <SectionTitle title="STARSHIPS" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {film.starships.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="starship"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
    </PanelShell>
  );
}

export function PersonDetailPanel({
  person,
  onClose,
  onLinkClick,
}: {
  person: Person;
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}) {
  return (
    <PanelShell title={person.name} subtitle="PERSONNEL.FILE" onClose={onClose}>
      {person.image && (
        <div
          style={{
            width: "100%",
            height: 150,
            marginBottom: 16,
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <img
            src={person.image}
            alt={person.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {person.starships.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="starship"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
      {person.vehicles.length > 0 && (
        <>
          <SectionTitle title="VEHICLES.PILOTED" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {person.vehicles.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="vehicle"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
    </PanelShell>
  );
}

export function StarshipDetailPanel({
  starship,
  onClose,
  onLinkClick,
}: {
  starship: Starship;
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}) {
  return (
    <PanelShell
      title={starship.name}
      subtitle="VESSEL.RECORD"
      onClose={onClose}
    >
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {starship.pilots.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="person"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
    </PanelShell>
  );
}

export function VehicleDetailPanel({
  vehicle,
  onClose,
  onLinkClick,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}) {
  return (
    <PanelShell
      title={vehicle.name}
      subtitle="VEHICLE.RECORD"
      onClose={onClose}
    >
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {vehicle.pilots.map((url) => (
              <LinkTag
                key={url}
                url={url}
                type="person"
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </>
      )}
    </PanelShell>
  );
}
