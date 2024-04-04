import { userModel } from '~/models/userModel'

const updateInfoUser = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedInfo = await userModel.updateInfo(req)

    return updatedInfo
  } catch (error) {
    throw error
  }
}

export const userService = {
  updateInfoUser
}