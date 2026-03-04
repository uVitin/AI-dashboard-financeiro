// backend/controllers/authController.js
const pool = require('../db')
const { hashPassword, comparePassword } = require('../utils/hash')
const { sign } = require('../utils/jwt')

async function register(req, res, body) {
  const { name, email, password } = body

  if (!name || !email || !password) {
    res.writeHead(400)
    res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }))
    return
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    res.writeHead(409)
    res.end(JSON.stringify({ error: 'Email já cadastrado' }))
    return
  }

  const password_hash = hashPassword(password)
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, password_hash]
  )

  const user = result.rows[0]
  const token = sign({ id: user.id, email: user.email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })

  res.writeHead(201)
  res.end(JSON.stringify({ token, user }))
}

async function login(req, res, body) {
  const { email, password } = body

  if (!email || !password) {
    res.writeHead(400)
    res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }))
    return
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]

  if (!user || !comparePassword(password, user.password_hash)) {
    res.writeHead(401)
    res.end(JSON.stringify({ error: 'Email ou senha inválidos' }))
    return
  }

  const token = sign({ id: user.id, email: user.email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })

  res.writeHead(200)
  res.end(JSON.stringify({ token, user: { id: user.id, name: user.name, email: user.email } }))
}

module.exports = { register, login }