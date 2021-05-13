import { Context, populatePlayers } from "./populatePlayers.ts";
import { newSeason } from "../types.ts";
import {
  completeJob,
  findLastJob,
  initJob,
  updateJobIdWithCurrentTeam,
} from "./datasources/job.ts";
import { fetchTeams, getTeamsIds, saveTeams } from "./datasources/team.ts";
import { fetchPlayers, saveFootballApiPlayers } from "./datasources/player.ts";
import { loggerContext } from "../logger.ts";

const context: Context = {
  season: newSeason(2020),
  jobApi: {
    initJob,
    findLastJob,
    updateJobIdWithCurrentTeam,
    completeJob,
  },
  teamApi: {
    fetchTeams,
    saveTeams,
    getTeamsIds,
  },
  playerApi: {
    fetchPlayers,
    saveFootballApiPlayers,
  },
  options: {
    mode: "incremental",
    throttle: 20,
  },
  ...loggerContext,
};

void populatePlayers(context);
