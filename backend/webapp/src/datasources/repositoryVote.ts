import { executeQuery } from "../../../shared/mongoUtils.ts";
import { Collection } from "../../../deps.ts";
import { DefaultSeason, Vote } from "../domain/types.ts";

const votesCollection = `votes_${DefaultSeason}`;

export function getLastVote(email: string): Promise<Vote | undefined> {
  return executeQuery(votesCollection, (collection: Collection<Vote>) => {
    return collection.findOne({ email }, { sort: { votedDate: -1 } });
  });
}

export function saveVote(vote: Vote): Promise<void> {
  return executeQuery(votesCollection, (collection: Collection<Vote>) => {
    return collection.insertOne({ ...vote }).then((_) => undefined);
  });
}
