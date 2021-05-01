import { FootballApiPlayer, Player } from "../types.ts";
import { FootballApiResponse } from "../utils/apifootball/types.ts";
import { bulkUpsert } from "../../../shared/mongoUtils.ts";
import { fetchData } from "../utils/apifootball/apiFootball.ts";

export function fetchPlayers(
  teamId: number,
  page = 1,
): Promise<FootballApiResponse<FootballApiPlayer>> {
  return fetchData<FootballApiPlayer>("players", { team: teamId, page });
}

export function savePlayers(players: Player[]): Promise<void> {
  return bulkUpsert("players", players);
}
