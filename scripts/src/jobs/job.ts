import { executeQuery } from '../utils/mongoUtils'
import { Collection, ObjectId, WithId } from 'mongodb'
import { Job } from './types'

export async function initJob(): Promise<Job> {
  return executeQuery(
    'jobs',
    async (jobsCollection: Collection<Omit<Job, 'id'>>) => {
      const newJob = {
        startDate: new Date(),
      }
      const doc = await jobsCollection.insertOne(newJob)
      return {
        id: doc.insertedId.toHexString(),
        ...newJob,
      }
    }
  )
}

export async function completeJob(jobId: string): Promise<string> {
  return executeQuery('jobs', (jobsCollection: Collection<Omit<Job, 'id'>>) => {
    return jobsCollection
      .updateOne(
        {
          _id: ObjectId.createFromHexString(jobId),
        },
        {
          $set: {
            teamId: undefined,
            endDate: new Date(),
          },
        }
      )
      .then(() => jobId)
  })
}

export async function updateJobIdWithCurrentTeam(
  jobId: string,
  teamId: number
): Promise<string> {
  return executeQuery('jobs', (jobsCollection) => {
    return jobsCollection
      .updateOne(
        {
          _id: ObjectId.createFromHexString(jobId),
        },
        {
          $set: {
            teamId,
            endDate: new Date(),
          },
        }
      )
      .then(() => jobId)
  })
}

export async function findLastJob(): Promise<Job | undefined> {
  const doc = await executeQuery(
    'jobs',
    (jobsCollection: Collection<WithId<Omit<Job, 'id'>>>) => {
      return jobsCollection.findOne(
        {
          endDate: {
            $exists: true,
          },
        },
        {
          sort: {
            endDate: -1,
          },
        }
      )
    }
  )
  if (doc) {
    const { _id, ...rest } = doc
    return {
      ...rest,
      id: _id.toHexString(),
    }
  }
}
