import { MongoClient, Collection, BulkWriteUpdateOneOperation } from 'mongodb'
import { getEnvVariable } from './envVariable'

const config = initMongoConfig()

function initMongoConfig() {
  const mongoUser = getEnvVariable('MONGO_USERNAME')
  const mongoPassword = getEnvVariable('MONGO_PASSWORD')
  const mongoHost = getEnvVariable('MONGO_HOST')
  const mongoPort = getEnvVariable('MONGO_PORT')
  const mongoDatabase = getEnvVariable('MONGO_DATABASE')

  return {
    mongoUser,
    mongoPassword,
    mongoHost,
    mongoPort,
    mongoDatabase,
  }
}

function mongoClient() {
  const uri = `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}?authSource=${config.mongoDatabase}`
  return new MongoClient(uri, { useUnifiedTopology: true })
}

export async function executeQuery<T>(
  collectionName: string,
  query: (collection: Collection) => Promise<T>
): Promise<T> {
  const client = mongoClient()
  try {
    await client.connect()
    const database = client.db(config.mongoDatabase)
    const collection = database.collection(collectionName)
    return await query(collection)
  } finally {
    await client.close()
  }
}

type ExtractId<T> = T extends { id: infer U } // user has defined a type for _id
  ? U
  : string // user has not defined _id on schema

type HasId<T> = T & { id: ExtractId<T> }

export async function bulkUpsert<T>(
  collectionName: string,
  docs: HasId<T>[]
): Promise<void> {
  return executeQuery(
    collectionName,
    async (collection: Collection<BulkWriteUpdateOneOperation<T>>) => {
      const bulkOperations = docs.map((element) => {
        return {
          updateOne: {
            filter: { id: element.id },
            update: { $set: element },
            upsert: true,
          },
        }
      })
      await collection.bulkWrite(bulkOperations)
    }
  )
}
