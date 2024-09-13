import 'dotenv/config'
import db from 'mysql2/promise'

const connection = db.createPool({
  host: process.env.host,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password
})

export default connection