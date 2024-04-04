import express from 'express'
import { authRoute } from './authRoute'
import { userRoute } from './userRoute'
import { productRoute } from './productRoute'
import { categoryRoute } from './categoryRoute'
import { orderRoute } from './orderRoute'
import { testRoute } from './testRoute'


const Router = express.Router()

//http://localhost:8017/v1/auth
Router.use('/auth', authRoute)

//http://localhost:8017/v1/user
Router.use('/user', userRoute)

//http://localhost:8017/v1/product
Router.use('/product', productRoute)

//http://localhost:8017/v1/category
Router.use('/category', categoryRoute)


//http://localhost:8017/v1/category
Router.use('/order', orderRoute)

//http://localhost:8017/v1/category
Router.use('/test', testRoute)

export const APIs_V1 = Router