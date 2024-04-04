/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, GET_DB } from './config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import morgan from 'morgan'

//funtion start server
const START_SERVER = () => {
  const app = express()

  const port = 7272

  // app.get('/', async (req, res) => {
  //   //không đơn thuần là log ra đâu nha, nó getDatabase đó
  //   console.log(await GET_DB().listCollections().toArray())
  //   // res.end('<h1>Hello World!</h1><hr>')
  // })

  //....
  app.use(cors())
  app.use(morgan())
  app.use(express.json())

  //use API_V1
  app.use('/v1', APIs_V1)

  //Middleware handle error tập trung
  app.use(errorHandlingMiddleware)

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Aloooo nghe nèeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`)
  })
}

//handle connect database -> start server BE
(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
//cặp () thứ 2 để thực thi luôn anonymous fution đỉnh quá anh em ơi
//Immeiately-invoked / Anonymous Async Funtions (IIFE)
