import express from 'express'
import { authController } from '~/controllers/authController'
import { authValidation } from '~/validations/authValidation'

const Router = express.Router()

Router.route('/login')
  //login
  .post(authValidation.login, authController.login)

Router.route('/register')
  //register
  .post(authValidation.register, authController.register)

export const authRoute = Router
