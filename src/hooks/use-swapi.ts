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

async function fetchAll<T>(baseUrl: string): Promise<T[]> {
  let all: T[] = [];
  let nextUrl: string | null = baseUrl;
  while (nextUrl) {
    const res = await fetch(nextUrl);
    if (!res.ok)
      throw new Error("Terminal link failure: Unable to reach SWAPI");
    const data = await res.json();
    const withId = data.results.map((item: any) => ({
      ...item,
      id: item.url.split("/").filter(Boolean).pop() ?? String(Math.random()),
    }));
    all = [...all, ...withId];
    nextUrl = data.next;
  }
  return all;
}

const STALE = 1000 * 60 * 60;

export function usePlanets() {
  return useQuery<Planet[]>({
    queryKey: ["planets"],
    queryFn: () => fetchAll<Planet>("https://swapi.dev/api/planets/"),
    staleTime: STALE,
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
  const { data: galacticMapPlanets, isLoading } = useGalacticMapPlanets();
  const { data: swapiPlanets } = usePlanets();

  const data = useMemo(() => {
    if (!galacticMapPlanets) return [];

    const swapiMap = new Map<string, Planet>();
    if (swapiPlanets) {
      for (const planet of swapiPlanets) {
        swapiMap.set(planet.name.toLowerCase(), planet);
        swapiMap.set(normalizeName(planet.name), planet);
      }
    }

    return galacticMapPlanets.map((planet, index) => {
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
  }, [galacticMapPlanets, swapiPlanets]);

  return {
    data,
    isLoading,
  };
}

export function useFilms() {
  return useQuery<Film[]>({
    queryKey: ["films"],
    queryFn: () => fetchAll<Film>("https://swapi.dev/api/films/"),
    staleTime: STALE,
  });
}

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: () => fetchAll<Person>("https://swapi.dev/api/people/"),
    staleTime: STALE,
  });
}

export function useStarships() {
  return useQuery<Starship[]>({
    queryKey: ["starships"],
    queryFn: () => fetchAll<Starship>("https://swapi.dev/api/starships/"),
    staleTime: STALE,
  });
}

export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: () => fetchAll<Vehicle>("https://swapi.dev/api/vehicles/"),
    staleTime: STALE,
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
  const { data: people, isLoading: peopleLoading } = usePeople();
  const { data: databankChars, isLoading: charsLoading } =
    useDatabankCharacters();

  const data = useMemo(() => {
    const swPeople = people ?? [];
    const dbChars = databankChars ?? [];

    if (swPeople.length === 0 && dbChars.length === 0) return [];

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

    return Array.from(charMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
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
  const { data: planets, isLoading: planetsLoading } = usePlanets();
  const { data: databankLocs, isLoading: locsLoading } = useDatabankLocations();

  const data = useMemo(() => {
    const locs = databankLocs ?? [];
    const planetList = planets ?? [];

    return locs.map((loc) => {
      const matchingPlanet = planetList.find(
        (p) => p.name.toLowerCase() === loc.name.toLowerCase(),
      );
      return {
        ...loc,
        planetId: matchingPlanet?.id,
        planet: matchingPlanet,
      };
    });
  }, [planets, databankLocs]);

  return {
    data,
    isLoading: planetsLoading || locsLoading,
  };
}
