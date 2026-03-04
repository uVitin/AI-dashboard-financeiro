const { verify } = require("../utils/jwt")

async function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"]

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401)
        res.end(JSON.stringify({ error: "Token não fornecido" }))
        return
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = verify(token)
        req.user = payload
        await next()
    } catch (err) {
        res.writeHead(401)
        res.end(JSON.stringify({ error: err.message }))
    }
}

module.exports = { authenticate }