import { readFootballApiPlayers, savePlayers } from "./datasources/players.ts";
import { Context, transformPlayersJob } from "./transformPlayer.ts";
import { newSeason } from "../types.ts";
import { loggerContext } from "../../../webapp/logger.ts";

const context: Context = {
  season: newSeason(2020),
  playersApi: {
    readFootballApiPlayers,
    savePlayers,
  },
  ...loggerContext,
};

void transformPlayersJob(context);
