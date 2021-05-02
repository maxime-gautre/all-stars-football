import { Collection } from "../../../deps.ts";
import { Player, SortCriteria } from "../domain/types.ts";
import { executeQuery } from "../../../shared/mongoUtils.ts";

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

export function listPlayers(
  sortBy: SortCriteria,
  limit: number,
  offset: number,
): Promise<Player[]> {
  const sortDoc = sortDocument(sortBy);
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.find({}, { sort: sortDoc }).skip(
      offset,
    ).limit(limit).toArray();
  });
}

export function searchPlayers(
  searchQuery: string,
  sortBy: SortCriteria,
  limit: number,
  offset: number,
): Promise<Player[]> {
  const sortDoc = sortDocument(sortBy);
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.find({
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

export function listPlayersById(playerIds: number[]): Promise<Player[]> {
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.find({ id: { $in: playerIds } }).toArray();
  });
}

export function updatePlayersVoteCount(playerIds: number[]) {
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.updateMany({ id: { $in: playerIds } }, {
      $inc: {
        vote: 1,
      },
    }).then((_) => undefined);
  });
}
