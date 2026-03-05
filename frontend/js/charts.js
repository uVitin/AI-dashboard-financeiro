// frontend/js/charts.js
let pieChart = null
let lineChart = null

function renderCharts() {
  const data = getFilteredByTab()
  renderPieChart(data)
  renderLineChart(data)
}

function renderPieChart(data) {
  const expenses = data.filter(t => t.type === 'expense')
  const grouped = {}
  expenses.forEach(t => {
    grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount)
  })

  const labels = Object.keys(grouped)
  const values = Object.values(grouped)

  const colors = ['#6C63FF','#2ECC71','#E74C3C','#F39C12','#3498DB','#9B59B6','#1ABC9C','#E67E22']

  if (pieChart) pieChart.destroy()

  const ctx = document.getElementById('chart-pie').getContext('2d')
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#E0E0F0', font: { size: 11 }, padding: 12 }
        }
      }
    }
  })
}

function renderLineChart(data) {
  const monthlyIncome = {}
  const monthlyExpense = {}
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  data.forEach(t => {
    const m = new Date(t.date).getUTCMonth()
    if (t.type === 'income') monthlyIncome[m] = (monthlyIncome[m] || 0) + Number(t.amount)
    else monthlyExpense[m] = (monthlyExpense[m] || 0) + Number(t.amount)
  })

  const usedMonths = [...new Set(data.map(t => new Date(t.date).getUTCMonth()))].sort((a, b) => a - b)
  const labels = usedMonths.length ? usedMonths.map(m => months[m]) : months

  if (lineChart) lineChart.destroy()

  const ctx = document.getElementById('chart-line').getContext('2d')
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: usedMonths.map(m => monthlyIncome[m] || 0),
          borderColor: '#2ECC71',
          backgroundColor: 'rgba(46,204,113,0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Saídas',
          data: usedMonths.map(m => monthlyExpense[m] || 0),
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231,76,60,0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#E0E0F0', font: { size: 11 } }
        }
      },
      scales: {
        x: { ticks: { color: '#8888AA' }, grid: { color: '#2A2A45' } },
        y: { ticks: { color: '#8888AA' }, grid: { color: '#2A2A45' } }
      }
    }
  })
}