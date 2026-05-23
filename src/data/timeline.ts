export type TimelineEntryType =
  | "Movie"
  | "Series"
  | "Novel"
  | "Comic"
  | "Audio Drama"
  | "Game"
  | "Reference"
  | "Upcoming"
  | "Phase";

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  type: TimelineEntryType;
  creator?: string;
  description?: string;
  note?: string;
  status?: "Announced" | "Upcoming";
}

export interface TimelineEra {
  id: string;
  name: string;
  dateRange: string;
  description: string;
  entries: TimelineEntry[];
}

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: "dawn-of-the-jedi",
    name: "Dawn of the Jedi",
    dateRange: "~25,000 BBY",
    description: "The origin era of the Jedi Order and the discovery of the Force.",
    entries: [
      {
        id: "james-mangold-film",
        title: "James Mangold Feature Film",
        date: "~25,000 BBY",
        type: "Upcoming",
        status: "Announced",
        description: "Upcoming feature film exploring the origin of the Jedi Order and the first discovery of the Force.",
      },
    ],
  },
  {
    id: "the-old-republic",
    name: "The Old Republic",
    dateRange: "25,000 – 500 BBY",
    description: "The ancient clash between the Republic and early Sith Empires.",
    entries: [
      {
        id: "timelines-reference",
        title: "Star Wars: Timelines",
        date: "Reference",
        type: "Reference",
        description: "Details canonical events of the Jedi-Sith wars across the Old Republic era.",
      },
      {
        id: "darth-maul-2017",
        title: "Darth Maul (2017 Comic Series)",
        date: "~500 BBY (flashbacks)",
        type: "Comic",
        description: "Features flashbacks and visions to the ancient Malachor Sith temple weapon.",
      },
    ],
  },
  {
    id: "the-high-republic",
    name: "The High Republic",
    dateRange: "500 – 100 BBY",
    description: "The golden age of the Jedi Council and galactic expansion, plagued by the marauding Nihil and the dark-side Drengir.",
    entries: [
      {
        id: "thr-phase-ii",
        title: "Phase II",
        date: "~382 BBY",
        type: "Phase",
        description: "The second phase of the High Republic publishing initiative, set 150 years before Phase I.",
      },
      {
        id: "path-of-deceit",
        title: "Path of Deceit",
        date: "~382 BBY",
        type: "Novel",
      },
      {
        id: "convergence",
        title: "Convergence",
        date: "~382 BBY",
        type: "Novel",
      },
      {
        id: "battle-of-jedha",
        title: "The Battle of Jedha",
        date: "~382 BBY",
        type: "Audio Drama",
      },
      {
        id: "cataclysm",
        title: "Cataclysm",
        date: "~382 BBY",
        type: "Novel",
      },
      {
        id: "path-of-vengeance",
        title: "Path of Vengeance",
        date: "~382 BBY",
        type: "Novel",
      },
      {
        id: "thr-2022-comic",
        title: "The High Republic (2022 Comic Series)",
        date: "~382 BBY",
        type: "Comic",
      },
      {
        id: "thr-phase-i",
        title: "Phase I",
        date: "~232 BBY",
        type: "Phase",
        description: "The first phase of the High Republic publishing initiative.",
      },
      {
        id: "light-of-the-jedi",
        title: "Light of the Jedi",
        date: "~232 BBY",
        type: "Novel",
      },
      {
        id: "into-the-dark",
        title: "Into the Dark",
        date: "~232 BBY",
        type: "Novel",
      },
      {
        id: "young-jedi-adventures",
        title: "Young Jedi Adventures",
        date: "~232 BBY",
        type: "Series",
        note: "Seasons 1–2",
      },
      {
        id: "the-rising-storm",
        title: "The Rising Storm",
        date: "~232 BBY",
        type: "Novel",
      },
      {
        id: "fallen-star",
        title: "Fallen Star",
        date: "~232 BBY",
        type: "Novel",
      },
      {
        id: "thr-2021-comic",
        title: "The High Republic (2021 Comic Series)",
        date: "~232 BBY",
        type: "Comic",
      },
      {
        id: "trail-of-shadows",
        title: "Trail of Shadows",
        date: "~232 BBY",
        type: "Comic",
      },
      {
        id: "thr-phase-iii",
        title: "Phase III",
        date: "~229 BBY",
        type: "Phase",
        description: "The final phase of the High Republic publishing initiative.",
      },
      {
        id: "eye-of-darkness",
        title: "The Eye of Darkness",
        date: "~229 BBY",
        type: "Novel",
      },
      {
        id: "defy-the-storm",
        title: "Defy the Storm",
        date: "~229 BBY",
        type: "Novel",
      },
      {
        id: "the-acolyte",
        title: "The Acolyte",
        date: "132 BBY",
        type: "Series",
        creator: "Leslye Headland",
        description: "A live-action series set in the final days of the High Republic era, investigating a shocking crime spree.",
      },
    ],
  },
  {
    id: "fall-of-the-jedi",
    name: "Fall of the Jedi",
    dateRange: "100 – 19 BBY",
    description: "The twilight of the Republic, the rise of Palpatine, and the tragedy of the Clone Wars.",
    entries: [
      {
        id: "dooku-jedi-lost",
        title: "Dooku: Jedi Lost",
        date: "68 – 42 BBY",
        type: "Audio Drama",
      },
      {
        id: "master-and-apprentice",
        title: "Master & Apprentice",
        date: "40 BBY",
        type: "Novel",
        description: "Qui-Gon Jinn and Obi-Wan Kenobi adventure before the events of The Phantom Menace.",
      },
      {
        id: "tales-jedi-justice",
        title: "Tales of the Jedi — Justice",
        date: "36 BBY",
        type: "Series",
      },
      {
        id: "tales-jedi-choices",
        title: "Tales of the Jedi — Choices",
        date: "32 BBY",
        type: "Series",
      },
      {
        id: "phantom-menace",
        title: "Star Wars: Episode I – The Phantom Menace",
        date: "32 BBY",
        type: "Movie",
        creator: "George Lucas",
        description: "Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force.",
      },
      {
        id: "tales-jedi-life-death",
        title: "Tales of the Jedi — Life and Death",
        date: "32 BBY",
        type: "Series",
      },
      {
        id: "attack-of-the-clones",
        title: "Star Wars: Episode II – Attack of the Clones",
        date: "22 BBY",
        type: "Movie",
        creator: "George Lucas",
        description: "Anakin Skywalker begins a forbidden romance while Obi-Wan investigates an assassination attempt.",
      },
      {
        id: "clone-wars-movie",
        title: "The Clone Wars (Animated Movie)",
        date: "22 BBY",
        type: "Movie",
      },
      {
        id: "clone-wars-series",
        title: "The Clone Wars",
        date: "22 – 19 BBY",
        type: "Series",
        note: "Seasons 1–7",
        description: "The epic animated series covering the galaxy-wide conflict between the Republic and the Separatists.",
      },
      {
        id: "dark-disciple",
        title: "Dark Disciple",
        date: "19 BBY",
        type: "Novel",
        description: "Adapts unproduced Ventress/Quinlan Vos scripts from The Clone Wars.",
      },
      {
        id: "tales-jedi-sith-lord",
        title: "Tales of the Jedi — The Sith Lord",
        date: "19 BBY",
        type: "Series",
      },
      {
        id: "revenge-of-the-sith",
        title: "Star Wars: Episode III – Revenge of the Sith",
        date: "19 BBY",
        type: "Movie",
        creator: "George Lucas",
        description: "Anakin Skywalker turns to the dark side and the Republic falls to the Empire.",
      },
      {
        id: "clone-wars-s7-finale",
        title: "The Clone Wars — Season 7 Finale",
        date: "19 BBY",
        type: "Series",
        note: "Episodes 9–12 (runs concurrently with Episode III)",
      },
    ],
  },
  {
    id: "reign-of-the-empire",
    name: "Reign of the Empire",
    dateRange: "19 – 5 BBY",
    description: "The 'Dark Times.' The Empire tightens its grip, hunts down surviving Jedi, and early rebel cells flicker.",
    entries: [
      {
        id: "bad-batch-s1",
        title: "The Bad Batch",
        date: "19 BBY",
        type: "Series",
        note: "Season 1",
      },
      {
        id: "darth-vader-2017",
        title: "Darth Vader: Dark Lord of the Sith (2017)",
        date: "19 BBY",
        type: "Comic",
      },
      {
        id: "bad-batch-s2",
        title: "The Bad Batch",
        date: "18 BBY",
        type: "Series",
        note: "Season 2",
      },
      {
        id: "tales-jedi-resolve",
        title: "Tales of the Jedi — Resolve",
        date: "18 BBY",
        type: "Series",
      },
      {
        id: "bad-batch-s3",
        title: "The Bad Batch",
        date: "17 BBY",
        type: "Series",
        note: "Season 3",
      },
      {
        id: "jedi-fallen-order",
        title: "Jedi: Fallen Order",
        date: "14 BBY",
        type: "Game",
        description: "A young Jedi padawan survives Order 66 and embarks on a quest to rebuild the Jedi Order.",
      },
      {
        id: "solo",
        title: "Solo: A Star Wars Story",
        date: "13 – 10 BBY",
        type: "Movie",
        creator: "Ron Howard",
        description: "A young Han Solo adventures through the criminal underworld before joining the Rebellion.",
      },
      {
        id: "tales-of-empire",
        title: "Tales of the Empire",
        date: "10 BBY",
        type: "Series",
        note: "Episodes 1–6",
      },
      {
        id: "obi-wan-2022-comic",
        title: "Obi-Wan Kenobi (2022 Comic Series)",
        date: "10 BBY",
        type: "Comic",
      },
      {
        id: "obi-wan-series",
        title: "Obi-Wan Kenobi",
        date: "9 BBY",
        type: "Series",
        creator: "Deborah Chow",
        description: "Jedi Master Obi-Wan Kenobi must protect young Luke Skywalker from the Empire's Inquisitors.",
      },
      {
        id: "jedi-survivor",
        title: "Jedi: Survivor",
        date: "9 BBY",
        type: "Game",
        description: "Cal Kestis continues his fight against the Empire, hunted by the Inquisitorius.",
      },
    ],
  },
  {
    id: "age-of-rebellion",
    name: "Age of Rebellion",
    dateRange: "5 BBY – 4 ABY",
    description: "The Galactic Civil War ignites into open conflict.",
    entries: [
      {
        id: "andor-s1",
        title: "Andor",
        date: "5 BBY",
        type: "Series",
        note: "Season 1",
        creator: "Tony Gilroy",
        description: "The story of Cassian Andor's transformation from cynical thief to Rebel hero.",
      },
      {
        id: "rebels-s1",
        title: "Star Wars Rebels",
        date: "5 BBY",
        type: "Series",
        note: "Season 1",
      },
      {
        id: "andor-s2",
        title: "Andor",
        date: "4 – 1 BBY",
        type: "Series",
        note: "Season 2",
        creator: "Tony Gilroy",
      },
      {
        id: "rebels-s2-4",
        title: "Star Wars Rebels",
        date: "4 – 1 BBY",
        type: "Series",
        note: "Seasons 2–4",
      },
      {
        id: "thrawn-comic",
        title: "Thrawn (Comic Adaptation)",
        date: "4 – 1 BBY",
        type: "Comic",
      },
      {
        id: "rogue-one",
        title: "Rogue One: A Star Wars Story",
        date: "0 BBY",
        type: "Movie",
        creator: "Gareth Edwards",
        description: "A ragtag group of Rebels steal the Death Star plans — a direct lead-in to A New Hope.",
      },
      {
        id: "a-new-hope",
        title: "Star Wars: Episode IV – A New Hope",
        date: "0 BBY",
        type: "Movie",
        creator: "George Lucas",
        description: "Luke Skywalker joins the Rebellion to rescue a princess and destroy the Death Star.",
      },
      {
        id: "star-wars-2015",
        title: "Star Wars (2015 Comic Series)",
        date: "0 – 3 ABY",
        type: "Comic",
      },
      {
        id: "darth-vader-2015",
        title: "Darth Vader (2015 Comic Series)",
        date: "0 – 3 ABY",
        type: "Comic",
      },
      {
        id: "doctor-aphra-2016",
        title: "Doctor Aphra (2016 Comic Series)",
        date: "0 – 3 ABY",
        type: "Comic",
      },
      {
        id: "empire-strikes-back",
        title: "Star Wars: Episode V – The Empire Strikes Back",
        date: "3 ABY",
        type: "Movie",
        creator: "Irvin Kershner",
        description: "The Empire strikes back at the Rebellion while Luke trains with Yoda.",
      },
      {
        id: "crimson-reign",
        title: "Crimson Reign",
        date: "3 – 4 ABY",
        type: "Comic",
      },
      {
        id: "hidden-empire",
        title: "Hidden Empire",
        date: "3 – 4 ABY",
        type: "Comic",
      },
      {
        id: "star-wars-2020",
        title: "Star Wars (2020 Comic Series)",
        date: "3 – 4 ABY",
        type: "Comic",
      },
      {
        id: "darth-vader-2020",
        title: "Darth Vader (2020 Comic Series)",
        date: "3 – 4 ABY",
        type: "Comic",
      },
      {
        id: "return-of-the-jedi",
        title: "Star Wars: Episode VI – Return of the Jedi",
        date: "4 ABY",
        type: "Movie",
        creator: "Richard Marquand",
        description: "The Rebellion mounts a final assault on the Empire as Luke confronts Darth Vader and the Emperor.",
      },
    ],
  },
  {
    id: "the-new-republic",
    name: "The New Republic",
    dateRange: "5 – 34 ABY",
    description: "The Empire collapses into remnants, and the New Republic attempts to govern, while a shadow network forms.",
    entries: [
      {
        id: "alphabet-squadron",
        title: "Alphabet Squadron Trilogy",
        date: "5 ABY",
        type: "Novel",
        description: "Novels detailing the Battle of Jakku and the fall of the Imperial remnant.",
      },
      {
        id: "aftermath-trilogy",
        title: "Aftermath Trilogy",
        date: "5 ABY",
        type: "Novel",
      },
      {
        id: "mandalorian-s1-2",
        title: "The Mandalorian",
        date: "9 ABY",
        type: "Series",
        note: "Seasons 1 & 2",
        creator: "Jon Favreau",
        description: "A lone bounty hunter in the outer reaches of the galaxy protects a mysterious child.",
      },
      {
        id: "book-of-boba-fett",
        title: "The Book of Boba Fett",
        date: "9 ABY",
        type: "Series",
        description: "Boba Fett and Fennec Shand stake their claim on the criminal underworld on Tatooine.",
      },
      {
        id: "mandalorian-s3",
        title: "The Mandalorian",
        date: "11 ABY",
        type: "Series",
        note: "Season 3",
      },
      {
        id: "ahsoka-series",
        title: "Ahsoka",
        date: "11 ABY",
        type: "Series",
        note: "Season 1",
        creator: "Dave Filoni",
        description: "Ahsoka Tano investigates a growing threat to the galaxy while searching for Grand Admiral Thrawn.",
      },
      {
        id: "skeleton-crew",
        title: "Skeleton Crew",
        date: "12 ABY",
        type: "Series",
        description: "Four children discover a mysterious starship and find themselves lost in the galaxy.",
      },
      {
        id: "mandalorian-grogu-film",
        title: "The Mandalorian & Grogu",
        date: "12 ABY",
        type: "Upcoming",
        status: "Upcoming",
        description: "Upcoming feature film continuing the story of Din Djarin and Grogu.",
      },
      {
        id: "shadow-of-the-sith",
        title: "Shadow of the Sith",
        date: "21 ABY",
        type: "Novel",
        description: "Luke Skywalker and Lando Calrissian team up to confront a dark-side threat.",
      },
    ],
  },
  {
    id: "rise-of-the-first-order",
    name: "Rise of the First Order",
    dateRange: "34 – 35 ABY",
    description: "The remnants of the old Empire strike back out of the Unknown Regions, sparking a brutal fight for the survival of democracy.",
    entries: [
      {
        id: "bloodline",
        title: "Bloodline",
        date: "34 ABY",
        type: "Novel",
        description: "Setting up Leia's political downfall as the First Order emerges.",
      },
      {
        id: "resistance-s1",
        title: "Star Wars Resistance",
        date: "34 ABY",
        type: "Series",
        note: "Season 1",
      },
      {
        id: "poe-dameron-comic",
        title: "Poe Dameron (Comic Series)",
        date: "34 ABY",
        type: "Comic",
      },
      {
        id: "force-awakens",
        title: "Star Wars: Episode VII – The Force Awakens",
        date: "34 ABY",
        type: "Movie",
        creator: "J.J. Abrams",
        description: "A new hero emerges as the Resistance faces the First Order's terrifying new weapon.",
      },
      {
        id: "last-jedi",
        title: "Star Wars: Episode VIII – The Last Jedi",
        date: "34 ABY",
        type: "Movie",
        creator: "Rian Johnson",
        description: "Luke Skywalker must confront the past as the Resistance fights for survival.",
      },
      {
        id: "resistance-s2",
        title: "Star Wars Resistance",
        date: "34 – 35 ABY",
        type: "Series",
        note: "Season 2",
      },
      {
        id: "rise-of-skywalker",
        title: "Star Wars: Episode IX – The Rise of Skywalker",
        date: "35 ABY",
        type: "Movie",
        creator: "J.J. Abrams",
        description: "The Resistance faces the resurrected Emperor Palpatine in a final battle for the galaxy.",
      },
    ],
  },
  {
    id: "new-jedi-order",
    name: "New Jedi Order",
    dateRange: "Post-35 ABY",
    description: "The rebuilding of the galaxy and a new generation of Force users.",
    entries: [
      {
        id: "rey-film",
        title: "Rey Skywalker Feature Film",
        date: "Post-35 ABY",
        type: "Upcoming",
        status: "Announced",
        description: "Upcoming feature film following Rey Skywalker as she builds a new Jedi Order.",
      },
    ],
  },
];
