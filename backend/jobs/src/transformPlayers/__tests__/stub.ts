import { Player } from "../../types.ts";

export class InMemoryPlayerStore {
  private readonly playerStore: Player[] = [];

  savePlayers(players: Player[]): Promise<void> {
    players.forEach((el) => {
      this.playerStore.push(el);
    });
    return Promise.resolve();
  }

  getPlayer(id: number): Player | undefined {
    return this.playerStore.find((_) => _.id === id);
  }
}

export const footballApiPlayers = [
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
          committed: null,
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
          won: 1,
          commited: null,
          scored: 0,
          missed: 0,
          saved: null,
        },
      },
    ],
  },
];
