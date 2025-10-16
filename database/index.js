const { Pool } = require("pg")
require("dotenv").config()

// Force SSL mode in case DATABASE_URL doesn't include ?sslmode=require
process.env.PGSSLMODE = "require"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
})

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if (process.env.NODE_ENV === "development") {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text, error: error.message })
      throw error
    }
  },
}
