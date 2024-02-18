const db = require('../config/mongoose')
const Chatroom = require('../models/chatroom')

const SEED_CHATROOM = [
  {name: 'General', isPublic: true},
  {name: 'Dating', isPublic: true},
  {name: 'Single', isPublic: true},
  {name: 'Music', isPublic: true},
  {name: 'Sport', isPublic: true},
]

async function seedChatrooms() {
  try {

    await Chatroom.insertMany(SEED_CHATROOM)

    await db.close()

  } catch (error) {

    console.error('Error from seeding chatrooms:', error)

    await db.close()
  }
}

seedChatrooms()