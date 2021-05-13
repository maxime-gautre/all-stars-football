import {
  FootballApiPlayer,
  isNonEmptyArray,
  NonEmptyArray,
  NullableStats,
  Player,
  Season,
  Statistics,
} from "../types.ts";
import { LoggerContext } from "../logger.ts";

export type Context = LoggerContext & {
  season: Season;
  playersApi: {
    readFootballApiPlayers: (
      season: Season,
      limit: number,
      offset: number,
    ) => Promise<FootballApiPlayer[]>;
    savePlayers: (season: Season, players: Player[]) => Promise<void>;
  };
};

export async function transformPlayersJob(context: Context) {
  const { season, playersApi, logger } = context;
  const batch = 50;
  logger.info("Starts transforming players...");
  logger.info(`batch=${batch}`);
  async function transformJobRec(offset = 0): Promise<void> {
    const players = await playersApi.readFootballApiPlayers(
      season,
      batch,
      offset,
    );
    if (players.length > 0) {
      const transformedPlayers = players.flatMap(transformPlayer);
      await playersApi.savePlayers(season, transformedPlayers);
      return transformJobRec(offset + batch);
    }
    return Promise.resolve();
  }

  await transformJobRec();
  logger.info("Transforming players... OK");
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
