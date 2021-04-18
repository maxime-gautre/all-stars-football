import { log } from "../deps.ts";
import { timer } from "./utils/time.ts";
import { Job } from "./jobs/types.ts";
import { FootballApiTeam } from "./teams/types.ts";
import { FootballApiPlayer } from "./players/types.ts";
import {
  FootballApiResponse,
  RateLimitError,
} from "./utils/apifootball/types.ts";

export type Context = {
  jobApi: {
    initJob: () => Promise<Job>;
    findLastJob: () => Promise<Job | undefined>;
    updateJobIdWithCurrentTeam: (
      jobId: string,
      teamId: number,
    ) => Promise<string>;
    completeJob: (jobId: string) => Promise<string>;
  };
  teamApi: {
    fetchTeams: () => Promise<FootballApiResponse<FootballApiTeam>>;
    saveTeams: (teams: FootballApiTeam[]) => Promise<void>;
    getTeamsIds: () => Promise<number[]>;
  };
  playerApi: {
    fetchPlayers: (
      teamId: number,
      page: number,
    ) => Promise<FootballApiResponse<FootballApiPlayer>>;
    savePlayers: (players: FootballApiPlayer[]) => Promise<void>;
  };
  options: {
    mode: "full-refresh" | "incremental";
    throttle?: number;
  };
  logger: log.Logger;
};

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: "INFO",
      handlers: ["console"],
    },

    tests: {
      level: "CRITICAL",
      handlers: ["console"],
    },
  },
});

export async function populatePlayers(context: Context): Promise<void> {
  const { jobApi, teamApi, playerApi, options, logger } = context;
  logger.info("Starts populating players...");
  logger.info(`mode=${options.mode}, throttle=${options.throttle}`);
  const job = await getJob(options, jobApi);
  logger.info(`job_id=${job.id}`);
  const teamsIdsToProcess = await teamsToProcess(options, teamApi, job, logger);
  logger.info(`Teams to process: ${teamsIdsToProcess.length}`);

  for (const teamId of teamsIdsToProcess) {
    logger.info(`Processing team ${teamId}...`);
    try {
      await fetchPlayersRec(playerApi, teamId);
    } catch (err) {
      logger.error(`Error when fetching team: ${teamId}`, err);
      if (err instanceof RateLimitError) {
        await jobApi.updateJobIdWithCurrentTeam(job.id, teamId);
      }
      throw err;
    }
    logger.info(`Processing team ${teamId}... OK`);
    if (options.throttle) {
      await timer(options.throttle * 1000);
    }
  }
  await jobApi.completeJob(job.id);
  logger.info("Populate players completed");
}

async function fetchPlayersRec(
  playerApi: Context["playerApi"],
  teamId: number,
  page = 1,
) {
  const players = await playerApi.fetchPlayers(teamId, page);
  await playerApi.savePlayers(players.response);
  if (players.paging.current !== players.paging.total) {
    await fetchPlayersRec(playerApi, teamId, players.paging.current + 1);
  }
}

async function getJob(
  options: Context["options"],
  jobApi: Context["jobApi"],
): Promise<Job> {
  if (options.mode === "full-refresh") {
    return jobApi.initJob();
  } else {
    const job = await jobApi.findLastJob();
    if (!job) {
      return jobApi.initJob();
    }
    return job;
  }
}

async function teamsToProcess(
  options: Context["options"],
  teamApi: Context["teamApi"],
  job: Job,
  logger: Context["logger"],
) {
  const teamsIds = await teamApi.getTeamsIds();
  if (options.mode === "full-refresh" || teamsIds.length === 0) {
    logger.info("Fetching teams...");
    const teams = await teamApi.fetchTeams();
    logger.info(`Fetching teams... OK, results: ${teams.results}`);
    await teamApi.saveTeams(teams.response);
    return teams.response.map((_) => _.team.id);
  } else {
    const nextTeamId = job.teamId;
    if (!nextTeamId) {
      return teamsIds;
    } else {
      const nextTeamPosition = teamsIds.indexOf(nextTeamId);
      return nextTeamPosition === -1
        ? teamsIds
        : teamsIds.slice(nextTeamPosition);
    }
  }
}
