

export const getProfile = async () => {
  try {
    const response = await axios.get(`/api/users/`)
    return response.data
  } catch (err) {
    throw err
  }
}
