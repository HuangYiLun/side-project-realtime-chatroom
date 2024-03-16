const helpers = require('../helpers/auth-helper')
const User = require('../models/user')


const apiController = {
  getUserAccount: async (req, res, next) => {
    const { userId } = req.params
    const loginUser = helpers.getUser(req)

    try {
      const user = await User.findById(userId).lean()
    
      if (!user) throw new Error('帳號不存在')

      if (loginUser._id.toString() !== userId) {
        return res.json({ status: 'error', messages: '非本人不能操做' })
      }

      return res.json({ status: 'success', ...user })

    } catch (err) {
      next(err)
    }

  }

}

module.exports = apiController