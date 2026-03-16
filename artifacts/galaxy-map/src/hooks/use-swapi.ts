import { useQuery } from "@tanstack/react-query";

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
  created: string;
  edited: string;
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

// Fetch all planets by paginating through the SWAPI endpoints
export function usePlanets() {
  return useQuery({
    queryKey: ['planets'],
    queryFn: async () => {
      let allPlanets: Planet[] = [];
      let nextUrl: string | null = 'https://swapi.dev/api/planets/';
      
      // Fetch pages until there's no next page. 
      // SWAPI has ~6 pages of planets.
      while (nextUrl) {
        const res = await fetch(nextUrl);
        if (!res.ok) throw new Error("Terminal link failure: Unable to reach SWAPI");
        const data = await res.json();
        
        // Extract ID from URL for deterministic positioning
        const planetsWithId = data.results.map((p: any) => ({
          ...p,
          id: p.url.split('/').filter(Boolean).pop() || Math.random().toString()
        }));
        
        allPlanets = [...allPlanets, ...planetsWithId];
        nextUrl = data.next;
      }
      return allPlanets;
    },
    // Cache for a long time since planets rarely change
    staleTime: 1000 * 60 * 60,
  });
}

// Fetch a single resident by their SWAPI URL
export function useResident(url: string) {
  return useQuery({
    queryKey: ['resident', url],
    queryFn: async () => {
      // Small artificial delay to show off terminal loading states
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Data block corrupted");
      return res.json() as Promise<Resident>;
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 60,
  });
}
