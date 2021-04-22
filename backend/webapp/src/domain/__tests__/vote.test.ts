import { log } from "../../../../deps.ts";
import { Rhum } from "../../../../dev_deps.ts";
import {
  InMemoryPlayersRepository,
  InMemoryVoteRepository,
  players,
} from "./stub.ts";
import { InvalidVoteException, Player, Vote, VotePayload } from "../types.ts";
import { vote } from "../vote.ts";

function initTestDeps(
  initialVotes: Vote[] = [],
  initialPlayers: Player[] = [],
) {
  const voteStore = new InMemoryVoteRepository(initialVotes);
  const playerStore = new InMemoryPlayersRepository(initialPlayers);

  return {
    context: {
      listPlayersById: (playerIds: number[]) =>
        playerStore.listPlayersById(playerIds),
      updatePlayersVoteCount: (playerIds: number[]) =>
        playerStore.updatePlayersVoteCount(playerIds),
      getLastVote: (email: string) => voteStore.getLastVote(email),
      saveVote: (vote: Vote) => voteStore.saveVote(vote),
      logger: log.getLogger("tests"),
    },
    deps: {
      voteStore,
      playerStore,
    },
  };
}

Rhum.testPlan("New vote submitted", () => {
  Rhum.testSuite("Validation rules", () => {
    Rhum.testCase(
      "should prevent vote if there are not enough players",
      async () => {
        const initialVotes: Vote[] = [];
        const edersonPlayer = players[0].id;
        const initialPlayers: Player[] = [...players];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: [edersonPlayer],
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if there are too much players",
      async () => {
        const initialVotes: Vote[] = [];
        const initialPlayers: Player[] = [...players];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: [...players.map((_) => _.id)],
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if there are duplicate players",
      async () => {
        const initialVotes: Vote[] = [];
        const initialPlayers: Player[] = [...players];
        const selectionWithDuplicates = [...players.slice(1, 11), players[1]]
          .map((_) => _.id);
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: selectionWithDuplicates,
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if one player doesn't exist",
      async () => {
        const initialVotes: Vote[] = [];
        const initialPlayers: Player[] = [...players];
        const selectionWithNonExistingPlayer = [
          ...players.slice(1, 11).map((_) => _.id),
          -1,
        ];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: selectionWithNonExistingPlayer,
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if there is no goalkeeper",
      async () => {
        const initialVotes: Vote[] = [];
        const initialPlayers: Player[] = [...players];
        const selectionWithNoGoalkeepers = [
          ...players.slice(2, 12).map((_) => _.id),
        ];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: selectionWithNoGoalkeepers,
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if there is more than one goalkeeper",
      async () => {
        const initialVotes: Vote[] = [];
        const initialPlayers: Player[] = [...players];
        const selectionWithTwoGoalkeepers = [
          ...players.slice(0, 11).map((_) => _.id),
        ];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: selectionWithTwoGoalkeepers,
        };
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const lastVote = await deps.voteStore.getLastVote(payload.email);
        Rhum.asserts.assertExists(!(lastVote));
      },
    );

    Rhum.testCase(
      "should prevent vote if the user has already submitted his/her vote for the day",
      async () => {
        const initialPlayers: Player[] = [...players];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: [...players.slice(1, 12).map((_) => _.id)],
        };
        const initialVotes: Vote[] = [{
          email: payload.email,
          name: payload.name,
          votedDate: new Date(),
        }];
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await Rhum.asserts.assertThrowsAsync(
          () => vote(context)(payload),
          InvalidVoteException,
        );

        const votes = await deps.voteStore.getVotes(payload.email);
        Rhum.asserts.assertEquals(votes.length, 1);
      },
    );

    Rhum.testCase(
      "should authorize vote if the user voted in the past",
      async () => {
        const initialPlayers: Player[] = [...players];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: [...players.slice(1, 12).map((_) => _.id)],
        };
        const initialVotes: Vote[] = [{
          email: payload.email,
          name: payload.name,
          votedDate: new Date("2021-03-01"),
        }];
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await vote(context)(payload);
        const votes = await deps.voteStore.getVotes(payload.email);
        Rhum.asserts.assertEquals(votes.length, 2);
      },
    );

    Rhum.testCase(
      "should authorize vote if the user submits his/her first vote",
      async () => {
        const initialPlayers: Player[] = [...players];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection: [...players.slice(1, 12).map((_) => _.id)],
        };
        const initialVotes: Vote[] = [];
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await vote(context)(payload);
        const votes = await deps.voteStore.getVotes(payload.email);
        Rhum.asserts.assertEquals(votes.length, 1);
      },
    );
  });

  Rhum.testSuite("Update votes count", () => {
    Rhum.testCase(
      "should update votes count for players",
      async () => {
        const initialPlayers: Player[] = [...players];
        const playersSelection = [...players.slice(1, 12).map((_) => _.id)];
        const payload: VotePayload = {
          email: "zizou@yahoo.fr",
          name: "Zizou",
          playersSelection,
        };
        const initialVotes: Vote[] = [];
        const { context, deps } = initTestDeps(initialVotes, initialPlayers);

        await vote(context)(payload);
        const playersAfterVote = await deps.playerStore.listPlayersById(
          playersSelection,
        );
        const votesCount = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        Rhum.asserts.assertEquals(
          playersAfterVote.map((_) => _.votes),
          votesCount,
        );
      },
    );
  });
});

Rhum.run();
