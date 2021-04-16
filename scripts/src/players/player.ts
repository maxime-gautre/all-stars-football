import { FootballApiPlayer } from './types'
import { FootballApiResponse } from '../utils/apifootball/types'
import { bulkUpsert } from '../utils/mongoUtils'
import { fetchData } from '../utils/apifootball/apiFootball'

export async function fetchPlayers(
  teamId: number,
  page = 1
): Promise<FootballApiResponse<FootballApiPlayer>> {
  return fetchData<FootballApiPlayer>('players', { team: teamId, page })
}

export async function savePlayers(players: FootballApiPlayer[]): Promise<void> {
  const docs = players.map((element) => {
    return {
      ...element.player,
      statistics: element.statistics,
    }
  })
  return bulkUpsert('players', docs)
}
