import { StatusCodes } from 'http-status-codes'
import Joi, { date } from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import { ARRAY_OBJECT, CATEGORY_NAME, ID } from '~/utils/validatorConstant'
import { productModel } from './productModel'

const CATEGORY_COLLECTION_NAME = 'categories'
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: CATEGORY_NAME,
  productsId: ARRAY_OBJECT(ID)
})

const validDataBeforeHandle = async (data) => {
  return await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//GET
const getProductsById = async (req) => {
  const { page, limit, _id, name, price, quantity, size, madein, linkImages, category, props } = req.query
  const { id } = req.params
  const skip = (page - 1) * limit

  try {
    const result = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $project: {
            products: {
              $slice: ['$products', skip, Number(limit)]
            }
          }
        },
        {
          $project: {
            'products._id': Number(_id) || '$$REMOVE',
            'products.name': Number(name) || '$$REMOVE',
            'products.price': Number(price) || '$$REMOVE',
            'products.quantity': Number(quantity) || '$$REMOVE',
            'products.size': Number(size) || '$$REMOVE',
            'products.madein': Number(madein) || '$$REMOVE',
            'products.linkImages': Number(linkImages) || '$$REMOVE',
            'products.category': Number(category) || '$$REMOVE',
            'products.props': Number(props) || '$$REMOVE'
          }
        }
      ]).toArray()

    return result[0].products || {}
  } catch (error) {
    throw new Error(error)
  }
}
const getCategoryById = async (id, projection) => {
  try {
    const category = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(id) },
        { projection: projection }
      )

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found category by id')
    }

    return category
  } catch (error) {
    throw error
  }
}
const getAllCategories = async () => {
  const projection = { name: 1 }
  try {
    const categories = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .find({},
        { projection })

    const result = categories.toArray()
      .then((categories) => {
        return categories
      })
      .catch((err) => { throw new ApiError(499, 'Get categories fail') })

    return result
  } catch (error) {
    throw error
  }
}

//POST
const addNew = async (data) => {
  try {
    const validData = await validDataBeforeHandle(data)

    const newCategory = await GET_DB().collection(CATEGORY_COLLECTION_NAME).insertOne(validData)

    return newCategory
  } catch (error) {
    throw new Error(error)
  }
}

//ITEM_PRODUCT
const pullItemProductCategory = async (data) => {
  try {
    const { categoryId, productId, categoryName } = data
    console.log(categoryId, productId, categoryName);
    const pulled = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        categoryId ? { _id: new ObjectId(categoryId) } : { name: categoryName },
        { $pull: { products: { _id: new ObjectId(productId) } } }
      )

    if (!pulled) {
      throw new ApiError(442, 'Pull item product fail')
    }

    return pulled
  } catch (error) {
    throw error
  }
}
const pushItemProductCategory = async (data) => {
  try {
    const { categoryId, productId, categoryName } = data

    //check product Exist
    const product = await productModel.getProductById(productId)
    console.log(product, 'product)_)))))))');

    const pushed = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        categoryId ? { _id: new ObjectId(categoryId) } : { name: categoryName },
        { $push: { products: product } }
      )

    console.log(pushed, '____________');
    if (!pushed) {
      throw new ApiError(442, 'Push item product fail')
    }

    return pushed
  } catch (error) {
    throw error
  }
}
const replaceItemProductCategory = async (data) => {
  try {
    const { categoryId, productId, categoryName } = data

    const newItem = await productModel.getProductById(productId)

    const replaced = await GET_DB().collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        categoryName ?
          { name: categoryName, 'products._id': new ObjectId(productId) } :
          { _id: new ObjectId(categoryId), 'products._id': new ObjectId(productId) },
        { $set: { 'products.$': newItem } }
      )

    if (!replaced) {
      throw new ApiError(442, 'Replace item product fail')
    }
  } catch (error) {
    throw error
  }
}

export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  addNew,
  getProductsById,
  getCategoryById,
  getAllCategories,

  //ItemProduct
  pullItemProductCategory,
  pushItemProductCategory,
  replaceItemProductCategory
}
