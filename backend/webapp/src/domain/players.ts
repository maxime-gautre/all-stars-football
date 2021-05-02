import { Player, SortCriteria } from "./types.ts";
import { LoggerContext } from "../../logger.ts";

export type PlayerContext = LoggerContext & {
  listPlayers: (
    sortBy: SortCriteria,
    limit: number,
    offset: number,
  ) => Promise<Player[]>;
  searchPlayers: (
    searchQuery: string,
    sortBy: SortCriteria,
    limit: number,
    offset: number,
  ) => Promise<Player[]>;
};

export const getPlayers = (playerContext: PlayerContext) =>
  (
    searchQuery?: string,
    sortBy: SortCriteria = "goals",
    limit = 50,
    offset = 0,
  ) => {
    if (searchQuery) {
      return playerContext.searchPlayers(searchQuery, sortBy, limit, offset);
    }
    return playerContext.listPlayers(sortBy, limit, offset);
  };
