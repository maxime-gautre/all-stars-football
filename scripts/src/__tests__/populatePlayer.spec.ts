import * as faker from 'faker'
import { Context, populatePlayers } from '../populatePlayers'
import {
  InMemoryJobStore,
  InMemoryPlayerStore,
  InMemoryTeamsStore,
  englishTeams,
  cityPlayers,
  manUtdPlayers,
  fakeFetchPlayers,
} from './stubs'
import { FootballApiTeam } from '../teams/types'
import { FootballApiResponse, RateLimitError } from '../utils/apifootball/types'
import { Job } from '../jobs/types'
import { FootballApiPlayer } from '../players/types'

function initTestDeps(
  teams: FootballApiResponse<FootballApiTeam> = englishTeams,
  initialStoredTeams: FootballApiTeam[] = [],
  initialJobs: Job[] = [],
  props: Partial<Context> = {},
  fetchPlayers: (
    teamId: number,
    page: number
  ) => Promise<FootballApiResponse<FootballApiPlayer>> = fakeFetchPlayers
) {
  const jobStore = new InMemoryJobStore(initialJobs)
  const teamStore = new InMemoryTeamsStore(initialStoredTeams)
  const playerStore = new InMemoryPlayerStore()

  return {
    context: {
      jobApi: {
        initJob: () => jobStore.initJob(),
        findLastJob: () => jobStore.findLastJob(),
        updateJobIdWithCurrentTeam: (jobId: string, teamId: number) =>
          jobStore.updateJobIdWithCurrentTeam(jobId, teamId),
        completeJob: (jobId: string) => jobStore.completeJob(jobId),
      },
      teamApi: {
        fetchTeams: () => Promise.resolve(teams),
        saveTeams: (teams: FootballApiTeam[]) => teamStore.saveTeams(teams),
        getTeamsIds: () => teamStore.getTeamsIds(),
      },
      playerApi: {
        fetchPlayers,
        savePlayers: (players: FootballApiPlayer[]) =>
          playerStore.savePlayers(players),
      },
      options: {
        mode: 'full-refresh' as const,
      },
      ...props,
    },
    deps: {
      jobStore,
      teamStore,
      playerStore,
    },
  }
}

describe('Populate player', () => {
  it('should fetch teams and fetch players for each team', async () => {
    const { context, deps } = initTestDeps(englishTeams)
    await populatePlayers(context)

    const teamsIds = await deps.teamStore.getTeamsIds()
    const players = deps.playerStore.listPlayers()
    expect(teamsIds.length).toEqual(englishTeams.response.length)
    expect(players.length).toEqual(cityPlayers.results + manUtdPlayers.results)
  })

  it('should save the current team processed if a rate limit error is raised', async () => {
    const fetchPlayers = () =>
      Promise.reject(new RateLimitError('Rate limit reached'))
    const { context, deps } = initTestDeps(
      englishTeams,
      [],
      [],
      {},
      fetchPlayers
    )
    const promiseResponse = populatePlayers(context)

    await expect(promiseResponse).rejects.toThrowError(RateLimitError)
    const job = await deps.jobStore.findLastJob()
    expect(job?.teamId).toEqual(englishTeams.response[0].team.id)
  })

  it('should not save the current team processed if other error occur', async () => {
    const fetchPlayers = () => Promise.reject(new Error('Boom'))
    const { context, deps } = initTestDeps(
      englishTeams,
      [],
      [],
      {},
      fetchPlayers
    )
    const promiseResponse = populatePlayers(context)

    await expect(promiseResponse).rejects.toThrowError()
    const job = await deps.jobStore.findLastJob()
    expect(job?.teamId).toEqual(undefined)
  })

  it('should handle paginated results', async () => {
    const cityTeam = englishTeams.response[3]
    const cityTeamId = cityTeam.team.id
    const fetchPlayers = (
      teamId: number,
      page: number
    ): Promise<FootballApiResponse<FootballApiPlayer>> => {
      let response: FootballApiPlayer[] = []
      if (teamId === cityTeamId) {
        if (page === 1) {
          response = cityPlayers.response.slice(0, 2)
        } else {
          response = cityPlayers.response.slice(2)
        }
      }
      return Promise.resolve({
        errors: [],
        results: 0,
        paging: {
          current: page,
          total: 2,
        },
        response,
      })
    }
    const { context, deps } = initTestDeps(
      englishTeams,
      [],
      [],
      {},
      fetchPlayers
    )
    await populatePlayers(context)

    const players = deps.playerStore.listPlayers()
    expect(players).toEqual(cityPlayers.response)
  })

  describe('In full-refresh mode', () => {
    it('should always fetch teams even if there are existing teams in the store and upsert them', async () => {
      const currentTeamsStored = [...englishTeams.response.slice(0, 2)]
      const teamsToFetch = {
        ...englishTeams,
        response: englishTeams.response.slice(2),
      }
      const { context, deps } = initTestDeps(teamsToFetch, currentTeamsStored)
      await populatePlayers(context)

      const teamsIds = await deps.teamStore.getTeamsIds()
      expect(teamsIds.length).toEqual(
        currentTeamsStored.length + teamsToFetch.response.length
      )
    })
  })

  describe('In incremental mode', () => {
    it('should get teams from the store and process only teams that have not yet been processed', async () => {
      const manUtdTeam = englishTeams.response[0]
      const liverpoolTeam = englishTeams.response[1]
      const chelseaTeam = englishTeams.response[2]
      const cityTeam = englishTeams.response[3]
      const lastTeamProcessed = chelseaTeam.team.id

      const currentJobsStore = [
        {
          id: faker.datatype.uuid(),
          startDate: new Date(),
          teamId: lastTeamProcessed,
        },
      ]
      const currentTeamsStored = [
        manUtdTeam,
        liverpoolTeam,
        chelseaTeam,
        cityTeam,
      ]
      const teamsToFetch = {
        ...englishTeams,
        response: [manUtdTeam, liverpoolTeam],
      }
      const { context, deps } = initTestDeps(
        teamsToFetch,
        currentTeamsStored,
        currentJobsStore,
        {
          options: {
            mode: 'incremental' as const,
          },
        }
      )
      await populatePlayers(context)

      const teamsIds = await deps.teamStore.getTeamsIds()
      const players = deps.playerStore.listPlayers()
      expect(teamsIds).toEqual([
        manUtdTeam.team.id,
        liverpoolTeam.team.id,
        chelseaTeam.team.id,
        cityTeam.team.id,
      ])
      expect(players).toEqual([...cityPlayers.response])
    })

    it('should get teams from the store and process all teams if no team have been processed before', async () => {
      const manUtdTeam = englishTeams.response[0]
      const liverpoolTeam = englishTeams.response[1]
      const chelseaTeam = englishTeams.response[2]
      const lastTeamProcessed = undefined

      const currentJobsStore = [
        {
          id: faker.datatype.uuid(),
          startDate: new Date(),
          teamId: lastTeamProcessed,
        },
      ]
      const currentTeamsStored = [manUtdTeam, liverpoolTeam]
      const teamsToFetch = {
        ...englishTeams,
        response: [chelseaTeam, liverpoolTeam],
      }
      const { context, deps } = initTestDeps(
        teamsToFetch,
        currentTeamsStored,
        currentJobsStore,
        {
          options: {
            mode: 'incremental' as const,
          },
        }
      )
      await populatePlayers(context)

      const teamsIds = await deps.teamStore.getTeamsIds()
      const players = deps.playerStore.listPlayers()
      expect(teamsIds).toEqual([manUtdTeam.team.id, liverpoolTeam.team.id])
      expect(players).toEqual([...manUtdPlayers.response])
    })

    it('should init a new job if no full-refresh mode has been initiated before', async () => {
      const currentJobsStore: Job[] = []

      const { context, deps } = initTestDeps(
        englishTeams,
        [],
        currentJobsStore,
        {
          options: {
            mode: 'incremental' as const,
          },
        }
      )
      await populatePlayers(context)
      const teamsIds = await deps.teamStore.getTeamsIds()
      const job = await deps.jobStore.findLastJob()
      expect(job).toBeDefined()
      expect(teamsIds).toEqual(englishTeams.response.map(_ => _.team.id))
    })
  })
})
