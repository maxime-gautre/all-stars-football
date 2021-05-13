import { executeQuery, ObjectId } from "../../../../shared/mongoUtils.ts";
import { Bson, Collection } from "../../../../deps.ts";
import { Job } from "../../types.ts";

type JobCollection = Omit<Job, "id"> & { _id: ObjectId };

export function initJob(): Promise<Job> {
  return executeQuery(
    "jobs",
    async (jobsCollection: Collection<JobCollection>) => {
      const newJob = {
        startDate: new Date(),
        jobStatus: "RUNNING" as const,
      };
      // The return type of the insertOne method is broken it should Bson.ObjectId
      const doc =
        (await jobsCollection.insertOne(newJob) as unknown) as ObjectId;
      return {
        id: doc.toHexString(),
        ...newJob,
      };
    },
  );
}

export function completeJob(jobId: string): Promise<string> {
  return executeQuery("jobs", (jobsCollection: Collection<JobCollection>) => {
    return jobsCollection
      .updateOne(
        {
          _id: Bson.ObjectId.createFromHexString(jobId),
        },
        {
          $set: {
            teamId: null,
            jobStatus: "COMPLETED",
            endDate: new Date(),
          },
        },
      )
      .then(() => jobId);
  });
}

export function updateJobIdWithCurrentTeam(
  jobId: string,
  teamId: number,
): Promise<string> {
  return executeQuery("jobs", (jobsCollection: Collection<JobCollection>) => {
    const updateDoc: Partial<Job> = {
      teamId,
      jobStatus: "SUSPENDED",
      endDate: new Date(),
    };
    return jobsCollection
      .updateOne(
        {
          _id: Bson.ObjectId.createFromHexString(jobId),
        },
        {
          $set: updateDoc,
        },
      )
      .then(() => jobId);
  });
}

export async function findLastJob(): Promise<Job | undefined> {
  const doc = await executeQuery(
    "jobs",
    (jobsCollection: Collection<JobCollection>) => {
      const findDoc: Partial<Job> = {
        jobStatus: "SUSPENDED",
      };
      return jobsCollection.findOne(
        findDoc,
        {
          sort: {
            endDate: -1,
          },
        },
      );
    },
  );
  if (doc) {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      id: _id.toHexString(),
      teamId: rest.teamId ?? undefined, // transform null to undefined
    };
  }
}
