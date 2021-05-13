import { log } from "../../../deps.ts";
import { faker, Rhum } from "../../../dev_deps.ts";
import { Context, populatePlayers } from "../populatePlayers.ts";
import {
  cityPlayers,
  englishTeams,
  fakeFetchPlayers,
  InMemoryJobStore,
  InMemoryPlayerStore,
  InMemoryTeamsStore,
  manUtdPlayers,
} from "./stubs.ts";
import {
  FootballApiPlayer,
  FootballApiTeam,
  Job,
  newSeason,
  Season,
} from "../types.ts";
import {
  FootballApiResponse,
  RateLimitError,
} from "../utils/apifootball/types.ts";

function initTestDeps(
  teams: FootballApiResponse<FootballApiTeam> = englishTeams,
  initialStoredTeams: FootballApiTeam[] = [],
  initialJobs: Job[] = [],
  props: Partial<Context> = {},
  fetchPlayers: (
    season: number,
    teamId: number,
    page: number,
  ) => Promise<FootballApiResponse<FootballApiPlayer>> = fakeFetchPlayers,
) {
  const jobStore = new InMemoryJobStore(initialJobs);
  const teamStore = new InMemoryTeamsStore(initialStoredTeams);
  const playerStore = new InMemoryPlayerStore();

  const context: Context = {
    season: newSeason(2020),
    jobApi: {
      initJob: () => jobStore.initJob(),
      findLastJob: () => jobStore.findLastJob(),
      updateJobIdWithCurrentTeam: (jobId: string, teamId: number) =>
        jobStore.updateJobIdWithCurrentTeam(jobId, teamId),
      completeJob: (jobId: string) => jobStore.completeJob(jobId),
    },
    teamApi: {
      fetchTeams: () => Promise.resolve(teams),
      saveTeams: (_season: Season, teams: FootballApiTeam[]) =>
        teamStore.saveTeams(teams),
      getTeamsIds: () => teamStore.getTeamsIds(),
    },
    playerApi: {
      fetchPlayers,
      saveFootballApiPlayers: (_season: Season, players: FootballApiPlayer[]) =>
        playerStore.savePlayers(players),
    },
    options: {
      mode: "full-refresh" as const,
    },
    logger: log.getLogger("tests"),
    ...props,
  };

  return {
    context,
    deps: {
      jobStore,
      teamStore,
      playerStore,
    },
  };
}

Rhum.testPlan("Populate player", () => {
  Rhum.testSuite("Standard behavior", () => {
    Rhum.testCase(
      "should fetch teams and fetch players for each team",
      async () => {
        const { context, deps } = initTestDeps(englishTeams);
        await populatePlayers(context);

        const teamsIds = await deps.teamStore.getTeamsIds();
        const players = deps.playerStore.listPlayers();
        Rhum.asserts.assertEquals(
          teamsIds,
          englishTeams.response.map((_) => _.team.id),
        );
        Rhum.asserts.assertEquals(
          players.length,
          cityPlayers.results + manUtdPlayers.results,
        );
      },
    );

    Rhum.testCase(
      "should save the current team processed if a rate limit error is raised",
      async () => {
        const fetchPlayers = () =>
          Promise.reject(new RateLimitError("Rate limit reached"));
        const { context, deps } = initTestDeps(
          englishTeams,
          [],
          [],
          {},
          fetchPlayers,
        );
        await populatePlayers(context);
        const job = await deps.jobStore.findLastJob();
        Rhum.asserts.assertEquals(
          job?.teamId,
          englishTeams.response[0].team.id,
        );
      },
    );
    Rhum.testCase(
      "should not save the current team processed if other error occur",
      async () => {
        const fetchPlayers = () => Promise.reject(new Error("Boom"));
        const { context, deps } = initTestDeps(
          englishTeams,
          [],
          [],
          {},
          fetchPlayers,
        );
        await Rhum.asserts.assertThrowsAsync(
          () => populatePlayers(context),
          Error,
        );
        const job = await deps.jobStore.findLastJob();
        Rhum.asserts.assertExists(!(job?.teamId));
      },
    );

    Rhum.testCase("should handle paginated results", async () => {
      const cityTeam = englishTeams.response[3];
      const cityTeamId = cityTeam.team.id;
      const fetchPlayers = (
        _season: number,
        teamId: number,
        page: number,
      ): Promise<FootballApiResponse<FootballApiPlayer>> => {
        let response: FootballApiPlayer[] = [];
        if (teamId === cityTeamId) {
          if (page === 1) {
            response = cityPlayers.response.slice(0, 2);
          } else {
            response = cityPlayers.response.slice(2);
          }
        }
        return Promise.resolve({
          errors: [],
          results: 0,
          paging: {
            current: page,
            total: 2,
          },
          response,
        });
      };
      const { context, deps } = initTestDeps(
        englishTeams,
        [],
        [],
        {},
        fetchPlayers,
      );
      await populatePlayers(context);

      const players = deps.playerStore.listPlayers();
      Rhum.asserts.assertEquals(players.length, cityPlayers.response.length);
    });
  });
  Rhum.testSuite("In full-refresh mode", () => {
    Rhum.testCase(
      "should always fetch teams even if there are existing teams in the store and upsert them",
      async () => {
        const currentTeamsStored = [...englishTeams.response.slice(0, 2)];
        const teamsToFetch = {
          ...englishTeams,
          response: englishTeams.response.slice(2),
        };
        const { context, deps } = initTestDeps(
          teamsToFetch,
          currentTeamsStored,
        );
        await populatePlayers(context);

        const teamsIds = await deps.teamStore.getTeamsIds();
        Rhum.asserts.assertEquals(
          teamsIds.length,
          currentTeamsStored.length + teamsToFetch.response.length,
        );
      },
    );
  });

  Rhum.testSuite("In incremental mode", () => {
    Rhum.testCase(
      "should get teams from the store and process only teams that have not yet been processed",
      async () => {
        const manUtdTeam = englishTeams.response[0];
        const liverpoolTeam = englishTeams.response[1];
        const chelseaTeam = englishTeams.response[2];
        const cityTeam = englishTeams.response[3];
        const lastTeamProcessed = chelseaTeam.team.id;

        const currentJobsStore = [
          {
            id: faker.random.uuid(),
            jobStatus: "SUSPENDED" as const,
            startDate: new Date(),
            teamId: lastTeamProcessed,
          },
        ];
        const currentTeamsStored = [
          manUtdTeam,
          liverpoolTeam,
          chelseaTeam,
          cityTeam,
        ];
        const teamsToFetch = {
          ...englishTeams,
          response: [manUtdTeam, liverpoolTeam],
        };
        const { context, deps } = initTestDeps(
          teamsToFetch,
          currentTeamsStored,
          currentJobsStore,
          {
            options: {
              mode: "incremental" as const,
            },
          },
        );
        await populatePlayers(context);

        const teamsIds = await deps.teamStore.getTeamsIds();
        const players = deps.playerStore.listPlayers();
        Rhum.asserts.assertEquals(teamsIds, [
          manUtdTeam.team.id,
          liverpoolTeam.team.id,
          chelseaTeam.team.id,
          cityTeam.team.id,
        ]);
        Rhum.asserts.assertEquals(players.length, cityPlayers.response.length);
      },
    );

    Rhum.testCase(
      "should get teams from the store and process all teams if no team have been processed before",
      async () => {
        const manUtdTeam = englishTeams.response[0];
        const liverpoolTeam = englishTeams.response[1];
        const chelseaTeam = englishTeams.response[2];

        const currentJobsStore = [
          {
            id: faker.random.uuid(),
            startDate: new Date(),
            jobStatus: "COMPLETED" as const,
            teamId: undefined,
          },
        ];
        const currentTeamsStored = [manUtdTeam, liverpoolTeam];
        const teamsToFetch = {
          ...englishTeams,
          response: [chelseaTeam, liverpoolTeam],
        };
        const { context, deps } = initTestDeps(
          teamsToFetch,
          currentTeamsStored,
          currentJobsStore,
          {
            options: {
              mode: "incremental" as const,
            },
          },
        );
        await populatePlayers(context);

        const teamsIds = await deps.teamStore.getTeamsIds();
        const players = deps.playerStore.listPlayers();
        Rhum.asserts.assertEquals(
          [manUtdTeam.team.id, liverpoolTeam.team.id],
          teamsIds,
        );
        Rhum.asserts.assertEquals(
          players.length,
          manUtdPlayers.response.length,
        );
      },
    );

    Rhum.testCase(
      "should init a new job if no full-refresh mode has been initiated before",
      async () => {
        const currentJobsStore: Job[] = [];

        const { context, deps } = initTestDeps(
          englishTeams,
          [],
          currentJobsStore,
          {
            options: {
              mode: "incremental" as const,
            },
          },
        );
        await populatePlayers(context);
        const teamsIds = await deps.teamStore.getTeamsIds();
        const job = await deps.jobStore.findLastJob();
        Rhum.asserts.assertExists(job);
        Rhum.asserts.assertEquals(
          teamsIds,
          englishTeams.response.map((_) => _.team.id),
        );
      },
    );
  });
});

Rhum.run();
