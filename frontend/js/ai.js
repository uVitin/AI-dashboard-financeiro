// frontend/js/ai.js

async function sendMessage() {
  const input = document.getElementById('ai-input')
  const message = input.value.trim()
  if (!message) return

  input.value = ''
  appendMessage('user', message)
  appendTyping()

  try {
    const res = await fetch(`${API}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })

    const data = await res.json()
    removeTyping()
    appendMessage('ai', data.reply || 'Não foi possível obter resposta.')
  } catch {
    removeTyping()
    appendMessage('ai', 'Erro ao conectar com o assistente. Tente novamente.')
  }
}

function sendSuggestion(btn) {
  document.getElementById('ai-input').value = btn.textContent
  sendMessage()
}

function appendMessage(role, text) {
  const container = document.getElementById('ai-messages')
  const div = document.createElement('div')
  div.className = `message ${role}`
  div.innerHTML = `
    <div class="message-avatar">${role === 'ai' ? '🤖' : '👤'}</div>
    <div class="message-bubble">${text}</div>
  `
  container.appendChild(div)
  container.scrollTop = container.scrollHeight
}

function appendTyping() {
  const container = document.getElementById('ai-messages')
  const div = document.createElement('div')
  div.className = 'message ai'
  div.id = 'typing-indicator'
  div.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-bubble">Analisando suas finanças...</div>
  `
  container.appendChild(div)
  container.scrollTop = container.scrollHeight
}

function removeTyping() {
  document.getElementById('typing-indicator')?.remove()
}