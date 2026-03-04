// backend/controllers/aiController.js
const pool = require('../db')
const https = require('https')

async function aiChat(req, res) {
  const userId = req.user.id
  const { message } = req.body

  if (!message) {
    res.writeHead(400)
    res.end(JSON.stringify({ error: 'Mensagem obrigatória' }))
    return
  }

  // Busca transações do usuário para contexto
  const result = await pool.query(
    'SELECT type, category, amount, date FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 50',
    [userId]
  )

  const transactions = result.rows

  const systemPrompt = `Você é um assistente financeiro pessoal. 
Analise as transações do usuário e responda perguntas sobre finanças de forma clara e objetiva em português.
Transações do usuário: ${JSON.stringify(transactions)}`

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: message }]
  })

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  }

  const apiReq = https.request(options, (apiRes) => {
    let data = ''
    apiRes.on('data', (chunk) => (data += chunk))
    apiRes.on('end', () => {
      const parsed = JSON.parse(data)
      const reply = parsed.content?.[0]?.text || 'Não foi possível obter resposta.'
      res.writeHead(200)
      res.end(JSON.stringify({ reply }))
    })
  })

  apiReq.on('error', (err) => {
    res.writeHead(500)
    res.end(JSON.stringify({ error: 'Erro ao chamar a IA' }))
  })

  apiReq.write(payload)
  apiReq.end()
}

module.exports = { aiChat }