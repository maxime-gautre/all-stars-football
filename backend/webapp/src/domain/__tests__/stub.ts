import { Player, Vote } from "../types.ts";

export class InMemoryVoteRepository {
  votes: Vote[] = [];

  constructor(private readonly initialVotes: Vote[] = []) {
    this.votes = [...initialVotes];
  }

  getLastVote(email: string): Promise<Vote | undefined> {
    const sortedVotes = this.votes
      .filter((_) => _.email === email)
      .sort((a, b) => b.votedDate.getTime() - a.votedDate.getTime());

    return Promise.resolve(sortedVotes[0]);
  }

  getVotes(email: string): Vote[] {
    return this.votes.filter((_) => _.email === email);
  }

  saveVote(vote: Vote): Promise<void> {
    this.votes.push(vote);
    return Promise.resolve();
  }
}

export class InMemoryPlayersRepository {
  players: Player[] = [];

  constructor(private readonly initialPlayers: Player[] = []) {
    this.players = [...initialPlayers];
  }

  listPlayersById(playerIds: number[]): Promise<Player[]> {
    const players = this.players.filter((_) => playerIds.includes(_.id));
    return Promise.resolve(players);
  }

  updatePlayersVoteCount(playerIds: number[]): Promise<void> {
    const newPlayers = this.players.map((p) => {
      if (playerIds.includes(p.id)) {
        return {
          ...p,
          votes: p.votes + 1,
        };
      } else {
        return p;
      }
    });
    this.players = [...newPlayers];
    return Promise.resolve();
  }
}

export const players = [
  {
    id: 617,
    name: "Ederson Moraes",
    firstname: "Ederson",
    lastname: "Santana de Moraes",
    age: 28,
    birth: {
      date: "1993-08-17",
      place: "Osasco",
      country: "Brazil",
    },
    nationality: "Brazil",
    height: "188 cm",
    weight: "86 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/617.png",
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
          appearences: 32,
          lineups: 32,
          minutes: 2880,
          number: null,
          position: "Goalkeeper",
          rating: "6.896875",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: null,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 23,
          assists: 1,
          saves: 53,
        },
        passes: {
          total: 848,
          key: 1,
          accuracy: 21,
        },
        tackles: {
          total: 2,
          blocks: null,
          interceptions: null,
        },
        duels: {
          total: 14,
          won: 11,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: 4,
          committed: 1,
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
          saved: 0,
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
          lineups: 9,
          minutes: 810,
          number: null,
          position: "Goalkeeper",
          rating: "6.944444",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: null,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 3,
          assists: null,
          saves: 13,
        },
        passes: {
          total: 223,
          key: null,
          accuracy: 20,
        },
        tackles: {
          total: null,
          blocks: null,
          interceptions: null,
        },
        duels: {
          total: 4,
          won: 4,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: 2,
          committed: null,
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
          saved: 0,
        },
      },
    ],
    votes: 0,
  },
  {
    id: 127,
    name: "M. ter Stegen",
    firstname: "Marc-André",
    lastname: "ter Stegen",
    age: 29,
    birth: {
      date: "1992-04-30",
      place: "Mönchengladbach",
      country: "Germany",
    },
    nationality: "Germany",
    height: "187 cm",
    weight: "85 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/127.png",
    statistics: [
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
        },
        league: {
          id: 140,
          name: "Primera Division",
          country: "Spain",
          logo: "https://media.api-sports.io/football/leagues/140.png",
          flag: "https://media.api-sports.io/flags/es.svg",
          season: 2020,
        },
        games: {
          appearences: 26,
          lineups: 26,
          minutes: 2340,
          number: null,
          position: "Goalkeeper",
          rating: "6.903846",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: 1,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 23,
          assists: null,
          saves: 65,
        },
        passes: {
          total: 770,
          key: 1,
          accuracy: 25,
        },
        tackles: {
          total: null,
          blocks: null,
          interceptions: null,
        },
        duels: {
          total: 8,
          won: 5,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: null,
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
          scored: 0,
          missed: 0,
          saved: 0,
        },
      },
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
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
          lineups: 5,
          minutes: 450,
          number: null,
          position: "Goalkeeper",
          rating: "6.820000",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: null,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 9,
          assists: null,
          saves: 16,
        },
        passes: {
          total: 112,
          key: null,
          accuracy: 20,
        },
        tackles: {
          total: null,
          blocks: null,
          interceptions: null,
        },
        duels: {
          total: 2,
          won: 2,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: null,
          committed: null,
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
          saved: 1,
        },
      },
    ],
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
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
    votes: 0,
  },
  {
    id: 290,
    name: "V. van Dijk",
    firstname: "Virgil",
    lastname: "van Dijk",
    age: 30,
    birth: {
      date: "1991-07-08",
      place: "Breda",
      country: "Netherlands",
    },
    nationality: "Netherlands",
    height: "193 cm",
    weight: "92 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/290.png",
    statistics: [
      {
        team: {
          id: 40,
          name: "Liverpool",
          logo: "https://media.api-sports.io/football/teams/40.png",
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
          appearences: 5,
          lineups: 5,
          minutes: 371,
          number: null,
          position: "Defender",
          rating: "6.680000",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 1,
          bench: 0,
        },
        shots: {
          total: 3,
          on: 2,
        },
        goals: {
          total: 1,
          conceded: 0,
          assists: null,
          saves: null,
        },
        passes: {
          total: 341,
          key: null,
          accuracy: 61,
        },
        tackles: {
          total: 3,
          blocks: 1,
          interceptions: 5,
        },
        duels: {
          total: 27,
          won: 17,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: 2,
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
          scored: 0,
          missed: 0,
          saved: null,
        },
      },
      {
        team: {
          id: 40,
          name: "Liverpool",
          logo: "https://media.api-sports.io/football/teams/40.png",
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
          appearences: 0,
          lineups: 0,
          minutes: 0,
          number: null,
          position: "Defender",
          rating: null,
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: null,
          on: null,
        },
        goals: {
          total: 0,
          conceded: null,
          assists: null,
          saves: null,
        },
        passes: {
          total: null,
          key: null,
          accuracy: null,
        },
        tackles: {
          total: null,
          blocks: null,
          interceptions: null,
        },
        duels: {
          total: null,
          won: null,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: null,
          committed: null,
        },
        cards: {
          yellow: 0,
          yellowred: 0,
          red: 0,
        },
        penalty: {
          won: null,
          commited: null,
          scored: null,
          missed: null,
          saved: null,
        },
      },
    ],
    votes: 0,
  },
  {
    id: 162712,
    name: "Óscar Mingueza",
    firstname: "Óscar",
    lastname: "Mingueza García",
    age: 22,
    birth: {
      date: "1999-05-13",
      place: "Santa Perpètua de Mogoda",
      country: "Spain",
    },
    nationality: "Spain",
    height: "184 cm",
    weight: "75 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/162712.png",
    statistics: [
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
        },
        league: {
          id: 140,
          name: "Primera Division",
          country: "Spain",
          logo: "https://media.api-sports.io/football/leagues/140.png",
          flag: "https://media.api-sports.io/flags/es.svg",
          season: 2020,
        },
        games: {
          appearences: 23,
          lineups: 20,
          minutes: 1725,
          number: null,
          position: "Defender",
          rating: "7.021739",
          captain: false,
        },
        substitutes: {
          in: 3,
          out: 5,
          bench: 7,
        },
        shots: {
          total: 10,
          on: 5,
        },
        goals: {
          total: 2,
          conceded: 0,
          assists: 2,
          saves: null,
        },
        passes: {
          total: 1408,
          key: 8,
          accuracy: 56,
        },
        tackles: {
          total: 49,
          blocks: 4,
          interceptions: 18,
        },
        duels: {
          total: 146,
          won: 85,
        },
        dribbles: {
          attempts: 10,
          success: 8,
          past: null,
        },
        fouls: {
          drawn: 15,
          committed: 18,
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
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
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
          lineups: 3,
          minutes: 242,
          number: null,
          position: "Defender",
          rating: "6.920000",
          captain: false,
        },
        substitutes: {
          in: 2,
          out: 1,
          bench: 3,
        },
        shots: {
          total: 1,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 0,
          assists: 1,
          saves: null,
        },
        passes: {
          total: 224,
          key: 1,
          accuracy: 41,
        },
        tackles: {
          total: 6,
          blocks: 2,
          interceptions: 10,
        },
        duels: {
          total: 22,
          won: 9,
        },
        dribbles: {
          attempts: null,
          success: null,
          past: null,
        },
        fouls: {
          drawn: null,
          committed: 9,
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
    votes: 0,
  },
  {
    id: 154,
    name: "L. Messi",
    firstname: "Lionel Andrés",
    lastname: "Messi Cuccittini",
    age: 34,
    birth: {
      date: "1987-06-24",
      place: "Rosario",
      country: "Argentina",
    },
    nationality: "Argentina",
    height: "170 cm",
    weight: "72 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/154.png",
    statistics: [
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
        },
        league: {
          id: 140,
          name: "Primera Division",
          country: "Spain",
          logo: "https://media.api-sports.io/football/leagues/140.png",
          flag: "https://media.api-sports.io/flags/es.svg",
          season: 2020,
        },
        games: {
          appearences: 30,
          lineups: 28,
          minutes: 2572,
          number: null,
          position: "Attacker",
          rating: "8.296666",
          captain: false,
        },
        substitutes: {
          in: 2,
          out: 1,
          bench: 2,
        },
        shots: {
          total: 123,
          on: 81,
        },
        goals: {
          total: 25,
          conceded: 0,
          assists: 9,
          saves: null,
        },
        passes: {
          total: 1917,
          key: 70,
          accuracy: 54,
        },
        tackles: {
          total: 15,
          blocks: null,
          interceptions: 5,
        },
        duels: {
          total: 417,
          won: 227,
        },
        dribbles: {
          attempts: 203,
          success: 127,
          past: null,
        },
        fouls: {
          drawn: 77,
          committed: 21,
        },
        cards: {
          yellow: 4,
          yellowred: 0,
          red: 0,
        },
        penalty: {
          won: null,
          commited: null,
          scored: 3,
          missed: 1,
          saved: null,
        },
      },
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
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
          lineups: 6,
          minutes: 540,
          number: null,
          position: "Attacker",
          rating: "8.283333",
          captain: false,
        },
        substitutes: {
          in: 0,
          out: 0,
          bench: 0,
        },
        shots: {
          total: 26,
          on: 20,
        },
        goals: {
          total: 5,
          conceded: 0,
          assists: 2,
          saves: null,
        },
        passes: {
          total: 433,
          key: 23,
          accuracy: 64,
        },
        tackles: {
          total: 5,
          blocks: null,
          interceptions: 2,
        },
        duels: {
          total: 94,
          won: 45,
        },
        dribbles: {
          attempts: 44,
          success: 28,
          past: null,
        },
        fouls: {
          drawn: 12,
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
          scored: 4,
          missed: 1,
          saved: null,
        },
      },
    ],
    votes: 0,
  },
  {
    id: 538,
    name: "F. de Jong",
    firstname: "Frenkie",
    lastname: "de Jong",
    age: 24,
    birth: {
      date: "1997-05-12",
      place: "Arkel",
      country: "Netherlands",
    },
    nationality: "Netherlands",
    height: "180 cm",
    weight: "74 kg",
    injured: false,
    photo: "https://media.api-sports.io/football/players/538.png",
    statistics: [
      {
        team: {
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
        },
        league: {
          id: 140,
          name: "Primera Division",
          country: "Spain",
          logo: "https://media.api-sports.io/football/leagues/140.png",
          flag: "https://media.api-sports.io/flags/es.svg",
          season: 2020,
        },
        games: {
          appearences: 32,
          lineups: 30,
          minutes: 2724,
          number: null,
          position: "Midfielder",
          rating: "7.206250",
          captain: false,
        },
        substitutes: {
          in: 2,
          out: 5,
          bench: 2,
        },
        shots: {
          total: 11,
          on: 5,
        },
        goals: {
          total: 3,
          conceded: 0,
          assists: 4,
          saves: null,
        },
        passes: {
          total: 2453,
          key: 37,
          accuracy: 70,
        },
        tackles: {
          total: 39,
          blocks: 4,
          interceptions: 30,
        },
        duels: {
          total: 254,
          won: 166,
        },
        dribbles: {
          attempts: 61,
          success: 53,
          past: null,
        },
        fouls: {
          drawn: 38,
          committed: 20,
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
          id: 529,
          name: "Barcelona",
          logo: "https://media.api-sports.io/football/teams/529.png",
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
          appearences: 7,
          lineups: 6,
          minutes: 584,
          number: null,
          position: "Midfielder",
          rating: "7.014285",
          captain: false,
        },
        substitutes: {
          in: 1,
          out: 0,
          bench: 1,
        },
        shots: {
          total: null,
          on: null,
        },
        goals: {
          total: 0,
          conceded: 0,
          assists: 1,
          saves: null,
        },
        passes: {
          total: 506,
          key: 4,
          accuracy: 68,
        },
        tackles: {
          total: 8,
          blocks: 1,
          interceptions: 15,
        },
        duels: {
          total: 39,
          won: 26,
        },
        dribbles: {
          attempts: 5,
          success: 4,
          past: null,
        },
        fouls: {
          drawn: 7,
          committed: 1,
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
    votes: 0,
  },
];
