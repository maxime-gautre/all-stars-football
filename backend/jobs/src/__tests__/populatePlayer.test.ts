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
import { FootballApiPlayer, FootballApiTeam, Job, Player } from "../types.ts";
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
    teamId: number,
    page: number,
  ) => Promise<FootballApiResponse<FootballApiPlayer>> = fakeFetchPlayers,
) {
  const jobStore = new InMemoryJobStore(initialJobs);
  const teamStore = new InMemoryTeamsStore(initialStoredTeams);
  const playerStore = new InMemoryPlayerStore();

  return {
    context: {
      jobApi: {
        initJob: () => jobStore.initJob(),
        findLastJob: () => jobStore.findLastJob(),
        updateJobIdWithCurrentTeam: (jobId: string, teamId: number) =>
          jobStore.updateJobIdWithCurrentTeam(jobId, teamId),
        completeJob: (jobId: string) => jobStore.completeJob(jobId),
      },
      teamApi: {
        fetchTeams: () => Promise.resolve(teams),
        saveTeams: (teams: FootballApiTeam[]) => teamStore.saveTeams(teams),
        getTeamsIds: () => teamStore.getTeamsIds(),
      },
      playerApi: {
        fetchPlayers,
        savePlayers: (players: Player[]) => playerStore.savePlayers(players),
      },
      options: {
        mode: "full-refresh" as const,
      },
      logger: log.getLogger("tests"),
      ...props,
    },
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
      "should aggregate stats of all competitions",
      async () => {
        const { context, deps } = initTestDeps(englishTeams);
        await populatePlayers(context);

        const teamsIds = await deps.teamStore.getTeamsIds();
        const cityPlayer = cityPlayers.response[0];
        const savedPlayer = deps.playerStore.getPlayer(cityPlayer.player.id);
        Rhum.asserts.assertEquals(
          teamsIds,
          englishTeams.response.map((_) => _.team.id),
        );

        const expectedPlayer = {
          id: 629,
          personalInfo: {
            name: "K. De Bruyne",
            firstname: "Kevin",
            lastname: "De Bruyne",
            age: 30,
            birth: { date: "1991-06-28", place: "Drongen", country: "Belgium" },
            nationality: "Belgium",
            height: "181 cm",
            weight: "68 kg",
            injured: false,
            photo: "https://media.api-sports.io/football/players/629.png",
          },
          total: {
            team: {
              id: 50,
              name: "Manchester City",
              logo: "https://media.api-sports.io/football/teams/50.png",
            },
            league: {
              id: 39,
              name: "Premier League",
              country: "England",
              logo: "https://media.api-sports.io/football/leagues/39.png",
              flag: "https://media.api-sports.io/flags/gb.svg",
              season: 2020,
            },
            games: {
              appearences: 28,
              lineups: 26,
              minutes: 2258,
              number: null,
              position: "Midfielder",
              rating: "7.9875",
              captain: false,
            },
            substitutes: { bench: 7, in: 2, out: 8 },
            shots: { total: 58, on: 30 },
            goals: { total: 7, conceded: 0, assists: 15, saves: null },
            passes: { total: 1451, key: 88, accuracy: 93 },
            tackles: { total: 39, blocks: 3, interceptions: 10 },
            duels: { total: 255, won: 126 },
            dribbles: { attempts: 69, success: 46, past: null },
            fouls: { drawn: 35, committed: 2 },
            cards: { yellow: 1, yellowred: 0, red: 0 },
            penalty: {
              won: 1,
              commited: null,
              scored: 2,
              missed: 1,
              saved: null,
            },
          },
          statistics: [
            {
              team: {
                id: 50,
                name: "Manchester City",
                logo: "https://media.api-sports.io/football/teams/50.png",
              },
              league: {
                id: 39,
                name: "Premier League",
                country: "England",
                logo: "https://media.api-sports.io/football/leagues/39.png",
                flag: "https://media.api-sports.io/flags/gb.svg",
                season: 2020,
              },
              games: {
                appearences: 24,
                lineups: 22,
                minutes: 1911,
                number: null,
                position: "Midfielder",
                rating: "7.725000",
                captain: false,
              },
              substitutes: { in: 2, out: 6, bench: 4 },
              shots: { total: 51, on: 25 },
              goals: { total: 5, conceded: 0, assists: 11, saves: null },
              passes: { total: 1205, key: 74, accuracy: 41 },
              tackles: { total: 34, blocks: 1, interceptions: 9 },
              duels: { total: 223, won: 110 },
              dribbles: { attempts: 61, success: 42, past: null },
              fouls: { drawn: 30, committed: null },
              cards: { yellow: 1, yellowred: 0, red: 0 },
              penalty: {
                won: null,
                commited: null,
                scored: 2,
                missed: 1,
                saved: null,
              },
            },
            {
              team: {
                id: 50,
                name: "Manchester City",
                logo: "https://media.api-sports.io/football/teams/50.png",
              },
              league: {
                id: 2,
                name: "UEFA Champions League",
                country: "World",
                logo: "https://media.api-sports.io/football/leagues/2.png",
                flag: null,
                season: 2020,
              },
              games: {
                appearences: 4,
                lineups: 4,
                minutes: 347,
                number: null,
                position: "Midfielder",
                rating: "8.250000",
                captain: false,
              },
              substitutes: { in: 0, out: 2, bench: 3 },
              shots: { total: 7, on: 5 },
              goals: { total: 2, conceded: 0, assists: 4, saves: null },
              passes: { total: 246, key: 14, accuracy: 52 },
              tackles: { total: 5, blocks: 2, interceptions: 1 },
              duels: { total: 32, won: 16 },
              dribbles: { attempts: 8, success: 4, past: null },
              fouls: { drawn: 5, committed: 2 },
              cards: { yellow: 0, yellowred: 0, red: 0 },
              penalty: {
                won: 1,
                commited: null,
                scored: 0,
                missed: 0,
                saved: null,
              },
            },
          ],
        };
        Rhum.asserts.assertEquals(
          savedPlayer,
          expectedPlayer,
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
        await Rhum.asserts.assertThrowsAsync(
          () => populatePlayers(context),
          RateLimitError,
        );
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
        const lastTeamProcessed = undefined;

        const currentJobsStore = [
          {
            id: faker.random.uuid(),
            startDate: new Date(),
            teamId: lastTeamProcessed,
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
