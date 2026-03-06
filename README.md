<div align="center">

# 💰 FinanceAI Dashboard

### Dashboard financeiro pessoal com inteligência artificial integrada

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-dashboard-financeiro.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Backend-Railway-blueviolet?style=for-the-badge&logo=railway)](https://ai-dashboard-financeiro-production.up.railway.app)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

**[🚀 Ver Demo ao Vivo](https://ai-dashboard-financeiro.vercel.app)**

</div>

---

## 📋 Sobre o Projeto

O **FinanceAI Dashboard** é uma aplicação web fullstack para controle financeiro pessoal, com assistente de inteligência artificial integrado. O projeto foi desenvolvido **100% sem frameworks** — Node.js puro no backend e HTML/CSS/JS puro no frontend — como forma de aprofundar o entendimento dos fundamentos do desenvolvimento web.

> 💡 **Diferencial:** Todo o backend foi construído sem Express, sem ORM e sem nenhum framework auxiliar. JWT implementado do zero usando o módulo `crypto` nativo do Node.js.

---

## ✨ Funcionalidades

- 🔐 **Autenticação completa** — login e cadastro com JWT manual
- 📊 **Dashboard interativo** — cards de saldo, entradas e saídas em tempo real
- 📈 **Gráficos dinâmicos** — pizza por categoria e evolução mensal
- 💳 **CRUD de transações** — criar, editar e excluir receitas e despesas
- 🔍 **Filtros avançados** — por tipo, categoria e mês
- 🤖 **Chat com IA** — assistente financeiro powered by Claude AI
- 📱 **Responsivo** — menu lateral no desktop, menu inferior no mobile
- 🌙 **Dark mode** — interface escura moderna

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript (ES6+) | Lógica e interatividade |
| Chart.js | Gráficos e visualizações |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js (http module) | Servidor HTTP puro |
| crypto (nativo) | JWT e hash de senhas |
| pg | Driver PostgreSQL |
| dotenv | Variáveis de ambiente |

### Banco de Dados
| Tecnologia | Uso |
|---|---|
| PostgreSQL | Banco relacional principal |

### Deploy
| Serviço | Uso |
|---|---|
| Vercel | Hospedagem do frontend |
| Railway | Hospedagem do backend + banco |

---

## 🏗️ Arquitetura do Projeto

```
finance-dashboard/
│
├── backend/
│   ├── server.js              # Servidor HTTP puro
│   ├── router.js              # Roteamento manual
│   ├── db.js                  # Conexão PostgreSQL
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── aiController.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── transactionModel.js
│   │
│   ├── middlewares/
│   │   ├── auth.js            # Validação JWT manual
│   │   └── cors.js
│   │
│   └── utils/
│       ├── jwt.js             # JWT sem biblioteca
│       └── hash.js            # Hash de senha (crypto nativo)
│
├── frontend/
│   ├── index.html             # Login/Cadastro
│   ├── dashboard.html         # Dashboard principal
│   │
│   ├── css/
│   │   ├── reset.css
│   │   ├── auth.css
│   │   └── dashboard.css
│   │
│   └── js/
│       ├── config.js          # Configuração de ambiente
│       ├── auth.js            # Login/Cadastro
│       ├── dashboard.js       # Lógica principal
│       ├── charts.js          # Gráficos
│       ├── transactions.js    # CRUD de transações
│       └── ai.js              # Chat com IA
│
└── database/
    └── schema.sql             # Schema PostgreSQL
```

---

## 🗄️ Banco de Dados

```sql
users
├── id (UUID)
├── name
├── email (unique)
├── password_hash
└── created_at

transactions
├── id (UUID)
├── user_id (FK → users)
├── type (income | expense)
├── category
├── description
├── amount
├── date
└── created_at

budgets
├── id (UUID)
├── user_id (FK → users)
├── category
├── limit_amount
├── month
├── year
└── created_at
```

---
## 📱 Screenshots

### Login
> Tela de autenticação com alternância entre login e cadastro

### Dashboard
> Visão geral com cards de saldo, gráficos e transações recentes

### Transações
> Lista completa com filtros por tipo, categoria e mês

### Assistente IA
> Chat inteligente com contexto financeiro do usuário


## 👨‍💻 Autor

Desenvolvido por **Albert Vitor**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/uVitin)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ae-vitor)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ☕ e muito JavaScript!

⭐ Se esse projeto te ajudou, deixa uma estrela!

</div>
