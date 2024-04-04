import express from 'express'
import { authController } from '~/controllers/authController'
import { categoryModel } from '~/models/categoryModel'
import { authValidation } from '~/validations/authValidation'


const Router = express.Router()

Router.route('/')
  .get(async (req, res, next) => {
    try {
      const r = await categoryModel.getAllCategories()
      res.status(200).json(r)
    } catch (error) {
      
    }
  })

export const testRoute = Router
