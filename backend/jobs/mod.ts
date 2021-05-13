import { log } from "../deps.ts";
import { Context, populatePlayers } from "./src/footballApi/populatePlayers.ts";
import {
  fetchPlayers,
  saveFootballApiPlayers,
} from "./src/footballApi/datasources/player.ts";
import {
  completeJob,
  findLastJob,
  initJob,
  updateJobIdWithCurrentTeam,
} from "./src/footballApi/datasources/job.ts";
import {
  fetchTeams,
  getTeamsIds,
  saveTeams,
} from "./src/footballApi/datasources/team.ts";
import { newSeason } from "./src/types.ts";

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
  logger: log.getLogger(),
};

void populatePlayers(context);
