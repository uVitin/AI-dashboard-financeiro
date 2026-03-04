// backend/controllers/transactionController.js
const pool = require('../db')

async function getTransactions(req, res) {
  const userId = req.user.id
  const result = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  )
  res.writeHead(200)
  res.end(JSON.stringify(result.rows))
}

async function createTransaction(req, res) {
  const userId = req.user.id
  const { type, category, description, amount, date } = req.body

  if (!type || !category || !amount || !date) {
    res.writeHead(400)
    res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }))
    return
  }

  const result = await pool.query(
    `INSERT INTO transactions (user_id, type, category, description, amount, date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, type, category, description, amount, date]
  )

  res.writeHead(201)
  res.end(JSON.stringify(result.rows[0]))
}

async function updateTransaction(req, res) {
  const userId = req.user.id
  const { id } = req.params
  const { type, category, description, amount, date } = req.body

  const result = await pool.query(
    `UPDATE transactions
     SET type=$1, category=$2, description=$3, amount=$4, date=$5
     WHERE id=$6 AND user_id=$7
     RETURNING *`,
    [type, category, description, amount, date, id, userId]
  )

  if (result.rows.length === 0) {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Transação não encontrada' }))
    return
  }

  res.writeHead(200)
  res.end(JSON.stringify(result.rows[0]))
}

async function deleteTransaction(req, res) {
  const userId = req.user.id
  const { id } = req.params

  const result = await pool.query(
    'DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING id',
    [id, userId]
  )

  if (result.rows.length === 0) {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Transação não encontrada' }))
    return
  }

  res.writeHead(200)
  res.end(JSON.stringify({ message: 'Transação deletada com sucesso' }))
}

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction }