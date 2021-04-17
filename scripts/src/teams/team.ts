import { Collection } from "../../deps.ts";
import { bulkUpsert, executeQuery } from "../utils/mongoUtils.ts";
import { FootballApiTeam, Team, Venue } from "./types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";
import { fetchData } from "../utils/apifootball/apiFootball.ts";

type TeamCollectionPayload = Team & {
  venue: Venue;
};

export function fetchTeams(): Promise<
  FootballApiResponse<FootballApiTeam>
> {
  const championsLeagueId = 2;
  return fetchData<FootballApiTeam>("teams", { league: championsLeagueId });
}

export function getTeamsIds(): Promise<number[]> {
  return executeQuery(
    "teams",
    async (collection: Collection<TeamCollectionPayload>) => {
      const teams = await collection
        .find({}, { projection: { id: 1, _id: 0 }, sort: { id: 1 } })
        .toArray();
      return teams.map((_) => _.id);
    },
  );
}

export function saveTeams(teams: FootballApiTeam[]): Promise<void> {
  const docs = teams.map((element) => {
    return {
      ...element.team,
      venue: element.venue,
    };
  });
  return bulkUpsert("teams", docs);
}
