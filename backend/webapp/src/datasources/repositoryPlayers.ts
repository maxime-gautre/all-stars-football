import { Collection } from "../../../deps.ts";
import {
  DefaultSeason,
  Player,
  PlayerPosition,
  SortCriteria,
} from "../domain/types.ts";
import { executeQuery } from "../../../shared/mongoUtils.ts";

const playersCollection = `players_${DefaultSeason}`;

export function listPlayers(
  sortBy: SortCriteria,
  positions: PlayerPosition[],
  limit: number,
  offset: number,
): Promise<Player[]> {
  const sortDoc = sortDocument(sortBy);
  const findDoc = positions.length === 0
    ? {}
    : { "total.games.position": { $in: positions } };
  return executeQuery(playersCollection, (collection: Collection<Player>) => {
    return collection.find(findDoc, { sort: sortDoc }).skip(
      offset,
    ).limit(limit).toArray();
  });
}

export function searchPlayers(
  searchQuery: string,
  sortBy: SortCriteria,
  positions: PlayerPosition[],
  limit: number,
  offset: number,
): Promise<Player[]> {
  const sortDoc = sortDocument(sortBy);
  const findDoc = positions.length === 0
    ? {}
    : { "total.games.position": { $in: positions } };
  return executeQuery(playersCollection, (collection: Collection<Player>) => {
    return collection.find({
      ...findDoc,
      $text: {
        $search: searchQuery,
      },
    }, {
      projection: {
        score: { $meta: "textScore" },
      },
    }).sort(
      {
        score: { $meta: "textScore" },
        ...sortDoc,
      },
    ).skip(offset).limit(limit).toArray();
  });
}

function mappingSort(sortBy: SortCriteria): string {
  switch (sortBy) {
    case "goals":
      return "total.goals.total";
    case "assists":
      return "total.goals.assists";
    case "appearences":
      return "total.games.appearences";
    case "saves":
      return "total.goals.saves";
    case "tackles":
      return "total.tackles.total";
    case "dribbles":
      return "total.dribbles.success";
  }
}

function sortDocument(sortBy: SortCriteria) {
  const sortKey = mappingSort(sortBy);
  return (sortBy === "appearences")
    ? {
      [sortKey]: -1,
    }
    : {
      [sortKey]: -1,
      "total.games.appearences": 1,
    };
}

export function listPlayersById(playerIds: number[]): Promise<Player[]> {
  return executeQuery(playersCollection, (collection: Collection<Player>) => {
    return collection.find({ id: { $in: playerIds } }).toArray();
  });
}

export function updatePlayersVoteCount(playerIds: number[]) {
  return executeQuery(playersCollection, (collection: Collection<Player>) => {
    return collection.updateMany({ id: { $in: playerIds } }, {
      $inc: {
        vote: 1,
      },
    }).then((_) => undefined);
  });
}
