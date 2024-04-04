import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { categoryValidation } from '~/validations/categoryValidation'
const Router = express.Router()

Router.route('/')
  .post(categoryValidation.addNew, categoryController.addNew)

Router.route('/:id')
  .get(categoryController.getProductsById)

export const categoryRoute = Router