import { FootballApiPlayer } from "./types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";
import { bulkUpsert } from "../../../shared/mongoUtils.ts";
import { fetchData } from "../utils/apifootball/apiFootball.ts";

export function fetchPlayers(
  teamId: number,
  page = 1,
): Promise<FootballApiResponse<FootballApiPlayer>> {
  return fetchData<FootballApiPlayer>("players", { team: teamId, page });
}

export function savePlayers(players: FootballApiPlayer[]): Promise<void> {
  const docs = players.map((element) => {
    return {
      ...element.player,
      statistics: element.statistics,
    };
  });
  return bulkUpsert("players", docs);
}
