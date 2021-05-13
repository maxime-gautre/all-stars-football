import { validation as v } from "../../../deps.ts";

export type Season = number & { __type: "season" };
export function newSeason(season: number): Season {
  return season as Season;
}
export const DefaultSeason = newSeason(2020)

export type Player = {
  id: number;
  personalInfo: PlayerInfo;
  total: Statistics;
  statistics: NonEmptyArray<Statistics>;
  votes: number;
};

type PlayerInfo = {
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

type Statistics = {
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

export type Vote = {
  email: string;
  name: string;
  votedDate: Date;
};

export type VotePayload = typeof votePayloadValidator.T;

export const votePayloadValidator = v.object({
  email: v.string,
  name: v.string,
  playersSelection: v.array(v.number),
});

export class InvalidVoteException extends Error {
  constructor(public readonly errors: string[]) {
    super(`Invalid vote: ${errors.join("\n")}`);
  }
}

const sortsOptions = [
  "goals",
  "appearences",
  "assists",
  "saves",
  "tackles",
  "dribbles",
] as const;
export type SortCriteria = typeof sortsOptions[number];

const playerPositionOptions = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Attacker",
] as const;
export type PlayerPosition = typeof playerPositionOptions[number];

export const searchPlayersValidator = v.object({
  search: v.string.optional(),
  sortBy: v.union(...sortsOptions).optional(),
  positions: (v.string
    .and((x) => v.Ok(x.split(","))) // handle multiple query params and transform into an array
    .then(v.array(v.union(...playerPositionOptions)))) // then validate that each value is a part of the union
    .optional(),
});

type NonEmptyArray<T> = [T, ...T[]];
