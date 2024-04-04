//init constant value
const MONGODB_URI = 'mongodb://localhost:27017'
const DATABASE_NAME = 'PlantEnthusiast'

import { MongoClient, ServerApiVersion } from 'mongodb'

//thằng instance here
let databaseInstance = null

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  //stable API nè ko có cũng đc
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()//...đợi xíu
  //...gán thằng cái DB cho thằng instance để thằng kia get nó get kìa
  databaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const GET_DB = () => {
  //nếu chưa kêt nối tới Database thì đừng nói chuyện tới tao à...
  if (!databaseInstance) throw new Error('Must connect to Database first!')
  return databaseInstance
}

/**
 * 1. Create constant value as: uri_DB, DB name
 * 2. Create instance variable {dbInstance} (singleton pattern)
 * 3. Import and create connect
 * 4. Create funtion CONNECT (connect success -> ) and export
 * 5. Create funtion GET_DATABASE (check dbInstance) and export
 */
