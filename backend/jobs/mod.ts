import { log } from "../deps.ts";
import { Context, populatePlayers } from "./src/populatePlayers.ts";
import { fetchPlayers, savePlayers } from "./src/players/player.ts";
import {
  completeJob,
  findLastJob,
  initJob,
  updateJobIdWithCurrentTeam,
} from "./src/jobs/job.ts";
import { fetchTeams, getTeamsIds, saveTeams } from "./src/teams/team.ts";

const context: Context = {
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
    savePlayers,
  },
  options: {
    mode: "incremental",
    throttle: 20,
  },
  logger: log.getLogger(),
};

void populatePlayers(context);
