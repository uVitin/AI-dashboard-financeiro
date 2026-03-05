require('dotenv').config()
const http = require('http')
const router = require('./router')

const PORT = process.env.PORT || 3000

const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }
    router(req, res)
})

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})