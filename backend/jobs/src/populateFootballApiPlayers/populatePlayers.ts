import { timer } from "../../../shared/time.ts";
import { FootballApiPlayer, FootballApiTeam, Job, Season } from "../types.ts";
import {
  FootballApiResponse,
  RateLimitError,
} from "./utils/apifootball/types.ts";
import { LoggerContext } from "../logger.ts";

export type Context = LoggerContext & {
  season: Season;
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
    fetchTeams: (
      season: Season,
    ) => Promise<FootballApiResponse<FootballApiTeam>>;
    saveTeams: (season: Season, teams: FootballApiTeam[]) => Promise<void>;
    getTeamsIds: (season: Season) => Promise<number[]>;
  };
  playerApi: {
    fetchPlayers: (
      season: Season,
      teamId: number,
      page: number,
    ) => Promise<FootballApiResponse<FootballApiPlayer>>;
    saveFootballApiPlayers: (
      season: Season,
      players: FootballApiPlayer[],
    ) => Promise<void>;
  };
  options: {
    mode: "full-refresh" | "incremental";
    throttle?: number;
  };
};

export async function populatePlayers(context: Context): Promise<void> {
  const { season, jobApi, playerApi, options, logger } = context;
  logger.info("Starts populating players...");
  logger.info(`mode=${options.mode}, throttle=${options.throttle}`);
  const job = await getJob(options, jobApi);
  logger.info(`job_id=${job.id}`);
  const teamsIdsToProcess = await teamsToProcess(context, job);
  logger.info(`Teams to process: ${teamsIdsToProcess.length}`);

  for (const teamId of teamsIdsToProcess) {
    logger.info(`Processing team ${teamId}...`);
    try {
      await fetchPlayersRec(playerApi, teamId, season);
    } catch (err) {
      logger.error(`Error when fetching team: ${teamId}`, err);
      if (err instanceof RateLimitError) {
        await jobApi.updateJobIdWithCurrentTeam(job.id, teamId);
        logger.info(
          `Rate limit error reached, current state saved: teamId=${teamId}`,
        );
        return;
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
  season: Season,
  page = 1,
) {
  const players = await playerApi.fetchPlayers(season, teamId, page);
  await playerApi.saveFootballApiPlayers(season, players.response);
  if (players.paging.current !== players.paging.total) {
    await fetchPlayersRec(
      playerApi,
      teamId,
      season,
      players.paging.current + 1,
    );
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
  context: Context,
  job: Job,
) {
  const { season, teamApi, options, logger } = context;
  const teamsIds = await teamApi.getTeamsIds(season);
  if (options.mode === "full-refresh" || teamsIds.length === 0) {
    logger.info("Fetching teams...");
    const teams = await teamApi.fetchTeams(season);
    logger.info(`Fetching teams... OK, results: ${teams.results}`);
    await teamApi.saveTeams(season, teams.response);
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
