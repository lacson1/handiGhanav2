import { authApi } from '../lib/api'

export const userService = {
  async getProfile() {
    try {
      const data = await authApi.getProfile()
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user profile')
    }
  },

  async updateProfile(data: { name?: string; phone?: string; avatar?: string }) {
    try {
      const updated = await authApi.updateProfile(data)
      return updated
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user profile')
    }
  },
}

