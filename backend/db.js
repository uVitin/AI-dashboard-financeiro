require("dotenv").config()

const { Pool } = require("pg")

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

pool.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao PostgreSQL: ", err.message)
        process.exit(1)
    }
    console.log("PostgreSQL conectado com sucesso!")
})

module.exports = pool