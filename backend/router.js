const { register, login } = require("./controllers/authController")

const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require("./controllers/transactionController")

const { aiChat } = require("./controllers/aiController")
const { authenticate } = require("./middlewares/auth")

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = ""
        req.on("data", (chunk) => (body += chunk.toString()))
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {})
            } catch {
                reject(new Error("JSON inválido"))
            }
        })
    })
}

function getIdFromPath(path) {
    const parts = path.split("/")
    return parts[parts.length - 1]
}

async function router(req, res) {
    const { method, url } = req
    const path = url.split("?")[0]

    res.setHeader("Content-Type", "applications/json")

    try {
        // Auth
        if (method === "POST" && path === "/api/auth/register") {
            const body = await parseBody(req)
            return await register(req, res, body)
        }

        if (method === "POST" && path === "/api/auth/login") {
            const body = await parseBody(req)
            return await login(req, res, body)
        }

        if (method === "PUT" && path.startsWith("/api/transactions/")) {
            const body = await parseBody(req)
            req.body = body
            req.params = { id: getIdFromPath(path) }
            return await authenticate(req, res, () => updateTransaction(req, res))
        }

        if (method === "DELETE" && path.startsWith("/api/transactions/")) {
            req.params = { id: getIdFromPath(path) }
            return await authenticate(req, res, () => deleteTransaction(req, res))
        }

        // AI
        if (method === "POST" && path === "/api/ai/chat") {
            const body = await parseBody(req)
            req.body = body
            return await authenticate(req, req, () => aiChat(req, res))
        }

        // 404
        res.writeHead(404)
        res.end(JSON.stringify({ error: "Rota não encontrada" }))
    } catch (err) {
        console.error(err)
        res.writeHead(500)
        res.end(JSON.stringify({ error: "Erro interno do servidor" }))
    }
}

module.exports = router