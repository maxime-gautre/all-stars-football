import { Collection } from "../../../../deps.ts";
import { bulkUpsert, executeQuery } from "../../../../shared/mongoUtils.ts";
import { FootballApiTeam, Season, Team, Venue } from "../../types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";
import { fetchData } from "../utils/apifootball/apiFootball.ts";

type TeamCollectionPayload = Team & {
  venue: Venue;
};

export function fetchTeams(season: number): Promise<
  FootballApiResponse<FootballApiTeam>
> {
  const championsLeagueId = 2;
  return fetchData<FootballApiTeam>("teams", {
    league: championsLeagueId,
    season,
  });
}

export function getTeamsIds(season: Season): Promise<number[]> {
  return executeQuery(
    teamCollection(season),
    async (collection: Collection<TeamCollectionPayload>) => {
      const teams = await collection
        .find({}, { projection: { id: 1, _id: 0 }, sort: { id: 1 } })
        .toArray();
      return teams.map((_) => _.id);
    },
  );
}

export function saveTeams(
  season: Season,
  teams: FootballApiTeam[],
): Promise<void> {
  const docs = teams.map((element) => {
    return {
      ...element.team,
      venue: element.venue,
    };
  });
  return bulkUpsert(teamCollection(season), docs);
}

function teamCollection(season: Season) {
  return `teams_${season}`;
}
