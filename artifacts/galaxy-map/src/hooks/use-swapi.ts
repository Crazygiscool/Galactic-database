import { useQuery } from "@tanstack/react-query";

export type Section = 'planets' | 'films' | 'people' | 'starships' | 'vehicles';

export interface Planet {
  id: string;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  url: string;
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

async function fetchAll<T>(baseUrl: string): Promise<T[]> {
  let all: T[] = [];
  let nextUrl: string | null = baseUrl;
  while (nextUrl) {
    const res = await fetch(nextUrl);
    if (!res.ok) throw new Error("Terminal link failure: Unable to reach SWAPI");
    const data = await res.json();
    const withId = data.results.map((item: any) => ({
      ...item,
      id: item.url.split('/').filter(Boolean).pop() ?? String(Math.random()),
    }));
    all = [...all, ...withId];
    nextUrl = data.next;
  }
  return all;
}

const STALE = 1000 * 60 * 60;

export function usePlanets() {
  return useQuery<Planet[]>({
    queryKey: ['planets'],
    queryFn: () => fetchAll<Planet>('https://swapi.dev/api/planets/'),
    staleTime: STALE,
  });
}

export function useFilms() {
  return useQuery<Film[]>({
    queryKey: ['films'],
    queryFn: () => fetchAll<Film>('https://swapi.dev/api/films/'),
    staleTime: STALE,
  });
}

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: () => fetchAll<Person>('https://swapi.dev/api/people/'),
    staleTime: STALE,
  });
}

export function useStarships() {
  return useQuery<Starship[]>({
    queryKey: ['starships'],
    queryFn: () => fetchAll<Starship>('https://swapi.dev/api/starships/'),
    staleTime: STALE,
  });
}

export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: () => fetchAll<Vehicle>('https://swapi.dev/api/vehicles/'),
    staleTime: STALE,
  });
}

export function useResident(url: string) {
  return useQuery<Resident>({
    queryKey: ['resident', url],
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
    queryKey: ['namelookup', url],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Lookup failed");
      return res.json();
    },
    enabled: !!url,
    staleTime: STALE,
  });
}
