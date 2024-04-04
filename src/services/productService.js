import { productModel } from '~/models/productModel'

const addNewProduct = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const addedNewProduct = await productModel.addNewProduct(reqBody)

    return addedNewProduct
  } catch (error) {
    throw error
  }
}

const getByCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const gettedProducts = await productModel.getByCategory(categoryId)

    // if (gettedProducts.length === 0) throw new Error('not Found')

    return gettedProducts
  } catch (error) {
    throw error
  }
}

const updateQuantity = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const gettedProducts = await productModel.updateQuantity(data)

    // if (gettedProducts.length === 0) throw new Error('not Found')

    return gettedProducts
  } catch (error) {
    throw error
  }
}

export const productService = {
  addNewProduct,
  getByCategory,
  updateQuantity
}