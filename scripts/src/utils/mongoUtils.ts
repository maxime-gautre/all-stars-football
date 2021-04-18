import { Bson, Collection, MongoClient } from "../../deps.ts";
import { getEnvVariable } from "./envVariable.ts";

export type ObjectId = Bson.ObjectId;
type ExtractId<T> = T extends { id: infer U } // user has defined a type for _id
  ? U
  : ObjectId; // user has not defined _id on schema

type HasId<T> = T & { id: ExtractId<T> };

const config = initMongoConfig();
const client = new MongoClient();

function initMongoConfig() {
  const mongoUser = getEnvVariable("MONGO_USERNAME");
  const mongoPassword = getEnvVariable("MONGO_PASSWORD");
  const mongoHost = getEnvVariable("MONGO_HOST");
  const mongoPort = getEnvVariable("MONGO_PORT");
  const mongoDatabase = getEnvVariable("MONGO_DATABASE");
  const uri =
    `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}?authSource=${mongoDatabase}`;
  return {
    uri,
    mongoDatabase,
  };
}

export async function executeQuery<C, T>(
  collectionName: string,
  query: (collection: Collection<C>) => Promise<T>,
): Promise<T> {
  try {
    await client.connect(config.uri);
    const database = client.database(config.mongoDatabase);
    const collection = database.collection<C>(collectionName);
    return await query(collection);
  } finally {
    await client.close();
  }
}

export function bulkUpsert<T>(
  collectionName: string,
  docs: HasId<T>[],
): Promise<void> {
  // https://github.com/denodrivers/deno_mongo/issues/178
  /*  return executeQuery(
    collectionName,
    async (collection: Collection<BulkWriteUpdateOneOperation<T>>) => {
      const bulkOperations = docs.map((element) => {
        return {
          updateOne: {
            filter: { id: element.id },
            update: { $set: element },
            upsert: true,
          },
        };
      });
      await collection.bulkWrite(bulkOperations);
    },
  );*/
  return executeQuery(
    collectionName,
    async (collection) => {
      for (const doc of docs) {
        await collection.updateOne(
          { id: doc.id },
          doc,
          { upsert: true },
        );
      }
    },
  );
}
