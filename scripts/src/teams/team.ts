import { executeQuery, bulkUpsert } from '../utils/mongoUtils'
import { Collection } from 'mongodb'
import { Team, Venue, FootballApiTeam } from './types'
import { FootballApiResponse } from '../utils/apifootball/types'
import { fetchData } from '../utils/apifootball/apiFootball'

type TeamCollectionPayload = Team & {
  venue: Venue
}

export async function fetchTeams(): Promise<
  FootballApiResponse<FootballApiTeam>
> {
  const championsLeagueId = 2
  return fetchData<FootballApiTeam>('teams', { league: championsLeagueId })
}

export async function getTeamsIds(): Promise<number[]> {
  return executeQuery(
    'teams',
    async (collection: Collection<TeamCollectionPayload>) => {
      const teams = await collection
        .find({}, { projection: { id: 1, _id: 0 }, sort: { id: 1 } })
        .toArray()
      return teams.map((_) => _.id)
    }
  )
}

export async function saveTeams(teams: FootballApiTeam[]): Promise<void> {
  const docs = teams.map((element) => {
    return {
      ...element.team,
      venue: element.venue,
    }
  })
  return bulkUpsert('teams', docs)
}
