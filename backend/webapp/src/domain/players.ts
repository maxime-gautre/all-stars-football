import { Player } from "./types.ts";
import { LoggerContext } from "../../logger.ts";

export type PlayerContext = LoggerContext & {
  listPlayers: (limit: number, offset: number) => Promise<Player[]>;
};

export const getPlayers = (playerContext: PlayerContext) =>
  (limit = 50, offset = 0) => {
    return playerContext.listPlayers(limit, offset);
  };
