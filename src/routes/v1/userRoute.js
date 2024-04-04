import express from 'express'
import { orderController } from '~/controllers/orderController'
import { userController } from '~/controllers/userController'
import { orderValidation } from '~/validations/orderValidation'

import { userValidation } from '~/validations/userValidation'


const Router = express.Router()

//http://localhost:8017/v1/user

// Router.route('/')
//   .put()
Router.route('/veryfi-email')
  .get(userController.veryfiEmail)

Router.route('/:id')
  .get(userController.getInfoById)
  //Update info 
  .put(userValidation.updateInfo, userController.updateInfoUser)

Router.route('/:id/cart')
  .put(userValidation.updateCart, userController.updateCart)

Router.route('/:id/order')
  .post(orderValidation.createNewOrder,orderController.createNewOrder)

export const userRoute = Router