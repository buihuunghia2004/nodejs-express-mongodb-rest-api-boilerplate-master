import express from 'express'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'
const Router = express.Router()

//http://localhost:7272/v1/product


Router.route('/')
  //ADD PRODUCT
  .post(productValidation.addNewProduct, productController.addNewProduct)
  //getMany
  .get(productController.getAllProducts)

Router.route('/search')
  .get(productController.search)

Router.route('/category')
  .get(productValidation.getProductsByCategory, productController.getProductsByCategory)

Router.route('/customer')
  .get(productController.getProductByCategoryHomeScreen)

Router.route('/:id')
  //GET PRODUCT BY ID
  .get(productController.getProductById)
  //delete
  .post()
  //update
  .put(productValidation.updateProduct, productController.updateProduct)
  //DeleteByid
  .delete(productController.deleteById)


Router.route('/:id/quantity')
  //updateOne
  .put(productValidation.updateQuantity, productController.updateQuantity)

export const productRoute = Router