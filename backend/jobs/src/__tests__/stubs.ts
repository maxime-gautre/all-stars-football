import { faker } from "../../../dev_deps.ts";
import { Job } from "../jobs/types.ts";
import { FootballApiTeam } from "../teams/types.ts";
import { FootballApiPlayer } from "../players/types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";

export class InMemoryJobStore {
  private readonly jobStore = new Map<string, Job>();
  constructor(initialJobs: Job[] = []) {
    initialJobs.forEach((job) => {
      this.jobStore.set(job.id, job);
    });
  }

  initJob(): Promise<Job> {
    const job = {
      id: faker.random.uuid(),
      startDate: new Date(),
    };
    this.jobStore.set(job.id, job);
    return Promise.resolve(job);
  }

  findLastJob(): Promise<Job | undefined> {
    const sortedJobs = Array.from(this.jobStore.values()).sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    return Promise.resolve(sortedJobs[0] ?? undefined);
  }

  updateJobIdWithCurrentTeam(jobId: string, teamId: number): Promise<string> {
    const maybeJob = this.jobStore.get(jobId);
    if (maybeJob) {
      this.jobStore.set(jobId, {
        ...maybeJob,
        teamId: teamId,
      });
    }
    return Promise.resolve(jobId);
  }

  completeJob(jobId: string): Promise<string> {
    const maybeJob = this.jobStore.get(jobId);
    if (maybeJob) {
      this.jobStore.set(jobId, {
        ...maybeJob,
        endDate: new Date(),
      });
    }
    return Promise.resolve(jobId);
  }
}

export class InMemoryTeamsStore {
  private readonly teamsStore = new Map<number, FootballApiTeam>();
  constructor(private readonly initTeams: FootballApiTeam[] = []) {
    void this.saveTeams(initTeams);
  }

  saveTeams(teams: FootballApiTeam[]): Promise<void> {
    teams.forEach((el) => {
      this.teamsStore.set(el.team.id, el);
    });
    return Promise.resolve();
  }

  getTeamsIds(): Promise<number[]> {
    return Promise.resolve(Array.from(this.teamsStore.keys()));
  }
}

export class InMemoryPlayerStore {
  private readonly playerStore = new Map<number, FootballApiPlayer>();

  savePlayers(players: FootballApiPlayer[]): Promise<void> {
    players.forEach((el) => {
      this.playerStore.set(el.player.id, el);
    });
    return Promise.resolve();
  }

  listPlayers(): FootballApiPlayer[] {
    return Array.from(this.playerStore.values());
  }
}

export const englishTeams = {
  errors: [],
  results: 4,
  paging: {
    current: 1,
    total: 1,
  },
  response: [
    {
      team: {
        id: 33,
        name: "Manchester United",
        country: "England",
        founded: 1878,
        national: false,
        logo: "https://media.api-sports.io/football/teams/33.png",
      },
      venue: {
        id: 556,
        name: "Old Trafford",
        address: "Sir Matt Busby Way",
        city: "Manchester",
        capacity: 76212,
        surface: "grass",
        image: "https://media.api-sports.io/football/venues/556.png",
      },
    },
    {
      team: {
        id: 40,
        name: "Liverpool",
        country: "England",
        founded: 1892,
        national: false,
        logo: "https://media.api-sports.io/football/teams/40.png",
      },
      venue: {
        id: 550,
        name: "Anfield",
        address: "Anfield Road",
        city: "Liverpool",
        capacity: 55212,
        surface: "grass",
        image: "https://media.api-sports.io/football/venues/550.png",
      },
    },
    {
      team: {
        id: 49,
        name: "Chelsea",
        country: "England",
        founded: 1905,
        national: false,
        logo: "https://media.api-sports.io/football/teams/49.png",
      },
      venue: {
        id: 519,
        name: "Stamford Bridge",
        address: "Fulham Road",
        city: "London",
        capacity: 41841,
        surface: "grass",
        image: "https://media.api-sports.io/football/venues/519.png",
      },
    },
    {
      team: {
        id: 50,
        name: "Manchester City",
        country: "England",
        founded: 1880,
        national: false,
        logo: "https://media.api-sports.io/football/teams/50.png",
      },
      venue: {
        id: 555,
        name: "Etihad Stadium",
        address: "Rowsley Street",
        city: "Manchester",
        capacity: 55097,
        surface: "grass",
        image: "https://media.api-sports.io/football/venues/555.png",
      },
    },
  ],
};

export const cityPlayers = {
  errors: [],
  results: 4,
  paging: {
    current: 1,
    total: 1,
  },
  response: [
    {
      player: {
        id: 629,
        name: "K. De Bruyne",
        firstname: "Kevin",
        lastname: "De Bruyne",
        age: 30,
        birth: {
          date: "1991-06-28",
          place: "Drongen",
          country: "Belgium",
        },
        nationality: "Belgium",
        height: "181 cm",
        weight: "68 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/629.png",
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
          substitutes: {
            in: 2,
            out: 6,
            bench: 4,
          },
          shots: {
            total: 51,
            on: 25,
          },
          goals: {
            total: 5,
            conceded: 0,
            assists: 11,
            saves: null,
          },
          passes: {
            total: 1205,
            key: 74,
            accuracy: 41,
          },
          tackles: {
            total: 34,
            blocks: 1,
            interceptions: 9,
          },
          duels: {
            total: 223,
            won: 110,
          },
          dribbles: {
            attempts: 61,
            success: 42,
            past: null,
          },
          fouls: {
            drawn: 30,
            committed: 24,
          },
          cards: {
            yellow: 1,
            yellowred: 0,
            red: 0,
          },
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
          substitutes: {
            in: 0,
            out: 2,
            bench: 3,
          },
          shots: {
            total: 7,
            on: 5,
          },
          goals: {
            total: 2,
            conceded: 0,
            assists: 4,
            saves: null,
          },
          passes: {
            total: 246,
            key: 14,
            accuracy: 52,
          },
          tackles: {
            total: 5,
            blocks: 2,
            interceptions: 1,
          },
          duels: {
            total: 32,
            won: 16,
          },
          dribbles: {
            attempts: 8,
            success: 4,
            past: null,
          },
          fouls: {
            drawn: 5,
            committed: 2,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
    {
      player: {
        id: 633,
        name: "İ. Gündoğan",
        firstname: "İlkay",
        lastname: "Gündoğan",
        age: 31,
        birth: {
          date: "1990-10-24",
          place: "Gelsenkirchen",
          country: "Germany",
        },
        nationality: "Germany",
        height: "180 cm",
        weight: "80 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/633.png",
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
            lineups: 20,
            minutes: 1776,
            number: null,
            position: "Midfielder",
            rating: "7.337500",
            captain: false,
          },
          substitutes: {
            in: 4,
            out: 6,
            bench: 8,
          },
          shots: {
            total: 36,
            on: 20,
          },
          goals: {
            total: 12,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 1430,
            key: 35,
            accuracy: 54,
          },
          tackles: {
            total: 19,
            blocks: 3,
            interceptions: 19,
          },
          duels: {
            total: 131,
            won: 69,
          },
          dribbles: {
            attempts: 32,
            success: 22,
            past: null,
          },
          fouls: {
            drawn: 20,
            committed: 6,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 1,
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
            appearences: 8,
            lineups: 8,
            minutes: 618,
            number: null,
            position: "Midfielder",
            rating: "7.250000",
            captain: false,
          },
          substitutes: {
            in: 0,
            out: 5,
            bench: 1,
          },
          shots: {
            total: 7,
            on: 4,
          },
          goals: {
            total: 3,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 564,
            key: 8,
            accuracy: 63,
          },
          tackles: {
            total: 11,
            blocks: null,
            interceptions: 9,
          },
          duels: {
            total: 53,
            won: 27,
          },
          dribbles: {
            attempts: 9,
            success: 6,
            past: null,
          },
          fouls: {
            drawn: 7,
            committed: 8,
          },
          cards: {
            yellow: 1,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
    {
      player: {
        id: 636,
        name: "Bernardo Silva",
        firstname: "Bernardo",
        lastname: "Mota Veiga de Carvalho e Silva",
        age: 27,
        birth: {
          date: "1994-08-10",
          place: "Lisboa",
          country: "Portugal",
        },
        nationality: "Portugal",
        height: "173 cm",
        weight: "64 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/636.png",
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
            appearences: 23,
            lineups: 21,
            minutes: 1814,
            number: null,
            position: "Midfielder",
            rating: "6.978260",
            captain: false,
          },
          substitutes: {
            in: 2,
            out: 6,
            bench: 9,
          },
          shots: {
            total: 21,
            on: 13,
          },
          goals: {
            total: 2,
            conceded: 0,
            assists: 4,
            saves: null,
          },
          passes: {
            total: 1209,
            key: 22,
            accuracy: 48,
          },
          tackles: {
            total: 24,
            blocks: 1,
            interceptions: 15,
          },
          duels: {
            total: 208,
            won: 87,
          },
          dribbles: {
            attempts: 56,
            success: 35,
            past: null,
          },
          fouls: {
            drawn: 17,
            committed: 15,
          },
          cards: {
            yellow: 4,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
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
            appearences: 9,
            lineups: 7,
            minutes: 604,
            number: null,
            position: "Midfielder",
            rating: "6.900000",
            captain: false,
          },
          substitutes: {
            in: 2,
            out: 2,
            bench: 2,
          },
          shots: {
            total: 6,
            on: 4,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 362,
            key: 10,
            accuracy: 35,
          },
          tackles: {
            total: 6,
            blocks: null,
            interceptions: 2,
          },
          duels: {
            total: 55,
            won: 23,
          },
          dribbles: {
            attempts: 19,
            success: 8,
            past: null,
          },
          fouls: {
            drawn: 6,
            committed: 5,
          },
          cards: {
            yellow: 1,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
    {
      player: {
        id: 855,
        name: "João Cancelo",
        firstname: "João Pedro",
        lastname: "Cavaco Cancelo",
        age: 27,
        birth: {
          date: "1994-05-27",
          place: "Barreiro",
          country: "Portugal",
        },
        nationality: "Portugal",
        height: "182 cm",
        weight: "74 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/855.png",
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
            lineups: 23,
            minutes: 2038,
            number: null,
            position: "Defender",
            rating: "7.283333",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 2,
            bench: 6,
          },
          shots: {
            total: 20,
            on: 9,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: 3,
            saves: null,
          },
          passes: {
            total: 1631,
            key: 43,
            accuracy: 58,
          },
          tackles: {
            total: 58,
            blocks: 2,
            interceptions: 35,
          },
          duels: {
            total: 277,
            won: 140,
          },
          dribbles: {
            attempts: 74,
            success: 43,
            past: null,
          },
          fouls: {
            drawn: 11,
            committed: 33,
          },
          cards: {
            yellow: 4,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
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
            appearences: 8,
            lineups: 6,
            minutes: 544,
            number: null,
            position: "Defender",
            rating: "7.225000",
            captain: false,
          },
          substitutes: {
            in: 2,
            out: 1,
            bench: 3,
          },
          shots: {
            total: 6,
            on: 3,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 494,
            key: 7,
            accuracy: 54,
          },
          tackles: {
            total: 19,
            blocks: null,
            interceptions: 6,
          },
          duels: {
            total: 86,
            won: 47,
          },
          dribbles: {
            attempts: 27,
            success: 14,
            past: null,
          },
          fouls: {
            drawn: 2,
            committed: 10,
          },
          cards: {
            yellow: 2,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
  ],
};

export const manUtdPlayers = {
  errors: [],
  results: 3,
  paging: {
    current: 1,
    total: 1,
  },
  response: [
    {
      player: {
        id: 904,
        name: "P. Pogba",
        firstname: "Paul",
        lastname: "Pogba",
        age: 28,
        birth: {
          date: "1993-03-15",
          place: "Lagny-sur-Marne",
          country: "France",
        },
        nationality: "France",
        height: "191 cm",
        weight: "84 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/904.png",
      },
      statistics: [
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 21,
            lineups: 17,
            minutes: 1522,
            number: null,
            position: "Midfielder",
            rating: "7.000000",
            captain: false,
          },
          substitutes: {
            in: 4,
            out: 4,
            bench: 6,
          },
          shots: {
            total: 18,
            on: 10,
          },
          goals: {
            total: 3,
            conceded: 0,
            assists: 2,
            saves: null,
          },
          passes: {
            total: 1106,
            key: 17,
            accuracy: 43,
          },
          tackles: {
            total: 29,
            blocks: 1,
            interceptions: 22,
          },
          duels: {
            total: 267,
            won: 141,
          },
          dribbles: {
            attempts: 49,
            success: 36,
            past: null,
          },
          fouls: {
            drawn: 31,
            committed: 31,
          },
          cards: {
            yellow: 3,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 5,
            lineups: 1,
            minutes: 178,
            number: null,
            position: "Midfielder",
            rating: "6.840000",
            captain: false,
          },
          substitutes: {
            in: 4,
            out: 1,
            bench: 4,
          },
          shots: {
            total: 3,
            on: null,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: 2,
            saves: null,
          },
          passes: {
            total: 107,
            key: 5,
            accuracy: 17,
          },
          tackles: {
            total: 3,
            blocks: null,
            interceptions: 3,
          },
          duels: {
            total: 39,
            won: 20,
          },
          dribbles: {
            attempts: 7,
            success: 4,
            past: null,
          },
          fouls: {
            drawn: 8,
            committed: 2,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
          },
          league: {
            id: 3,
            name: "UEFA Europa League",
            country: "World",
            logo: "https://media.api-sports.io/football/leagues/3.png",
            flag: null,
            season: 2020,
          },
          games: {
            appearences: 2,
            lineups: 1,
            minutes: 118,
            number: null,
            position: "Midfielder",
            rating: "7.500000",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 1,
            bench: 1,
          },
          shots: {
            total: 4,
            on: 1,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: null,
            saves: null,
          },
          passes: {
            total: 82,
            key: 4,
            accuracy: 34,
          },
          tackles: {
            total: 2,
            blocks: null,
            interceptions: 2,
          },
          duels: {
            total: 19,
            won: 11,
          },
          dribbles: {
            attempts: 3,
            success: 2,
            past: null,
          },
          fouls: {
            drawn: 3,
            committed: 3,
          },
          cards: {
            yellow: 1,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
    {
      player: {
        id: 909,
        name: "M. Rashford",
        firstname: "Marcus",
        lastname: "Rashford",
        age: 24,
        birth: {
          date: "1997-10-31",
          place: "Manchester",
          country: "England",
        },
        nationality: "England",
        height: "180 cm",
        weight: "70 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/909.png",
      },
      statistics: [
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 31,
            lineups: 29,
            minutes: 2525,
            number: null,
            position: "Attacker",
            rating: "6.912903",
            captain: false,
          },
          substitutes: {
            in: 2,
            out: 9,
            bench: 2,
          },
          shots: {
            total: 50,
            on: 33,
          },
          goals: {
            total: 10,
            conceded: 0,
            assists: 7,
            saves: null,
          },
          passes: {
            total: 1051,
            key: 35,
            accuracy: 27,
          },
          tackles: {
            total: 12,
            blocks: 2,
            interceptions: 8,
          },
          duels: {
            total: 308,
            won: 141,
          },
          dribbles: {
            attempts: 144,
            success: 76,
            past: null,
          },
          fouls: {
            drawn: 33,
            committed: 22,
          },
          cards: {
            yellow: 4,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 6,
            lineups: 5,
            minutes: 416,
            number: null,
            position: "Attacker",
            rating: "7.450000",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 3,
            bench: 1,
          },
          shots: {
            total: 14,
            on: 12,
          },
          goals: {
            total: 6,
            conceded: 0,
            assists: null,
            saves: null,
          },
          passes: {
            total: 140,
            key: 5,
            accuracy: 18,
          },
          tackles: {
            total: 1,
            blocks: null,
            interceptions: null,
          },
          duels: {
            total: 54,
            won: 24,
          },
          dribbles: {
            attempts: 28,
            success: 15,
            past: null,
          },
          fouls: {
            drawn: 8,
            committed: 1,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 1,
            missed: 0,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
          },
          league: {
            id: 3,
            name: "UEFA Europa League",
            country: "World",
            logo: "https://media.api-sports.io/football/leagues/3.png",
            flag: null,
            season: 2020,
          },
          games: {
            appearences: 4,
            lineups: 3,
            minutes: 224,
            number: null,
            position: "Attacker",
            rating: "7.050000",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 3,
            bench: 1,
          },
          shots: {
            total: 7,
            on: 4,
          },
          goals: {
            total: 2,
            conceded: 0,
            assists: null,
            saves: null,
          },
          passes: {
            total: 75,
            key: 3,
            accuracy: 15,
          },
          tackles: {
            total: 1,
            blocks: null,
            interceptions: null,
          },
          duels: {
            total: 29,
            won: 14,
          },
          dribbles: {
            attempts: 12,
            success: 9,
            past: null,
          },
          fouls: {
            drawn: 4,
            committed: 2,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
    {
      player: {
        id: 1485,
        name: "Bruno Fernandes",
        firstname: "Bruno Miguel",
        lastname: "Borges Fernandes",
        age: 27,
        birth: {
          date: "1994-09-08",
          place: "Maia",
          country: "Portugal",
        },
        nationality: "Portugal",
        height: "179 cm",
        weight: "80 kg",
        injured: false,
        photo: "https://media.api-sports.io/football/players/1485.png",
      },
      statistics: [
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 31,
            lineups: 30,
            minutes: 2651,
            number: null,
            position: "Midfielder",
            rating: "7.632258",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 11,
            bench: 1,
          },
          shots: {
            total: 64,
            on: 43,
          },
          goals: {
            total: 16,
            conceded: 0,
            assists: 11,
            saves: null,
          },
          passes: {
            total: 1803,
            key: 88,
            accuracy: 45,
          },
          tackles: {
            total: 52,
            blocks: null,
            interceptions: 24,
          },
          duels: {
            total: 314,
            won: 123,
          },
          dribbles: {
            attempts: 36,
            success: 16,
            past: null,
          },
          fouls: {
            drawn: 43,
            committed: 38,
          },
          cards: {
            yellow: 5,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 8,
            missed: 1,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
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
            appearences: 6,
            lineups: 5,
            minutes: 439,
            number: null,
            position: "Midfielder",
            rating: "7.883333",
            captain: false,
          },
          substitutes: {
            in: 1,
            out: 2,
            bench: 1,
          },
          shots: {
            total: 17,
            on: 9,
          },
          goals: {
            total: 4,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 292,
            key: 14,
            accuracy: 35,
          },
          tackles: {
            total: 9,
            blocks: null,
            interceptions: 4,
          },
          duels: {
            total: 54,
            won: 23,
          },
          dribbles: {
            attempts: 7,
            success: 3,
            past: null,
          },
          fouls: {
            drawn: 9,
            committed: 4,
          },
          cards: {
            yellow: 1,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 2,
            missed: 0,
            saved: null,
          },
        },
        {
          team: {
            id: 33,
            name: "Manchester United",
            logo: "https://media.api-sports.io/football/teams/33.png",
          },
          league: {
            id: 3,
            name: "UEFA Europa League",
            country: "World",
            logo: "https://media.api-sports.io/football/leagues/3.png",
            flag: null,
            season: 2020,
          },
          games: {
            appearences: 5,
            lineups: 5,
            minutes: 383,
            number: null,
            position: "Midfielder",
            rating: "7.620000",
            captain: false,
          },
          substitutes: {
            in: 0,
            out: 3,
            bench: 0,
          },
          shots: {
            total: 9,
            on: 7,
          },
          goals: {
            total: 3,
            conceded: 0,
            assists: 1,
            saves: null,
          },
          passes: {
            total: 233,
            key: 12,
            accuracy: 37,
          },
          tackles: {
            total: 9,
            blocks: null,
            interceptions: 3,
          },
          duels: {
            total: 48,
            won: 25,
          },
          dribbles: {
            attempts: 5,
            success: 3,
            past: null,
          },
          fouls: {
            drawn: 9,
            committed: 3,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 1,
            missed: 0,
            saved: null,
          },
        },
      ],
    },
  ],
};

export const fakeFetchPlayers = (
  teamId: number,
): Promise<FootballApiResponse<FootballApiPlayer>> => {
  const cityTeamId = 50;
  const manUtdTeamId = 33;
  if (teamId === cityTeamId) return Promise.resolve(cityPlayers);
  if (teamId === manUtdTeamId) return Promise.resolve(manUtdPlayers);
  return Promise.resolve({
    errors: [],
    results: 0,
    paging: {
      current: 1,
      total: 1,
    },
    response: [],
  });
};
