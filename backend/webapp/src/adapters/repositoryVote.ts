import { executeQuery } from "../../../shared/mongoUtils.ts";
import { Collection } from "../../../deps.ts";
import { Vote } from "../domain/types.ts";

export function getLastVote(email: string): Promise<Vote | undefined> {
  return executeQuery("votes", (collection: Collection<Vote>) => {
    return collection.findOne({ email }, { sort: { votedDate: -1 } });
  });
}

export function saveVote(vote: Vote): Promise<void> {
  return executeQuery("votes", (collection: Collection<Vote>) => {
    return collection.insertOne({ ...vote }).then((_) => undefined);
  });
}
