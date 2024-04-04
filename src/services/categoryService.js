import { categoryModel } from '~/models/categoryModel'

const addNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const addedNew = await categoryModel.addNew(reqBody)

    return addedNew
  } catch (error) {
    throw error
  }
}

export const categoryService = {
  addNew
}