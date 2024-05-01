export const getProfile = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}`)
    return response.data
  } catch (err) {
    throw err
  }
}
