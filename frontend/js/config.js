const CONFIG = {
    API: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://ai-dashboard-financeiro-production.up.railway.app/api"
};