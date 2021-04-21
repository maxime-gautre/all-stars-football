import { Collection } from "../../../deps.ts";
import { Player } from "../domain/types.ts";
import { executeQuery } from "../../../shared/mongoUtils.ts";

export function listPlayers(limit: number, offset: number): Promise<Player[]> {
  return executeQuery("players", (collection: Collection<Player>) => {
    return collection.find({}).skip(offset).limit(limit).toArray();
  });
}