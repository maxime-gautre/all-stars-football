import { Player } from "./types.ts";
import { LoggerContext } from "../../logger.ts";

export type PlayerContext = LoggerContext & {
  listPlayers: (limit: number, offset: number) => Promise<Player[]>;
  searchPlayers: (
    searchQuery: string,
    limit: number,
    offset: number,
  ) => Promise<Player[]>;
};

export const getPlayers = (playerContext: PlayerContext) =>
  (searchQuery: string | undefined = undefined, limit = 50, offset = 0) => {
    if (searchQuery) {
      return playerContext.searchPlayers(searchQuery, limit, offset);
    }
    return playerContext.listPlayers(limit, offset);
  };
