import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { PROP, size } from '~/utils/constants'
import { ARRAY_OBJECT, BOOLEAN, CATEGORY_NAME, NUMBER, QUANTITY, SIZE, STRING, URL } from '~/utils/validatorConstant'

//categoryModel
import { categoryModel } from './categoryModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { APIs_V1 } from '~/routes/v1'

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  category: CATEGORY_NAME.required(),
  name: STRING.required(),
  price: NUMBER.required(),
  quantity: QUANTITY.required(),
  linkImages: ARRAY_OBJECT(URL).required(),
  size: SIZE.required(),
  prop: PROP,
  madein: STRING.default('No Origin'),
  _destroy: BOOLEAN.default(false)
})

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
//POST
const addNewProduct = async (data) => {
  try {
    const { categoryId, name, price, quantity, linkImages, prop, size, madein } = data

    //check exist
    const productExist = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .findOne({ name: name })

    if (productExist) {
      throw new ApiError(StatusCodes.CONFLICT, 'Product is exits')
    }

    //check categoryId
    const projectCategory = { name: 1 }
    const category = await categoryModel.getCategoryById(categoryId, projectCategory)
    console.log(category, '---------------');

    const newProduct = {
      name, price, quantity, linkImages, category: category.name, size
    }

    if (prop) {
      newProduct.prop = prop
    }
    if (madein) {
      newProduct.madein = madein
    }

    const validProduct = await validateBeforeCreate(newProduct)

    const addedProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validProduct)

    //add product to category
    setTimeout(async () => {
      const data = {
        categoryId: categoryId,
        productId: addedProduct.insertedId
      }
      await categoryModel.pushItemProductCategory(data)
    }, 0);

    if (!addedProduct.acknowledged) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Adding data failed')
    }

    return {
      status: true,
      data: validProduct
    }
  } catch (error) {
    throw error
  }
}

const getProductsByCategory = async (data) => {
  try {
    const { categoryId, page, limit } = data

    //find category
    const category = await categoryModel.getCategoryById(categoryId, { name: 1 })

    //find products
    const skip = (page - 1) * limit
    const gettedProducts = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .find({ category: category.name })
      .skip(skip)
      .limit(limit)

    const products = await gettedProducts.toArray()
      .then((products) => {
        return products
      })
      .catch((err) => { throw new Error(err) })

    const item = { category: category.name, products }

    return item
  } catch (error) {
    throw error
  }
}

//Customer
const getProductByCategoryHomeScreen = async () => {
  try {
    const categories = await categoryModel.getAllCategories()

    const promises = categories.map(async element => {
      const query = { categoryId: element._id, page: 1, limit: 6 }
      return await getProductsByCategory(query)
    })

    const result = await Promise.all(promises)

    return result
  } catch (error) {
    throw error
  }
}

//PUT
const updateQuantity = async (data) => {
  try {
    const gettedProducts = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(data.id) },
      { $inc: { 'quantity': data.quantity } },
      { returnDocument: 'after' }
    )

    return gettedProducts
  } catch (error) {
    throw new Error(error)
  }
}
const updateProduct = async (data) => {
  try {
    const { id, categoryId, name, price, quantity, linkImages, prop, size, madein } = data

    const newData = {}

    if (categoryId) {
      //check categoryId
      const projectCategory = { name: 1 }
      const category = await categoryModel.getCategoryById(categoryId, projectCategory)

      newData.category = category.name
    }

    if (name) {
      newData.name = name
    }
    if (price) {
      newData.price = price
    }
    if (quantity) {
      newData.quantity = quantity
    }
    if (linkImages) {
      newData.linkImages = linkImages
    }
    if (prop) {
      newData.prop = prop
    }
    if (size) {
      newData.size = size
    }
    if (madein) {
      newData.madein = madein
    }
    newData.updateAt = new Date()

    const updatedProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: newData },
      )

    if (!updatedProduct) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Updating data failed')
    }

    //update product to category
    setTimeout(async () => {
      if (newData.category !== updatedProduct.category) {
        console.log(newData.category, updatedProduct.category);
        //delete product from old category  categoryId, productId, categoryName
        await categoryModel.pullItemProductCategory({ categoryName: updatedProduct.category, productId: id })
        //insert new product to new category
        await categoryModel.pushItemProductCategory({ categoryId: categoryId, productId: id })
      } else {
        console.log('The the category');
        //update category
        await categoryModel.replaceItemProductCategory({ categoryName: updatedProduct.category, productId: id })
      }
    }, 0);

    return {
      status: true,
      data: updatedProduct
    }
  } catch (error) {
    throw error
  }
}
//GET
const search = async (key) => {
  try {
    const query = { name: { $regex: new RegExp(key, 'i') } }
    const products = await GET_DB().collection(PRODUCT_COLLECTION_NAME).find(query)
      .project({
        _id: 1,
        name: 1,
        price: 1,
        linkImages: 1
      })
      .limit(5)

    const result = products.toArray()
      .then((products) => {
        return products
      })
      .catch((err) => { throw new Error(err) })

    console.log(result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAllProducts = async () => {
  try {
    const products = await GET_DB().collection(PRODUCT_COLLECTION_NAME).find()

    const result = products.toArray()
      .then((products) => {
        return products
      })
      .catch((err) => { throw new Error(err) })

    console.log(result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getProductById = async (id) => {
  try {
    const product = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

    if (!product) {
      throw new ApiError(404, 'Not found product')
    }

    return product
  } catch (error) {
    throw error
  }
}

//DELETE
const deleteById = async (id) => {
  try {
    const productDeleted = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })

    console.log(productDeleted);
    if (productDeleted.deletedCount > 0) {
      return {
        status: true,
        data: productDeleted
      }
    }

    return { status: false }
  } catch (error) {
    throw new Error(error)
  }
}

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  //POST
  addNewProduct,
  //GET
  getProductsByCategory,
  getProductById,
  getAllProducts,
  updateQuantity,
  search,
  //PUT
  updateProduct,
  //DELETE
  deleteById,
  getProductByCategoryHomeScreen
}