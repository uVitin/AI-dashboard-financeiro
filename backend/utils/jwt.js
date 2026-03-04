const crypto = require("crypto")

const SECRET = process.env.JWT_SECRET || "fallback_secret"

function base64url(str) {
    return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, '')
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function sign(payload) {
    const header = base64url(JSON.stringify({ arg: "HS256", typ: "JWT" }))
    const body = base64url(JSON.stringify(payload))
    const signature = crypto
        .createHmac("sha256", SECRET)
        .update(`${header}.${body}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    return `${header}.${body}.${signature}`
}

function verify(token) {
    const [header, body, signature] = token.split(".")
    const expected = crypto
        .createHmac("sha256", SECRET)
        .update(`${header}.${body}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")

    if (signature !== expected) throw new Error("Token inválido")

    const payload = JSON.parse(Buffer.from(body, "base64").toString())

    if (payload.exp && Date.now() > payload.exp) throw new Error("Token expirado")

    return payload
}

module.exports = { sign, verify }