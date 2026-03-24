import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Section,
  usePlanets,
  useFilms,
  useStarships,
  useVehicles,
  useMergedCharacters,
  useDatabankCreatures,
  useDatabankDroids,
  useMergedLocations,
  useDatabankOrganizations,
  useDatabankSpecies,
  Planet,
  Film,
  Starship,
  Vehicle,
  Person,
  DatabankItem,
} from "@/hooks/use-swapi";
import { GalaxyMap } from "@/components/galaxy-map";
import { ScanlineOverlay } from "@/components/terminal-effects";
import { TopBar, BottomNav, Theme } from "@/components/bottom-nav";
import { FilmsList, StarshipsList, VehiclesList } from "@/components/list-view";
import { DatabankList, DatabankDetailPanel } from "@/components/databank-list";
import {
  PlanetDetailPanel,
  FilmDetailPanel,
  PersonDetailPanel,
  StarshipDetailPanel,
  VehicleDetailPanel,
} from "@/components/detail-panel";
import {
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const PAGE_SIZE = 25;
const SCALE = 1.1;

const font = "'Share Tech Mono', monospace";

function LoadingScreen({ label }: { label: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        fontFamily: font,
      }}
    >
      <Database
        style={{
          width: 48 * SCALE,
          height: 48 * SCALE,
          color: "var(--primary)",
          marginBottom: 20 * SCALE,
        }}
        className="animate-pulse"
      />
      <div
        style={{
          fontSize: 18 * SCALE,
          color: "var(--primary)",
          textShadow: "0 0 10px var(--primary)",
          letterSpacing: "0.15em",
        }}
      >
        LOADING {label}...
      </div>
      <div
        style={{
          width: 200 * SCALE,
          height: 6 * SCALE,
          border: "1px solid var(--border)",
          marginTop: 24 * SCALE,
          padding: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--primary)",
            animation: "pulse 1s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

function filterBySearch<T extends { name?: string; title?: string }>(
  items: T[],
  search: string,
): T[] {
  if (!search.trim()) return items;
  const q = search.toLowerCase();
  return items.filter(
    (item) =>
      (item.name ?? "").toLowerCase().includes(q) ||
      (item.title ?? "").toLowerCase().includes(q),
  );
}

interface SearchResult {
  id: string;
  name: string;
  section: Section;
}

export default function Home() {
  const [section, setSection] = useState<Section>("planets");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [linkedSection, setLinkedSection] = useState<Section | null>(null);
  const [page, setPage] = useState(0);
  const [theme, setTheme] = useState<Theme>("imperial");
  const [showGlobalResults, setShowGlobalResults] = useState(false);

  const { data: planets, isLoading: planetsLoading } = usePlanets();
  const { data: films, isLoading: filmsLoading } = useFilms();
  const { data: starships, isLoading: starshipsLoading } = useStarships();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: characters, isLoading: charactersLoading } =
    useMergedCharacters();
  const { data: creatures, isLoading: creaturesLoading } =
    useDatabankCreatures();
  const { data: droids, isLoading: droidsLoading } = useDatabankDroids();
  const { data: mergedLocations, isLoading: locationsLoading } =
    useMergedLocations();
  const { data: organizations, isLoading: organizationsLoading } =
    useDatabankOrganizations();
  const { data: species, isLoading: speciesLoading } = useDatabankSpecies();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const allData = useMemo(
    () => ({
      planets: planets ?? [],
      films: films ?? [],
      characters: characters ?? [],
      starships: starships ?? [],
      vehicles: vehicles ?? [],
      creatures: creatures ?? [],
      droids: droids ?? [],
      locations: mergedLocations ?? [],
      organizations: organizations ?? [],
      species: species ?? [],
    }),
    [
      planets,
      films,
      characters,
      starships,
      vehicles,
      creatures,
      droids,
      mergedLocations,
      organizations,
      species,
    ],
  );

  const globalSearchResults = useMemo(() => {
    if (!search.trim() || search.length < 2) return [];
    const results: SearchResult[] = [];
    const q = search.toLowerCase();

    Object.entries(allData).forEach(([sec, items]) => {
      items.forEach((item: any) => {
        const name = (item.name || item.title || "").toLowerCase();
        if (name.includes(q)) {
          results.push({
            id: item.id,
            name: item.name || item.title || "",
            section: sec as Section,
          });
        }
      });
    });

    return results.slice(0, 20);
  }, [search, allData]);

  const handleGlobalSearchSelect = useCallback((result: SearchResult) => {
    setSection(result.section);
    setSelectedId(result.id);
    setSearch("");
    setShowGlobalResults(false);
    setPage(0);
  }, []);

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setSearch("");
    setSelectedId(null);
    setLinkedSection(null);
    setPage(0);
    setShowGlobalResults(false);
  };

  const handleLinkClick = (targetSection: Section, targetId: string) => {
    setLinkedSection(section);
    setSection(targetSection);
    setSelectedId(targetId);
    setPage(0);
  };

  const filteredPlanets = useMemo(
    () => filterBySearch(planets ?? [], search),
    [planets, search],
  );
  const filteredFilms = useMemo(
    () => filterBySearch(films ?? [], search),
    [films, search],
  );
  const filteredStarships = useMemo(
    () => filterBySearch(starships ?? [], search),
    [starships, search],
  );
  const filteredVehicles = useMemo(
    () => filterBySearch(vehicles ?? [], search),
    [vehicles, search],
  );
  const filteredCharacters = useMemo(
    () => filterBySearch(characters ?? [], search),
    [characters, search],
  );
  const filteredCreatures = useMemo(
    () => filterBySearch(creatures ?? [], search),
    [creatures, search],
  );
  const filteredDroids = useMemo(
    () => filterBySearch(droids ?? [], search),
    [droids, search],
  );
  const filteredLocations = useMemo(
    () => filterBySearch(mergedLocations ?? [], search),
    [mergedLocations, search],
  );
  const filteredOrganizations = useMemo(
    () => filterBySearch(organizations ?? [], search),
    [organizations, search],
  );
  const filteredSpecies = useMemo(
    () => filterBySearch(species ?? [], search),
    [species, search],
  );

  const selectedPlanet =
    section === "planets"
      ? (planets ?? []).find((p) => p.id === selectedId)
      : undefined;
  const selectedFilm =
    section === "films"
      ? (films ?? []).find((f) => f.id === selectedId)
      : undefined;
  const selectedStarship =
    section === "starships"
      ? (starships ?? []).find((s) => s.id === selectedId)
      : undefined;
  const selectedVehicle =
    section === "vehicles"
      ? (vehicles ?? []).find((v) => v.id === selectedId)
      : undefined;
  const selectedCharacter =
    section === "characters"
      ? (characters ?? []).find((c) => c.id === selectedId)
      : undefined;

  const planetLocations = useMemo(() => {
    if (!selectedPlanet) return [];
    return (mergedLocations ?? []).filter(
      (loc) => loc.name.toLowerCase() === selectedPlanet.name.toLowerCase(),
    );
  }, [selectedPlanet, mergedLocations]);

  const getSelectedDatabankItem = ():
    | (DatabankItem & { planetId?: string })
    | undefined => {
    if (section === "creatures")
      return creatures?.find((c) => c.id === selectedId);
    if (section === "droids") return droids?.find((d) => d.id === selectedId);
    if (section === "organizations")
      return organizations?.find((o) => o.id === selectedId);
    if (section === "species") return species?.find((s) => s.id === selectedId);
    return undefined;
  };

  const selectedDatabankItem = getSelectedDatabankItem();

  const hasDetail = !!(
    selectedPlanet ||
    selectedFilm ||
    selectedStarship ||
    selectedVehicle ||
    selectedCharacter ||
    selectedDatabankItem
  );

  const isLoading =
    (section === "planets" && planetsLoading) ||
    (section === "films" && filmsLoading) ||
    (section === "starships" && starshipsLoading) ||
    (section === "vehicles" && vehiclesLoading) ||
    (section === "characters" && charactersLoading) ||
    (section === "creatures" && creaturesLoading) ||
    (section === "droids" && droidsLoading) ||
    (section === "locations" && locationsLoading) ||
    (section === "organizations" && organizationsLoading) ||
    (section === "species" && speciesLoading);

  const totalCount: Record<Section, number> = {
    planets: planets?.length ?? 0,
    films: films?.length ?? 0,
    characters: characters?.length ?? 0,
    starships: starships?.length ?? 0,
    vehicles: vehicles?.length ?? 0,
    creatures: creatures?.length ?? 0,
    droids: droids?.length ?? 0,
    locations: mergedLocations?.length ?? 0,
    organizations: organizations?.length ?? 0,
    species: species?.length ?? 0,
  };

  const filteredCount: Record<Section, number> = {
    planets: filteredPlanets.length,
    films: filteredFilms.length,
    characters: filteredCharacters.length,
    starships: filteredStarships.length,
    vehicles: filteredVehicles.length,
    creatures: filteredCreatures.length,
    droids: filteredDroids.length,
    locations: filteredLocations.length,
    organizations: filteredOrganizations.length,
    species: filteredSpecies.length,
  };

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const getItemsForSection = () => {
    switch (section) {
      case "films":
        return filteredFilms;
      case "starships":
        return filteredStarships;
      case "vehicles":
        return filteredVehicles;
      case "characters":
        return filteredCharacters as unknown as DatabankItem[];
      case "creatures":
        return filteredCreatures;
      case "droids":
        return filteredDroids;
      case "locations":
        return filteredLocations as unknown as DatabankItem[];
      case "organizations":
        return filteredOrganizations;
      case "species":
        return filteredSpecies;
      default:
        return [];
    }
  };

  const totalItems = filteredCount[section];
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedItems = getItemsForSection().slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12 * SCALE,
          padding: "12px 0",
          borderTop: "1px solid var(--border)",
          marginTop: 12 * SCALE,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{
            background: "var(--muted)",
            border: "1px solid var(--border)",
            color: page === 0 ? "var(--muted-foreground)" : "var(--primary)",
            padding: `${6 * SCALE}px ${12 * SCALE}px`,
            cursor: page === 0 ? "not-allowed" : "pointer",
            fontFamily: font,
            fontSize: 11 * SCALE,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronLeft size={14 * SCALE} /> PREV
        </button>
        <span
          style={{
            color: "var(--muted-foreground)",
            fontSize: 11 * SCALE,
            fontFamily: font,
          }}
        >
          PAGE {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          style={{
            background: "var(--muted)",
            border: "1px solid var(--border)",
            color:
              page >= totalPages - 1
                ? "var(--muted-foreground)"
                : "var(--primary)",
            padding: `${6 * SCALE}px ${12 * SCALE}px`,
            cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
            fontFamily: font,
            fontSize: 11 * SCALE,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          NEXT <ChevronRight size={14 * SCALE} />
        </button>
      </div>
    );
  };

  const renderListSection = () => {
    switch (section) {
      case "films":
        return (
          <FilmsList
            films={paginatedItems as Film[]}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        );
      case "starships":
        return (
          <StarshipsList
            starships={paginatedItems as Starship[]}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        );
      case "vehicles":
        return (
          <VehiclesList
            vehicles={paginatedItems as Vehicle[]}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        );
      case "characters":
      case "creatures":
      case "droids":
      case "locations":
      case "organizations":
      case "species":
        return (
          <DatabankList
            items={paginatedItems as DatabankItem[]}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--background)",
        fontFamily: font,
      }}
    >
      <ScanlineOverlay />

      <TopBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setSelectedId(null);
          setShowGlobalResults(v.length >= 2);
        }}
        theme={theme}
        onThemeChange={setTheme}
      />

      <AnimatePresence>
        {showGlobalResults && globalSearchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: 52 * SCALE,
              left: "50%",
              transform: "translateX(-50%)",
              width: 400 * SCALE,
              maxHeight: 400 * SCALE,
              overflowY: "auto",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid var(--border)",
                fontSize: 10 * SCALE,
                color: "var(--muted-foreground)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Search size={12} />
              {globalSearchResults.length} RESULTS FOUND
            </div>
            {globalSearchResults.map((result, i) => (
              <button
                key={`${result.section}-${result.id}`}
                onClick={() => handleGlobalSearchSelect(result)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12 * SCALE,
                  padding: "10px 14px",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    i < globalSearchResults.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                <span
                  style={{
                    fontSize: 9 * SCALE,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    minWidth: 80 * SCALE,
                  }}
                >
                  {result.section}
                </span>
                <span
                  style={{
                    fontSize: 12 * SCALE,
                    color: "var(--foreground)",
                    fontFamily: font,
                  }}
                >
                  {result.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
          paddingBottom: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key={`loading-${section}`}
              style={{ flex: 1, display: "flex" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingScreen label={section.toUpperCase()} />
            </motion.div>
          ) : section === "planets" ? (
            <motion.div
              key={section}
              style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14 * SCALE,
                  left: 14 * SCALE,
                  zIndex: 20,
                  pointerEvents: "none",
                  fontFamily: font,
                }}
              >
                <div
                  style={{
                    fontSize: 10 * SCALE,
                    color: "var(--muted-foreground)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <Activity
                    style={{ width: 12 * SCALE, height: 12 * SCALE }}
                    className="animate-pulse"
                  />
                  GALACTIC DATABASE
                </div>
                <div
                  style={{
                    fontSize: 20 * SCALE,
                    color: "var(--foreground)",
                    textShadow: "0 0 8px var(--primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  All Known Planets
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    marginTop: 6,
                  }}
                />
                <div
                  style={{
                    fontSize: 10 * SCALE,
                    color: "var(--muted-foreground)",
                    marginTop: 4,
                  }}
                >
                  {search
                    ? `RESULTS: ${filteredCount[section]} / ${totalCount[section]}`
                    : `SYSTEMS SCANNED: ${totalCount[section]}`}
                </div>
              </div>
              {filteredPlanets.length > 0 && (
                <GalaxyMap
                  planets={
                    section === "planets"
                      ? filteredPlanets
                      : filteredLocations
                          .filter((l) => l.planet)
                          .map((l) => l.planet!)
                  }
                  selectedId={selectedId}
                  onSelect={(id) =>
                    setSelectedId((prev) => (prev === id ? null : id))
                  }
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={section}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div
                style={{
                  padding: `${8 * SCALE}px ${16 * SCALE}px`,
                  borderBottom: "1px solid var(--border)",
                  fontSize: 10 * SCALE,
                  color: "var(--muted-foreground)",
                  fontFamily: font,
                  flexShrink: 0,
                }}
              >
                {search
                  ? `SHOWING ${filteredCount[section]} OF ${totalCount[section]} RECORDS`
                  : `${totalCount[section]} RECORDS IN DATABASE`}
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: `${12 * SCALE}px ${14 * SCALE}px`,
                }}
              >
                {renderListSection()}
                {filteredCount[section] === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      padding: 40,
                      fontFamily: font,
                      fontSize: 13 * SCALE,
                      letterSpacing: "0.1em",
                    }}
                  >
                    [ NO RECORDS MATCH QUERY ]
                  </div>
                )}
                <PaginationControls />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasDetail && !isMobile && (
            <motion.div
              key="detail-panel-desktop"
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              style={{
                width: 420,
                height: "100%",
                background: "var(--card)",
                borderLeft: "1px solid var(--border)",
                flexShrink: 0,
                overflow: "hidden",
                boxShadow: "-8px 0 24px rgba(0,0,0,0.6)",
              }}
            >
              {selectedPlanet && (
                <PlanetDetailPanel
                  planet={selectedPlanet}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                  locations={planetLocations}
                />
              )}
              {selectedFilm && (
                <FilmDetailPanel
                  film={selectedFilm}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                />
              )}
              {selectedCharacter && (
                <PersonDetailPanel
                  person={selectedCharacter}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                />
              )}
              {selectedStarship && (
                <StarshipDetailPanel
                  starship={selectedStarship}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                />
              )}
              {selectedVehicle && (
                <VehicleDetailPanel
                  vehicle={selectedVehicle}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                />
              )}
              {selectedDatabankItem && (
                <DatabankDetailPanel
                  item={selectedDatabankItem}
                  onClose={() => setSelectedId(null)}
                  onLinkClick={handleLinkClick}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasDetail && isMobile && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasDetail && isMobile && (
          <motion.div
            key="mobile-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                setSelectedId(null);
              }
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              zIndex: 50,
              background: "var(--card)",
              borderTop: "1px solid var(--border)",
              borderRadius: "14px 14px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
              overflow: "hidden",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 34px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0 2px",
                cursor: "grab",
              }}
            >
              <div
                style={{
                  width: 36 * SCALE,
                  height: 3,
                  borderRadius: 2,
                  background: "var(--primary)",
                  opacity: 0.6,
                }}
              />
            </div>
            {selectedPlanet && (
              <PlanetDetailPanel
                planet={selectedPlanet}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
                locations={planetLocations}
              />
            )}
            {selectedFilm && (
              <FilmDetailPanel
                film={selectedFilm}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
              />
            )}
            {selectedCharacter && (
              <PersonDetailPanel
                person={selectedCharacter}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
              />
            )}
            {selectedStarship && (
              <StarshipDetailPanel
                starship={selectedStarship}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
              />
            )}
            {selectedVehicle && (
              <VehicleDetailPanel
                vehicle={selectedVehicle}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
              />
            )}
            {selectedDatabankItem && (
              <DatabankDetailPanel
                item={selectedDatabankItem}
                onClose={() => setSelectedId(null)}
                onLinkClick={handleLinkClick}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav
        activeSection={section}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
}
