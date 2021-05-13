import { FootballApiPlayer, Player, Season } from "../../types.ts";
import { bulkUpsert, executeQuery } from "../../../../shared/mongoUtils.ts";
import { Collection } from "../../../../deps.ts";

export function readFootballApiPlayers(
  season: Season,
  limit: number,
  offset: number,
): Promise<FootballApiPlayer[]> {
  return executeQuery(
    `players_football_api_${season}`,
    (collection: Collection<FootballApiPlayer>) => {
      return collection.find({}, { sort: { id: 1 } }).skip(
        offset,
      ).limit(limit).toArray();
    },
  );
}

export function savePlayers(
  season: Season,
  players: Player[],
): Promise<void> {
  return bulkUpsert(`players_${season}`, players);
}
