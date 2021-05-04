import { Player, PlayerPosition, SortCriteria } from "./types.ts";
import { LoggerContext } from "../../logger.ts";

export type PlayerContext = LoggerContext & {
  listPlayers: (
    sortBy: SortCriteria,
    positions: PlayerPosition[],
    limit: number,
    offset: number,
  ) => Promise<Player[]>;
  searchPlayers: (
    searchQuery: string,
    sortBy: SortCriteria,
    positions: PlayerPosition[],
    limit: number,
    offset: number,
  ) => Promise<Player[]>;
};

export const getPlayers = (playerContext: PlayerContext) =>
  (
    searchQuery?: string,
    sortBy: SortCriteria = "goals",
    positions: PlayerPosition[] = [],
    limit = 50,
    offset = 0,
  ) => {
    if (searchQuery) {
      return playerContext.searchPlayers(
        searchQuery,
        sortBy,
        positions,
        limit,
        offset,
      );
    }
    return playerContext.listPlayers(sortBy, positions, limit, offset);
  };
