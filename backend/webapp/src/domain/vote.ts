import { InvalidVoteException, Player, Vote, VotePayload } from "./types.ts";
import { LoggerContext } from "../../logger.ts";
import { validation as v } from "../../../deps.ts";

export type VoteContext = LoggerContext & {
  listPlayersById: (playerIds: number[]) => Promise<Player[]>;
  updatePlayersVoteCount: (playerIds: number[]) => Promise<void>;
  getLastVote: (email: string) => Promise<Vote | undefined>;
  saveVote: (vote: Vote) => Promise<void>;
};

export const vote = (voteContext: VoteContext) =>
  async (votePayload: VotePayload): Promise<Vote> => {
    const lastVote = await voteContext.getLastVote(votePayload.email);
    const players = await voteContext.listPlayersById(
      votePayload.playersSelection,
    );

    const isValid = new v.Validator(v.Ok)
      .and((_) => canVoteOnlyOnceADay(lastVote))
      .and((_) => hasUniqueGoalKeeper(players))
      .and((_) => hasElevenUniquePlayers(players))
      .validate(true);

    if (!isValid.ok) {
      const errors = isValid.errors.map((_) => _.message);
      return Promise.reject(new InvalidVoteException(errors));
    }

    const now = new Date();
    const vote = {
      email: votePayload.email,
      name: votePayload.name,
      votedDate: now,
    };
    await voteContext.saveVote(vote);
    await voteContext.updatePlayersVoteCount(votePayload.playersSelection);

    return vote;
  };

function canVoteOnlyOnceADay(
  lastVote: Vote | undefined,
): v.Result<string, void> {
  const now = new Date();
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  if (
    lastVote &&
    Math.abs(now.getTime() - lastVote.votedDate.getTime()) < oneDayMilliseconds
  ) {
    return v.Err("You can vote only once a day");
  } else return v.Ok(undefined);
}

function hasElevenUniquePlayers(
  players: Player[],
): v.Result<string, Set<number>> {
  const uniquePlayersIds = new Set(players.map((_) => _.id));
  if (uniquePlayersIds.size !== 11) {
    return v.Err(
      `You should have 11 unique players, actual selection count is: ${uniquePlayersIds.size}.
       You may have some duplicates or some players do not exist.`,
    );
  } else return v.Ok(uniquePlayersIds);
}

function hasUniqueGoalKeeper(players: Player[]): v.Result<string, void> {
  const goalkeepers = players.filter((_) =>
    _.statistics[0].games.position === "Goalkeeper"
  );
  if (goalkeepers.length !== 1) {
    return v.Err("You should have one and only one goalkeeper");
  } else return v.Ok(undefined);
}
