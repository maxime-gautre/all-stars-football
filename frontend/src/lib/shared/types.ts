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
type NullableStats = Nullable<number>;

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

export type Player = {
  id: number;
  personalInfo: PlayerInfo;
  total: Statistics;
  statistics: NonEmptyArray<Statistics>;
  votes: number;
};

type NonEmptyArray<T> = [T, ...T[]];

export enum SortByEnum {
  goals = 'Goals',
  assists = 'Assists',
  appearences = 'Games Played',
  saves = 'Goals saves',
  tackles = 'Tackles',
  dribbles = 'Dribbles',
}

export type SortCriteria = keyof typeof SortByEnum;
