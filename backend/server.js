const http = require("http");
const router = require("./router");

require("dotenv").config();
const http = require("http");
const router = require("./router");

const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

const server = http.createServer((req, res) => {
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // CORS Headers
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    };

    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});