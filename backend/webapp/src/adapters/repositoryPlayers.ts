import { Collection } from "../../../deps.ts";
import { Player } from "../domain/types.ts";
import { executeQuery } from "../../../shared/mongoUtils.ts";

export function listPlayers(limit: number, offset: number): Promise<Player[]> {
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.find({}).skip(offset).limit(limit).toArray();
  });
}

export function searchPlayers(
  searchQuery: string,
  limit: number,
  offset: number,
): Promise<Player[]> {
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
      { score: { $meta: "textScore" } },
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
