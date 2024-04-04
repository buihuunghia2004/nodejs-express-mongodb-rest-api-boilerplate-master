import { StatusCodes } from 'http-status-codes'
import { productModel } from '~/models/productModel'
import { productService } from '~/services/productService'


//ADD
const addNewProduct = async (req, res, next) => {
  try {
    const addedNewProduct = await productModel.addNewProduct(req.body)

    res.status(StatusCodes.CREATED).json(addedNewProduct)
  } catch (error) {
    next(error)
  }
}
//GET
const getProductsByCategory = async (req, res, next) => {
  try {
    const data = {
      categoryId: req.query.categoryId,
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    }

    console.log(data);

    const gettedProducts = await productModel.getProductsByCategory(data)

    res.status(StatusCodes.OK).json(gettedProducts)
  } catch (error) {
    next(error)
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    const result = await productModel.getAllProducts()

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const search = async (req, res, next) => {
  try {
    const result = await productModel.search(req.query.key)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
//UPDATE
const updateQuantity = async (req, res, next) => {
  try {
    const data = { id: req.params.id, quantity: req.body.quantity }
    console.log(data)
    const updatedQuantity = await productService.updateQuantity(data)

    res.status(StatusCodes.OK).json(updatedQuantity)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body, id: req.params.id }
    const updatedProduct = await productModel.updateProduct(data)

    res.status(StatusCodes.CREATED).json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await productModel.getProductById(id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await productModel.deleteById(id)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getProductByCategoryHomeScreen = async (req, res, next) => {
  try {
    const result = await productModel.getProductByCategoryHomeScreen()

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const productController = {
  addNewProduct,
  getProductsByCategory,
  getAllProducts,
  updateQuantity,
  search,
  //GET
  getProductById,
  //PUT
  updateProduct,
  //DELETE
  deleteById,
  getProductByCategoryHomeScreen
}