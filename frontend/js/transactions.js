function renderTransactions() {
  const type = document.getElementById('filter-type').value
  const category = document.getElementById('filter-category').value
  const month = document.getElementById('filter-month').value

  let data = [...allTransactions]

  if (type) data = data.filter(t => t.type === type)
  if (category) data = data.filter(t => t.category === category)
  if (month) data = data.filter(t => new Date(t.date).getUTCMonth() + 1 === Number(month))

  const tbody = document.getElementById('transactions-tbody')
  tbody.innerHTML = data.length ? data.map(t => rowHTML(t, true)).join('') : emptyState()

  const categories = [...new Set(allTransactions.map(t => t.category))]
  const select = document.getElementById('filter-category')
  const current = select.value
  select.innerHTML = '<option value="">Todas as categorias</option>'
  categories.forEach(c => {
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    if (c === current) opt.selected = true
    select.appendChild(opt)
  })
}

async function saveTransaction() {
  const id = document.getElementById('edit-id').value
  const type = document.getElementById('tx-type').value
  const amount = document.getElementById('tx-amount').value
  const category = document.getElementById('tx-category').value
  const date = document.getElementById('tx-date').value
  const description = document.getElementById('tx-description').value

  if (!amount || !date) return alert('Preencha valor e data')

  const body = { type, amount: Number(amount), category, date, description }
  const url = id ? `${API}/transactions/${id}` : `${API}/transactions`
  const method = id ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) return alert('Erro ao salvar transação')

    closeModal()
    await fetchTransactions()
  } catch {
    alert('Erro ao conectar com o servidor')
  }
}

function editTransaction(tx) {
  openModal(tx)
}

async function deleteTransaction(id) {
  if (!confirm('Deseja excluir esta transação?')) return

  try {
    const res = await fetch(`${API}/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) return alert('Erro ao excluir transação')
    await fetchTransactions()
  } catch {
    alert('Erro ao conectar com o servidor')
  }
}