const API = CONFIG.API;
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) window.location.href = "index.html";

let allTransactions = [];
let currentTab = "month";

document.addEventListener("DOMContentLoaded", async () => {
    loadUserInfo();
    await fetchTransactions();
    renderOverview();
    setDefaultDate();
});

function loadUserInfo() {
    document.getElementById("user-name").textContent = user.name || "Usúario";
    document.getElementById("user-email").textContent = user.email || "";
    document.getElementById("user-avatar").textContent = (user.name || "U")[0].toUpperCase();
};

async function fetchTransactions() {
    try {
        const res = await fetch(`${API}/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) return logout();
        allTransactions = await res.json();
        renderOverview();
        renderTransactions();
        renderCharts();
    } catch {
        console.error("Erro ao buscar transação")
    };
};

function setPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(`page-${page}`).classList.add("active");

    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));

    const titles = { overview: "Visão Geral", transactions: "Transações", ai: "Assistente IA" };
    document.querySelectorAll(".nav-item")[{ overview: 0, transactions: 1, ai: 2 }[page]]?.classList.add("active");
    document.querySelectorAll(".bottom-nav-item")[idx[page]]?.classList.add("active");
};

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-btn").forEach((b, i) => {
        b.classList.toggle("active", ["month", "year", "all"][i] === tab);
    });
    renderOverview();
    renderCharts();
};

function getFilteredByTab() {
    const now = new Date();
    return allTransactions.filter(t => {
        const date = new Date(t.date);
        if (currentTab === "month") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        };
        if (currentTab === "year") return date.getFullYear() === now.getFullYear();
        return true;
    });
};

function renderOverview() {
    const now = new Date();
    const data = getFilteredByTab();
    const income = data.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = data.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const balance = income - expense;

    document.getElementById('card-balance').textContent = formatCurrency(balance);
    document.getElementById('card-balance').className = `card-value ${balance >= 0 ? 'green' : 'red'}`;
    document.getElementById('card-income').textContent = formatCurrency(income);
    document.getElementById('card-expense').textContent = formatCurrency(expense);
    document.getElementById('card-income-count').textContent = `${data.filter(t => t.type === 'income').length} transações`;
    document.getElementById('card-expense-count').textContent = `${data.filter(t => t.type === 'expense').length} transações`;

    const tbody = document.getElementById('recent-tbody');
    const recent = [...allTransactions].slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(t => rowHTML(t, false)).join('') : emptyState();
};

function openModal(tx = null) {
    document.getElementById("modal-title").textContent = tx ? "Editar Transação" : "Nova Transação";
    document.getElementById("edit-id").value = tx?.id || "";
    document.getElementById("tx-type").value = tx?.type || "expanse";
    document.getElementById("tx-amount").value = tx?.amount || "";
    document.getElementById('tx-category').value = tx?.category || 'Alimentação';
    document.getElementById('tx-date').value = tx?.date?.split('T')[0] || new Date().toISOString().split('T')[0];
    document.getElementById('tx-description').value = tx?.description || ''
    document.getElementById('modal-overlay').classList.add('open');
};

function closeModal() {
    document.getElementById("modal-overlay").classList.remove("open");
};

function closeModalOutside(e) {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
};

function setDefaultDate() {
    document.getElementById("tx-date").value = new Date().toISOString().split("T")[0];
};

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

function rowHTML(t, actions) {
    actions = actions === true;
    return `
        <tr>
            <td>${t.description || '—'}</td>
            <td>${t.category}</td>
            <td>${formatDate(t.date)}</td>
            <td><span class="badge badge-${t.type}">${t.type === 'income' ? 'Entrada' : 'Saída'}</span></td>
            <td class="amount-${t.type}">${t.type === 'expense' ? '- ' : '+ '}${formatCurrency(t.amount)}</td>
            ${actions ? `<td>
                <button class="action-btn btn-edit" onclick='editTransaction(${JSON.stringify(t)})'>✏️ Editar</button>
                <button class="action-btn btn-delete" onclick="deleteTransaction('${t.id}')">🗑️ Excluir</button>
            </td>` : '<td></td>'} 
        </tr>
    `;
};

function emptyState() {
    return `<tr><td colspan="6">
        <div>
            <div class="empty-state-icon">💸</div>
            <div class="empty-state-text">Nenhuma transação encontrada</div>
        </div>
        </td></tr>`;
};

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
};

