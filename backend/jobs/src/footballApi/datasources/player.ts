import { FootballApiPlayer, Season } from "../../types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";
import { bulkUpsert } from "../../../../shared/mongoUtils.ts";
import { fetchData } from "../utils/apifootball/apiFootball.ts";

export function fetchPlayers(
  season: Season,
  teamId: number,
  page = 1,
): Promise<FootballApiResponse<FootballApiPlayer>> {
  return fetchData<FootballApiPlayer>("players", {
    season,
    team: teamId,
    page,
  });
}

export function saveFootballApiPlayers(
  season: Season,
  players: FootballApiPlayer[],
): Promise<void> {
  const docs = players.map((element) => {
    return {
      id: element.player.id,
      ...element,
    };
  });
  return bulkUpsert(`players_football_api_${season}`, docs);
}
