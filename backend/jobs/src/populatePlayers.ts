import { log } from "../../deps.ts";
import { timer } from "../../shared/time.ts";
import {
  FootballApiPlayer,
  FootballApiTeam,
  isNonEmptyArray,
  Job,
  NonEmptyArray,
  NullableStats,
  Statistics,
} from "./types.ts";
import {
  FootballApiResponse,
  RateLimitError,
} from "./utils/apifootball/types.ts";
import { Player } from "./types.ts";

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
    savePlayers: (players: Player[]) => Promise<void>;
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
  const transformedPlayers = players.response.flatMap(transformPlayer);
  await playerApi.savePlayers(transformedPlayers);
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

function transformPlayer(player: FootballApiPlayer): Player[] {
  const { id, ...info } = player.player;

  function accumulatePlayerStats(statistics: NonEmptyArray<Statistics>) {
    const [head, ...tail] = statistics;
    return tail.reduce((acc, currentStats) => {
      const newStats: Statistics = {
        team: acc.team,
        league: acc.league,
        games: {
          appearences: acc.games.appearences + currentStats.games.appearences,
          lineups: acc.games.lineups + currentStats.games.lineups,
          minutes: acc.games.minutes + currentStats.games.minutes,
          number: acc.games.number,
          position: acc.games.position,
          rating: acc.games.rating
            ? movingAverage(
              statistics.length,
              Number(currentStats.games.rating),
              Number(acc.games.rating),
            ).toString()
            : null,
          captain: acc.games.captain,
        },
        substitutes: aggregateStats(acc.substitutes, currentStats.substitutes),
        shots: aggregateStats(acc.shots, currentStats.shots),
        goals: aggregateStats(acc.goals, currentStats.goals),
        passes: aggregateStats(acc.passes, currentStats.passes),
        tackles: aggregateStats(acc.tackles, currentStats.tackles),
        duels: aggregateStats(acc.duels, currentStats.duels),
        dribbles: aggregateStats(acc.dribbles, currentStats.dribbles),
        fouls: aggregateStats(acc.fouls, currentStats.fouls),
        cards: aggregateStats(acc.cards, currentStats.cards),
        penalty: aggregateStats(acc.penalty, currentStats.penalty),
      };

      return newStats;
    }, head);
  }

  if (isNonEmptyArray(player.statistics)) {
    return [{
      id,
      personalInfo: info,
      total: accumulatePlayerStats(player.statistics),
      statistics: player.statistics,
    }];
  } else {
    return [];
  }
}

type Stats<T> = {
  [key in keyof T]: NullableStats;
};

function aggregateStats<T>(stats1: Stats<T>, stats2: Stats<T>): Stats<T> {
  const keys = Object.keys(stats1) as unknown as Array<keyof T>;
  return keys.reduce((acc, key) => {
    const value1: NullableStats = stats1[key];
    const value2: NullableStats = stats2[key];

    const res = () => {
      if (!value1) return value2;
      if (!value2) return value1;

      return value1 + value2;
    };

    return {
      ...acc,
      [key]: res(),
    };
  }, {} as Stats<T>);
}

function movingAverage(count: number, currentAvg: number, newValue: number) {
  return currentAvg + (newValue - currentAvg) / count;
}
