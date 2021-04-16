import { populatePlayers, Context } from './populatePlayers'
import { savePlayers, fetchPlayers } from './players/player'
import {
  initJob,
  updateJobIdWithCurrentTeam,
  findLastJob,
  completeJob,
} from './jobs/job'
import { fetchTeams, getTeamsIds, saveTeams } from './teams/team'

const context: Context = {
  jobApi: {
    initJob,
    findLastJob,
    updateJobIdWithCurrentTeam,
    completeJob,
  },
  teamApi: {
    fetchTeams,
    saveTeams,
    getTeamsIds,
  },
  playerApi: {
    fetchPlayers,
    savePlayers,
  },
  options: {
    mode: 'incremental',
    throttle: 20,
  },
}

void populatePlayers(context)
