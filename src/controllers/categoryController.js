import { StatusCodes } from 'http-status-codes'
import { categoryModel } from '~/models/categoryModel'
import { categoryService } from '~/services/categoryService'

const addNew = async (req, res, next) => {
  try {
    const addedNew = await categoryService.addNew(req.body)

    res.status(StatusCodes.CREATED).json(addedNew)
  } catch (error) {
    next(error)
  }
}

const getProductsById = async (req, res, next) => {
  try {
    const result = await categoryModel.getProductsById(req)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  addNew,
  getProductsById
}