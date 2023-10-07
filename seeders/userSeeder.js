const db = require('../config/mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const faker = require('faker')

const SEED_USER = Array.from(
  { length: 5 },
  async (_, i) => {

    const hashPassword = await bcrypt.hash('12345678', 10)

    return {
      account: `user${i}`,
      name: faker.name.findName(),
      email: `user${i}@example.com`,
      password: hashPassword,
      avatar: `https://loremflickr.com/320/240/avatar,person/?random=${Math.random() * 100}`,
      introduction: faker.lorem.sentences(),
      status: '',
      isAdmin: 0,
      createAt: new Date(),
      updateAt: new Date()
    }
  })

async function seedUsers() {
  try {
    // 這里使用 await 等待 SEED_USER array填充完成
    const seededUsers = await Promise.all(SEED_USER)

    await User.insertMany(seededUsers)

    await db.close()

  } catch(error) {

    console.error('Error from seeding users:', error)

    await db.close()
  }
}

seedUsers()

