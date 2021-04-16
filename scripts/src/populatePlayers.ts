import { timer } from './utils/time'
import { Job } from './jobs/types'
import { FootballApiTeam } from './teams/types'
import { FootballApiPlayer } from './players/types'
import { FootballApiResponse, RateLimitError } from './utils/apifootball/types'

export type Context = {
  jobApi: {
    initJob: () => Promise<Job>
    findLastJob: () => Promise<Job | undefined>
    updateJobIdWithCurrentTeam: (
      jobId: string,
      teamId: number
    ) => Promise<string>
    completeJob: (jobId: string) => Promise<string>
  }
  teamApi: {
    fetchTeams: () => Promise<FootballApiResponse<FootballApiTeam>>
    saveTeams: (teams: FootballApiTeam[]) => Promise<void>
    getTeamsIds: () => Promise<number[]>
  }
  playerApi: {
    fetchPlayers: (
      teamId: number,
      page: number
    ) => Promise<FootballApiResponse<FootballApiPlayer>>
    savePlayers: (players: FootballApiPlayer[]) => Promise<void>
  }
  options: {
    mode: 'full-refresh' | 'incremental'
    throttle?: number
  }
}

export async function populatePlayers(context: Context): Promise<void> {
  console.debug('Starts populating players...')
  const { jobApi, teamApi, playerApi, options } = context
  console.debug('Mode', options.mode, 'Throttle', options.throttle)
  const job = await getJob(options, jobApi)
  console.debug('Job', job)
  const teamsIdsToProcess = await teamsToProcess(options, teamApi, job)
  console.debug('Teams to process: ', teamsIdsToProcess.length)

  for (const teamId of teamsIdsToProcess) {
    console.debug(`Processing team ${teamId}...`)
    try {
      await fetchPlayersRec(playerApi, teamId)
    } catch (err) {
      console.error('Error when fetching team', teamId, err)
      if (err instanceof RateLimitError) {
        await jobApi.updateJobIdWithCurrentTeam(job.id, teamId)
      }
      throw err
    }
    console.debug(`Processing team ${teamId}... OK`)
    if (options.throttle) {
      await timer(options.throttle * 1000)
    }
  }
  await jobApi.completeJob(job.id)
  console.debug('Populate players completed')
}

async function fetchPlayersRec(
  playerApi: Context['playerApi'],
  teamId: number,
  page = 1
) {
  const players = await playerApi.fetchPlayers(teamId, page)
  await playerApi.savePlayers(players.response)
  if (players.paging.current !== players.paging.total) {
    await fetchPlayersRec(playerApi, teamId, players.paging.current + 1)
  }
}

async function getJob(
  options: Context['options'],
  jobApi: Context['jobApi']
): Promise<Job> {
  if (options.mode === 'full-refresh') {
    return jobApi.initJob()
  } else {
    const job = await jobApi.findLastJob()
    if (!job) {
      return jobApi.initJob()
    }
    return job
  }
}

async function teamsToProcess(
  options: Context['options'],
  teamApi: Context['teamApi'],
  job: Job
) {
  const teamsIds = await teamApi.getTeamsIds()
  if (options.mode === 'full-refresh' || teamsIds.length === 0) {
    console.debug('Fetching teams...')
    const teams = await teamApi.fetchTeams()
    console.debug('Fetching teams... OK, results: ', teams.results)
    await teamApi.saveTeams(teams.response)
    return teams.response.map((_) => _.team.id)
  } else {
    const nextTeamId = job.teamId
    if (!nextTeamId) {
      return teamsIds
    } else {
      const nextTeamPosition = teamsIds.indexOf(nextTeamId)
      return nextTeamPosition === -1
        ? teamsIds
        : teamsIds.slice(nextTeamPosition)
    }
  }
}
