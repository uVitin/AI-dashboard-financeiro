// frontend/js/auth.js
const API = 'http://localhost:3000/api'

function switchTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab')
  tabs[0].classList.toggle('active', tab === 'login')
  tabs[1].classList.toggle('active', tab === 'register')
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none'
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none'
  hideError()
}

function showError(msg) {
  const el = document.getElementById('error-msg')
  el.textContent = msg
  el.classList.add('show')
}

function hideError() {
  document.getElementById('error-msg').classList.remove('show')
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value

  if (!email || !password) return showError('Preencha todos os campos')

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (!res.ok) return showError(data.error)

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.href = 'dashboard.html'
  } catch {
    showError('Erro ao conectar com o servidor')
  }
}

async function handleRegister() {
  const name = document.getElementById('register-name').value.trim()
  const email = document.getElementById('register-email').value.trim()
  const password = document.getElementById('register-password').value

  if (!name || !email || !password) return showError('Preencha todos os campos')

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()
    if (!res.ok) return showError(data.error)

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.href = 'dashboard.html'
  } catch {
    showError('Erro ao conectar com o servidor')
  }
}

// Redireciona se já estiver logado
if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html'
}