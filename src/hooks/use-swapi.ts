import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type Section =
  | "planets"
  | "films"
  | "characters"
  | "starships"
  | "vehicles"
  | "creatures"
  | "droids"
  | "locations"
  | "organizations"
  | "species";

export interface Planet {
  id: string;
  name: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surface_water?: string;
  population?: string;
  residents?: string[];
  films?: string[];
  url?: string;
  description?: string;
  image?: string;
  region?: string;
  sector?: string;
  suns?: number;
  moons?: number;
  distance?: number;
  length_day?: number;
  length_year?: number;
  x?: number;
  y?: number;
}

export interface Film {
  id: string;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  url: string;
}

export interface Person {
  id: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  url: string;
  image?: string;
}

export interface Starship {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  url: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  url: string;
}

export interface Resident {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
}

export interface DatabankItem {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
}

async function fetchAllSWAPIInfo<T>(endpoint: string): Promise<T[]> {
  let all: T[] = [];
  let page = 1;
  const baseUrl = `https://swapi.info/api/${endpoint}?page=`;
  const MAX_PAGES = 20; // Guard against infinite loops
  const seenIds = new Set<string>(); // Detect duplicates (SWAPI.info pagination bug)

  while (page <= MAX_PAGES) {
    console.time(`[SWAPI.info] ${endpoint} page ${page}`);
    const res = await fetch(`${baseUrl}${page}`);
    if (!res.ok) {
      console.error(`[SWAPI.info] ${endpoint} page ${page}: HTTP ${res.status}`);
      throw new Error(`Terminal link failure: Unable to reach SWAPI (page ${page})`);
    }
    const data: T[] = await res.json();
    console.timeEnd(`[SWAPI.info] ${endpoint} page ${page}`);
    console.log(`[SWAPI.info] ${endpoint} page ${page}: ${data.length} items`);

    if (data.length === 0) break;

    const withId = data.map((item: any) => {
      const id = item.url.split("/").filter(Boolean).pop() ?? String(Math.random());
      if (seenIds.has(id)) {
        console.warn(`[SWAPI.info] ${endpoint}: Duplicate ID detected: ${id} on page ${page}`);
        return null;
      }
      seenIds.add(id);
      return { ...item, id };
    }).filter(Boolean);

    all = [...all, ...withId];

    // SWAPI.info pagination bug: if we got less than 10 items, assume it's the last page
    // Or if all items were duplicates
    if (data.length < 10 || withId.length === 0) {
      console.log(`[SWAPI.info] ${endpoint}: Assuming last page (${data.length} items, ${withId.length} new)`);
      break;
    }
    page++;
  }

  if (page > MAX_PAGES) {
    console.error(`[SWAPI.info] ${endpoint}: Hit MAX_PAGES guard (${MAX_PAGES}) - pagination may be broken`);
  }

  console.log(`[SWAPI.info] ${endpoint}: Total ${all.length} items fetched in ${page - 1} pages`);
  return all;
}

const STALE = 1000 * 60 * 60;

export function usePlanets() {
  return useQuery<Planet[]>({
    queryKey: ["planets"],
    queryFn: async () => {
      console.time("[Query] planets");
      try {
        const result = await fetchAllSWAPIInfo<Planet>("planets");
        console.timeEnd("[Query] planets");
        console.log(`[Query] planets: Loaded ${result.length} items`);
        return result;
      } catch (error) {
        console.timeEnd("[Query] planets");
        console.error("[Query] planets: FAILED", error);
        throw error;
      }
    },
    staleTime: STALE,
    onSuccess: (data) => console.log("[Query] planets: Success", { count: data.length }),
    onError: (error) => console.error("[Query] planets: Error", error),
  });
}

interface SWGalacticMapPlanet {
  Name: string;
  Image: string | null;
  X: number;
  Y: number;
  Region: string;
  Sector: string | null;
  Suns: number;
  Moons: number;
  Position: number;
  Distance: number;
  LengthDay: number;
  LengthYear: number;
  Diameter: number;
  Gravity: number;
}

export function useGalacticMapPlanets() {
  return useQuery<SWGalacticMapPlanet[]>({
    queryKey: ["galactic-map-planets"],
    queryFn: async () => {
      const res = await fetch("https://raw.githubusercontent.com/parzivail/SWGalacticMap/master/planets.json");
      if (!res.ok) throw new Error("Failed to fetch Galactic Map data");
      return res.json();
    },
    staleTime: STALE * 24,
  });
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[ivxlc]+$/i, "").replace(/\s+/g, " ").trim();
}

export const REGION_COORDS: Record<string, { x: number; y: number }> = {
  "Deep Core": { x: 8, y: 10 },
  "Core": { x: 9, y: 9 },
  "Colonies": { x: 10, y: 8 },
  "Expansion Region": { x: 11, y: 11 },
  "Inner Rim Territories": { x: 13, y: 12 },
  "Mid Rim Territories": { x: 15, y: 13 },
  "Outer Rim Territories": { x: 17, y: 15 },
  "Hutt Space": { x: 18, y: 12 },
  "Wild Space": { x: 2, y: 5 },
  "Unknown Regions": { x: 1, y: 1 },
  "Talcene Sector": { x: 19, y: 8 },
  "The Centrality": { x: 16, y: 16 },
  "Tingel Arm": { x: 3, y: 15 },
  "Extragalactic": { x: 0, y: 0 },
};

export function useGalacticMapAllPlanets() {
  const { data: galacticMapPlanets, isLoading, dataUpdatedAt } = useGalacticMapPlanets();
  const { data: swapiPlanets, dataUpdatedAt: swapiUpdatedAt } = usePlanets();

  console.log(`[useGalacticMapAllPlanets] galacticMap: ${isLoading ? 'loading' : 'done'} (updated: ${new Date(dataUpdatedAt).toISOString()})`);
  console.log(`[useGalacticMapAllPlanets] swapiPlanets: ${!swapiPlanets ? 'loading' : 'done'} (${swapiPlanets?.length || 0} items, updated: ${new Date(swapiUpdatedAt).toISOString()})`);

  const data = useMemo(() => {
    console.time('[useGalacticMapAllPlanets] merge');
    if (!galacticMapPlanets) {
      console.log('[useGalacticMapAllPlanets] No galacticMap data yet');
      return [];
    }

    const swapiMap = new Map<string, Planet>();
    if (swapiPlanets) {
      for (const planet of swapiPlanets) {
        swapiMap.set(planet.name.toLowerCase(), planet);
        swapiMap.set(normalizeName(planet.name), planet);
      }
    }

    const result = galacticMapPlanets.map((planet, index) => {
      const swapiMatch = swapiMap.get(planet.Name.toLowerCase()) || swapiMap.get(normalizeName(planet.Name));
      
      return {
        id: String(index + 1),
        name: planet.Name,
        x: planet.X,
        y: planet.Y,
        region: planet.Region,
        sector: planet.Sector || undefined,
        suns: planet.Suns,
        moons: planet.Moons,
        distance: planet.Distance,
        length_day: planet.LengthDay,
        length_year: planet.LengthYear,
        diameter: swapiMatch?.diameter || String(planet.Diameter),
        climate: swapiMatch?.climate || undefined,
        terrain: swapiMatch?.terrain || undefined,
        population: swapiMatch?.population || undefined,
        rotation_period: swapiMatch?.rotation_period || String(planet.LengthDay),
        orbital_period: swapiMatch?.orbital_period || String(planet.LengthYear),
        gravity: swapiMatch?.gravity || String(planet.Gravity),
        description: swapiMatch ? undefined : `A planet in the ${planet.Region}.`,
        residents: swapiMatch?.residents || [],
        films: swapiMatch?.films || [],
        url: swapiMatch?.url || "",
      };
    });
    console.timeEnd('[useGalacticMapAllPlanets] merge');
    return result;
  }, [galacticMapPlanets, swapiPlanets]);

  return {
    data,
    isLoading,
  };
}

export function useFilms() {
  return useQuery<Film[]>({
    queryKey: ["films"],
    queryFn: async () => {
      console.time("[Query] films");
      try {
        const result = await fetchAllSWAPIInfo<Film>("films");
        console.timeEnd("[Query] films");
        console.log(`[Query] films: Loaded ${result.length} items`);
        return result;
      } catch (error) {
        console.timeEnd("[Query] films");
        console.error("[Query] films: FAILED", error);
        throw error;
      }
    },
    staleTime: STALE,
    onSuccess: (data) => console.log("[Query] films: Success", { count: data.length }),
    onError: (error) => console.error("[Query] films: Error", error),
  });
}

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: async () => {
      console.time("[Query] people");
      try {
        const result = await fetchAllSWAPIInfo<Person>("people");
        console.timeEnd("[Query] people");
        console.log(`[Query] people: Loaded ${result.length} items`);
        return result;
      } catch (error) {
        console.timeEnd("[Query] people");
        console.error("[Query] people: FAILED", error);
        throw error;
      }
    },
    staleTime: STALE,
    onSuccess: (data) => console.log("[Query] people: Success", { count: data.length }),
    onError: (error) => console.error("[Query] people: Error", error),
  });
}

export function useStarships() {
  return useQuery<Starship[]>({
    queryKey: ["starships"],
    queryFn: async () => {
      console.time("[Query] starships");
      try {
        const result = await fetchAllSWAPIInfo<Starship>("starships");
        console.timeEnd("[Query] starships");
        console.log(`[Query] starships: Loaded ${result.length} items`);
        return result;
      } catch (error) {
        console.timeEnd("[Query] starships");
        console.error("[Query] starships: FAILED", error);
        throw error;
      }
    },
    staleTime: STALE,
    onSuccess: (data) => console.log("[Query] starships: Success", { count: data.length }),
    onError: (error) => console.error("[Query] starships: Error", error),
  });
}

export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      console.time("[Query] vehicles");
      try {
        const result = await fetchAllSWAPIInfo<Vehicle>("vehicles");
        console.timeEnd("[Query] vehicles");
        console.log(`[Query] vehicles: Loaded ${result.length} items`);
        return result;
      } catch (error) {
        console.timeEnd("[Query] vehicles");
        console.error("[Query] vehicles: FAILED", error);
        throw error;
      }
    },
    staleTime: STALE,
    onSuccess: (data) => console.log("[Query] vehicles: Success", { count: data.length }),
    onError: (error) => console.error("[Query] vehicles: Error", error),
  });
}

export function useResident(url: string) {
  return useQuery<Resident>({
    queryKey: ["resident", url],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Data block corrupted");
      return res.json();
    },
    enabled: !!url,
    staleTime: STALE,
  });
}

export function useNameLookup(url: string) {
  return useQuery<{ name: string; title?: string }>({
    queryKey: ["namelookup", url],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Lookup failed");
      return res.json();
    },
    enabled: !!url,
    staleTime: STALE,
  });
}

const DATABANK_BASE = "https://starwars-databank-server.onrender.com/api/v1";

async function fetchAllDatabank<T extends DatabankItem>(
  endpoint: string,
): Promise<T[]> {
  let all: T[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await fetch(
      `${DATABANK_BASE}/${endpoint}?page=${page}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to fetch from Star Wars Databank");
    const data = await res.json();
    const withId = data.data.map((item: T) => ({
      ...item,
      id: item._id,
    }));
    all = [...all, ...withId];
    if (!data.info.next) break;
    page++;
  }
  return all;
}

export function useDatabankCharacters() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-characters"],
    queryFn: () => fetchAllDatabank<DatabankItem>("characters"),
    staleTime: STALE,
  });
}

export function useMergedCharacters() {
  const { data: people, isLoading: peopleLoading, dataUpdatedAt: peopleUpdatedAt } = usePeople();
  const { data: databankChars, isLoading: charsLoading, dataUpdatedAt: charsUpdatedAt } =
    useDatabankCharacters();

  console.log(`[useMergedCharacters] SWAPI people: ${peopleLoading ? 'loading' : 'done'} (${people?.length || 0} items, updated: ${new Date(peopleUpdatedAt).toISOString()})`);
  console.log(`[useMergedCharacters] Databank chars: ${charsLoading ? 'loading' : 'done'} (${databankChars?.length || 0} items, updated: ${new Date(charsUpdatedAt).toISOString()})`);

  const data = useMemo(() => {
    console.time('[useMergedCharacters] merge');
    const swPeople = people ?? [];
    const dbChars = databankChars ?? [];

    if (swPeople.length === 0 && dbChars.length === 0) {
      console.log('[useMergedCharacters] No data yet');
      return [];
    }

    const charMap = new Map<string, Person>();

    for (const person of swPeople) {
      charMap.set(person.name.toLowerCase(), {
        ...person,
        image: dbChars.find(
          (c) => c.name.toLowerCase() === person.name.toLowerCase(),
        )?.image,
      });
    }

    for (const char of dbChars) {
      const lowerName = char.name.toLowerCase();
      if (!charMap.has(lowerName)) {
        charMap.set(lowerName, {
          id: char.id,
          name: char.name,
          height: "unknown",
          mass: "unknown",
          hair_color: "unknown",
          skin_color: "unknown",
          eye_color: "unknown",
          birth_year: "unknown",
          gender: "unknown",
          homeworld: "",
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          url: "",
          image: char.image,
        });
      }
    }

    const result = Array.from(charMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    console.timeEnd('[useMergedCharacters] merge');
    console.log(`[useMergedCharacters] Merged: ${result.length} characters`);
    return result;
  }, [people, databankChars]);

  return {
    data,
    isLoading: peopleLoading || charsLoading,
  };
}

export function useDatabankCreatures() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-creatures"],
    queryFn: () => fetchAllDatabank<DatabankItem>("creatures"),
    staleTime: STALE,
  });
}

export function useDatabankDroids() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-droids"],
    queryFn: () => fetchAllDatabank<DatabankItem>("droids"),
    staleTime: STALE,
  });
}

export function useDatabankLocations() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-locations"],
    queryFn: () => fetchAllDatabank<DatabankItem>("locations"),
    staleTime: STALE,
  });
}

export function useDatabankOrganizations() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-organizations"],
    queryFn: () => fetchAllDatabank<DatabankItem>("organizations"),
    staleTime: STALE,
  });
}

export function useDatabankSpecies() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-species"],
    queryFn: () => fetchAllDatabank<DatabankItem>("species"),
    staleTime: STALE,
  });
}

export function useDatabankVehicles() {
  return useQuery<DatabankItem[]>({
    queryKey: ["databank-vehicles"],
    queryFn: () => fetchAllDatabank<DatabankItem>("vehicles"),
    staleTime: STALE,
  });
}

export function useMergedLocations() {
  const { data: planets, isLoading: planetsLoading, dataUpdatedAt: planetsUpdatedAt } = usePlanets();
  const { data: databankLocs, isLoading: locsLoading, dataUpdatedAt: locsUpdatedAt } = useDatabankLocations();

  console.log(`[useMergedLocations] planets: ${planetsLoading ? 'loading' : 'done'} (${planets?.length || 0} items, updated: ${new Date(planetsUpdatedAt).toISOString()})`);
  console.log(`[useMergedLocations] databankLocs: ${locsLoading ? 'loading' : 'done'} (${databankLocs?.length || 0} items, updated: ${new Date(locsUpdatedAt).toISOString()})`);

  const data = useMemo(() => {
    console.time('[useMergedLocations] merge');
    const locs = databankLocs ?? [];
    const planetList = planets ?? [];

    const result = locs.map((loc) => {
      const matchingPlanet = planetList.find(
        (p) => p.name.toLowerCase() === loc.name.toLowerCase(),
      );
      return {
        ...loc,
        planetId: matchingPlanet?.id,
        planet: matchingPlanet,
      };
    });
    console.timeEnd('[useMergedLocations] merge');
    console.log(`[useMergedLocations] Merged: ${result.length} locations`);
    return result;
  }, [planets, databankLocs]);

  return {
    data,
    isLoading: planetsLoading || locsLoading,
  };
}
