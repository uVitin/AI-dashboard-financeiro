const http = require("http")
const router = require("./router")

require("dotenv").config()

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204)
        res.end()
        return
    }

    router(req, res)
})

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})