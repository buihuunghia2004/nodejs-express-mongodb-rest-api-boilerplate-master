import express from 'express'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

//http://localhost:8017/v1/order

Router.route('/')
  .get(orderController.getOrdersByStatus)
  .put(orderController.updateStatus)
    

export const orderRoute = Router