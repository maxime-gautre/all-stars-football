export type Job = {
  id: string;
  startDate: Date;
  jobStatus: JobStatus;
  endDate?: Date;
  teamId?: number;
};

type JobStatus = "RUNNING" | "COMPLETED" | "SUSPENDED";

export type Season = number & { __type: "season" };
export function newSeason(season: number): Season {
  return season as Season;
}

type PlayerInfo = {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
};

type Nullable<T> = T | null;
export type NullableStats = Nullable<number>;

export type Statistics = {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: Nullable<string>;
    season: number;
  };
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    number: NullableStats;
    position: string;
    rating: Nullable<string>;
    captain: boolean;
  };
  substitutes: {
    in: NullableStats;
    out: NullableStats;
    bench: NullableStats;
  };
  shots: {
    total: NullableStats;
    on: NullableStats;
  };
  goals: {
    total: NullableStats;
    conceded: NullableStats;
    assists: NullableStats;
    saves: NullableStats;
  };
  passes: {
    total: NullableStats;
    key: NullableStats;
    accuracy: NullableStats;
  };
  tackles: {
    total: NullableStats;
    blocks: NullableStats;
    interceptions: NullableStats;
  };
  duels: {
    total: NullableStats;
    won: NullableStats;
  };
  dribbles: {
    attempts: NullableStats;
    success: NullableStats;
    past: NullableStats;
  };
  fouls: {
    drawn: NullableStats;
    committed: NullableStats;
  };
  cards: {
    yellow: NullableStats;
    yellowred: NullableStats;
    red: NullableStats;
  };
  penalty: {
    won: NullableStats;
    commited: NullableStats;
    scored: NullableStats;
    missed: NullableStats;
    saved: NullableStats;
  };
};

export type FootballApiPlayer = {
  player: PlayerInfo;
  statistics: Statistics[];
};

type PersonalInfo = Omit<PlayerInfo, "id">;

export type Player = {
  id: number;
  personalInfo: PersonalInfo;
  total: Statistics;
  statistics: NonEmptyArray<Statistics>;
};

export type Team = {
  id: number;
  name: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
};

export type Venue = {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
};

export type FootballApiTeam = {
  team: Team;
  venue: Venue;
};

export type NonEmptyArray<T> = [T, ...T[]];
export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}
