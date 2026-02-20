import { useState, useEffect, useRef, useCallback } from "react";

// ─── Sample Data ───────────────────────────────────────────────────────────────
const ACCOUNTS = [
  { id: 1, name: "Main Checking", type: "checking", balance: 4820.5, institution: "Bank Hapoalim", lastTx: "Today", icon: "🏦" },
  { id: 2, name: "Savings", type: "savings", balance: 12350.0, institution: "Bank Leumi", lastTx: "Yesterday", icon: "💰" },
  { id: 3, name: "Credit Card", type: "credit", balance: -1245.3, institution: "Visa Cal", lastTx: "Today", icon: "💳" },
];

const CATEGORIES = [
  { id: "groceries", name: "Groceries", emoji: "🛒", color: "#4CAF50", budget: 2500 },
  { id: "dining", name: "Dining Out", emoji: "🍽️", color: "#FF6B6B", budget: 1200 },
  { id: "transport", name: "Transport", emoji: "🚗", color: "#4ECDC4", budget: 800 },
  { id: "utilities", name: "Utilities", emoji: "⚡", color: "#FFD93D", budget: 600 },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "#A78BFA", budget: 500 },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "#F472B6", budget: 1000 },
  { id: "health", name: "Health", emoji: "🏥", color: "#34D399", budget: 400 },
  { id: "subscriptions", name: "Subscriptions", emoji: "📱", color: "#60A5FA", budget: 350 },
];

const TRANSACTIONS = [
  { id: 1, merchant: "Shufersal Deal", amount: -185.5, category: "groceries", date: "2026-02-20", time: "14:32", pending: false },
  { id: 2, merchant: "Café Xoho", amount: -42.0, category: "dining", date: "2026-02-20", time: "12:15", pending: false },
  { id: 3, merchant: "Gett Taxi", amount: -38.9, category: "transport", date: "2026-02-20", time: "09:45", pending: true },
  { id: 4, merchant: "Salary - TechCorp", amount: 15800.0, category: "income", date: "2026-02-19", time: "08:00", pending: false },
  { id: 5, merchant: "Netflix", amount: -49.9, category: "subscriptions", date: "2026-02-18", time: "00:00", pending: false },
  { id: 6, merchant: "AM:PM", amount: -28.5, category: "groceries", date: "2026-02-18", time: "19:22", pending: false },
  { id: 7, merchant: "Yes Planet Cinema", amount: -65.0, category: "entertainment", date: "2026-02-17", time: "20:00", pending: false },
  { id: 8, merchant: "Electric Company", amount: -320.0, category: "utilities", date: "2026-02-17", time: "10:00", pending: false },
  { id: 9, merchant: "Castro", amount: -189.0, category: "shopping", date: "2026-02-16", time: "15:30", pending: false },
  { id: 10, merchant: "Maccabi Health", amount: -120.0, category: "health", date: "2026-02-16", time: "11:00", pending: false },
  { id: 11, merchant: "Rami Levy", amount: -245.0, category: "groceries", date: "2026-02-15", time: "16:45", pending: false },
  { id: 12, merchant: "Spotify", amount: -25.9, category: "subscriptions", date: "2026-02-15", time: "00:00", pending: false },
  { id: 13, merchant: "Wolt - Sushi Delivery", amount: -88.0, category: "dining", date: "2026-02-14", time: "21:30", pending: false },
  { id: 14, merchant: "Dan Bus", amount: -12.0, category: "transport", date: "2026-02-14", time: "08:20", pending: false },
  { id: 15, merchant: "IKEA", amount: -450.0, category: "shopping", date: "2026-02-13", time: "14:00", pending: false },
];

const BILLS = [
  { id: 1, name: "Rent", amount: 4500, dueDate: "2026-03-01", recurring: "monthly", icon: "🏠", paid: false },
  { id: 2, name: "Internet (Partner)", amount: 119, dueDate: "2026-02-25", recurring: "monthly", icon: "📡", paid: false },
  { id: 3, name: "Phone (Cellcom)", amount: 79, dueDate: "2026-02-28", recurring: "monthly", icon: "📱", paid: false },
  { id: 4, name: "Gym Membership", amount: 249, dueDate: "2026-03-01", recurring: "monthly", icon: "🏋️", paid: false },
  { id: 5, name: "Car Insurance", amount: 380, dueDate: "2026-03-05", recurring: "monthly", icon: "🚗", paid: false },
];

const GOALS = [
  { id: 1, name: "Emergency Fund", target: 30000, saved: 12350, icon: "🛡️", deadline: "2026-12-31", color: "#4ECDC4" },
  { id: 2, name: "Vacation to Greece", target: 8000, saved: 3200, icon: "✈️", deadline: "2026-08-01", color: "#A78BFA" },
  { id: 3, name: "New Laptop", target: 5000, saved: 4200, icon: "💻", deadline: "2026-04-15", color: "#FF6B6B" },
];

// ─── Utility Functions ─────────────────────────────────────────────────────────
const formatCurrency = (amount, showSign = false) => {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (showSign && amount > 0) return `+₪${formatted}`;
  if (amount < 0) return `-₪${formatted}`;
  return `₪${formatted}`;
};

const getRelativeDate = (dateStr) => {
  const today = new Date("2026-02-20");
  const date = new Date(dateStr);
  const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString("en-IL", { month: "short", day: "numeric" });
};

const getDaysUntil = (dateStr) => {
  const today = new Date("2026-02-20");
  const date = new Date(dateStr);
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
};

const getCategorySpent = (catId) => {
  return TRANSACTIONS.filter((t) => t.category === catId && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
};

// ─── SVG Donut Chart ───────────────────────────────────────────────────────────
const DonutChart = ({ data, size = 200 }) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size * 0.35;
  const strokeW = size * 0.12;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: "drop-shadow(0 4px 24px rgba(78,205,196,0.10))" }}>
      {data.map((d, i) => {
        const pct = d.value / total;
        const dashArray = `${circumference * pct} ${circumference * (1 - pct)}`;
        const dashOffset = -offset * circumference;
        const seg = (
          <circle
            key={d.id}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={hovered === i ? strokeW + 6 : strokeW}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-width 0.25s ease, opacity 0.25s ease", opacity: hovered !== null && hovered !== i ? 0.4 : 1, cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        );
        offset += pct;
        return seg;
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-primary)" fontSize={size * 0.1} fontWeight="700" fontFamily="var(--font-display)">
        {hovered !== null ? `${Math.round((data[hovered].value / total) * 100)}%` : formatCurrency(total)}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={size * 0.055} fontFamily="var(--font-body)">
        {hovered !== null ? data[hovered].name : "Total Spent"}
      </text>
    </svg>
  );
};

// ─── Circular Progress for Goals ───────────────────────────────────────────────
const CircularProgress = ({ pct, size = 64, color, children }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(pct, 1);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-elevated)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${filled} ${circ - filled}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>
        {children}
      </div>
    </div>
  );
};

// ─── Budget Progress Bar ───────────────────────────────────────────────────────
const BudgetBar = ({ spent, budget, color }) => {
  const pct = Math.min(spent / budget, 1.15);
  const barColor = pct < 0.6 ? "#4CAF50" : pct < 0.85 ? "#FFB020" : "#FF4757";
  return (
    <div style={{ width: "100%", height: 8, borderRadius: 4, background: "var(--surface-elevated)", overflow: "hidden", position: "relative" }}>
      <div style={{
        width: `${Math.min(pct * 100, 100)}%`, height: "100%", borderRadius: 4,
        background: `linear-gradient(90deg, ${color}88, ${barColor})`,
        transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
};

// ─── Add Transaction Bottom Sheet ──────────────────────────────────────────────
const AddTransactionSheet = ({ open, onClose, onAdd }) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [txType, setTxType] = useState("expense");

  const handleSubmit = () => {
    if (!amount || !merchant || !category) return;
    onAdd({
      id: Date.now(), merchant, amount: txType === "expense" ? -parseFloat(amount) : parseFloat(amount),
      category, date: "2026-02-20", time: new Date().toTimeString().slice(0, 5), pending: false,
    });
    setAmount(""); setMerchant(""); setCategory(""); onClose();
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} />
      <div style={{
        position: "relative", background: "var(--surface-card)", borderRadius: "24px 24px 0 0",
        padding: "20px 24px 36px", maxHeight: "85vh", overflowY: "auto",
        animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 20px" }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20, fontFamily: "var(--font-display)" }}>
          Add Transaction
        </h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["expense", "income"].map((t) => (
            <button key={t} onClick={() => setTxType(t)} style={{
              flex: 1, padding: "10px 0", borderRadius: 12, border: "2px solid",
              borderColor: txType === t ? "var(--accent)" : "var(--border)",
              background: txType === t ? "var(--accent-soft)" : "transparent",
              color: txType === t ? "var(--accent)" : "var(--text-muted)",
              fontWeight: 600, fontSize: 14, cursor: "pointer", textTransform: "capitalize",
              fontFamily: "var(--font-body)", transition: "all 0.2s ease",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Amount (₪)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid var(--border)",
              background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 28, fontWeight: 700,
              fontFamily: "var(--font-display)", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Merchant</label>
          <input type="text" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Where did you spend?"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid var(--border)",
              background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 16,
              fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Category</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                padding: "10px 4px", borderRadius: 12, border: "2px solid",
                borderColor: category === c.id ? c.color : "var(--border)",
                background: category === c.id ? c.color + "18" : "transparent",
                cursor: "pointer", textAlign: "center", transition: "all 0.2s ease",
              }}>
                <div style={{ fontSize: 22 }}>{c.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", marginTop: 2 }}>{c.name}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "16px", borderRadius: 16, border: "none",
          background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          fontFamily: "var(--font-display)", transition: "transform 0.15s, box-shadow 0.15s",
          boxShadow: "0 4px 20px var(--accent-glow)",
        }}
          onMouseDown={(e) => e.target.style.transform = "scale(0.97)"}
          onMouseUp={(e) => e.target.style.transform = "scale(1)"}
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
};

// ─── Notification Toast ────────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => {
  if (!visible) return null;
  const colors = { success: "#4CAF50", warning: "#FFB020", info: "var(--accent)" };
  return (
    <div style={{
      position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 2000,
      padding: "12px 24px", borderRadius: 16, background: "var(--surface-card)",
      border: `2px solid ${colors[type] || colors.info}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", gap: 10, animation: "slideDown 0.4s ease",
      fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[type] }} />
      {message}
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });
  const [txFilter, setTxFilter] = useState("all");
  const [animated, setAnimated] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const handleAddTx = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
    showToast("Transaction added!", "success");
  };

  const totalBalance = ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const upcomingBills = BILLS.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const goalContributions = 1500; // monthly auto-save
  const safeToSpend = totalIncome - upcomingBills - goalContributions - totalExpenses;

  const spendingByCategory = CATEGORIES.map((c) => ({
    id: c.id, name: c.name, color: c.color, emoji: c.emoji,
    value: getCategorySpent(c.id), budget: c.budget,
  })).filter((c) => c.value > 0).sort((a, b) => b.value - a.value);

  const filteredTx = txFilter === "all" ? transactions
    : transactions.filter((t) => t.category === txFilter);

  // ─── Styles ────────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    :root {
      --font-display: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'DM Sans', sans-serif;

      --bg-primary: #0B0F1A;
      --bg-secondary: #111827;
      --surface-card: #1A1F2E;
      --surface-elevated: #242938;
      --border: #2D3348;
      --border-light: #363D54;

      --text-primary: #F0F2F8;
      --text-secondary: #B0B8D0;
      --text-muted: #6B7394;

      --accent: #4ECDC4;
      --accent-secondary: #45B7AA;
      --accent-soft: rgba(78,205,196,0.12);
      --accent-glow: rgba(78,205,196,0.25);

      --positive: #4CAF50;
      --negative: #FF4757;
      --warning: #FFB020;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    body {
      background: var(--bg-primary);
      font-family: var(--font-body);
      color: var(--text-primary);
      overflow-x: hidden;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translate(-50%, -20px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes fadeInUp {
      from { transform: translateY(16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(120px) rotate(720deg); opacity: 0; }
    }
    @keyframes gentleBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .card {
      background: var(--surface-card);
      border-radius: 20px;
      padding: 20px;
      border: 1px solid var(--border);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .card-elevated {
      background: linear-gradient(135deg, var(--surface-card), var(--surface-elevated));
      box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    }

    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    input[type=number] { -moz-appearance: textfield; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  `;

  // ─── Tab Renderers ─────────────────────────────────────────────────────────

  const renderHome = () => (
    <div style={{ padding: "0 20px 120px", animation: "fadeInUp 0.5s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 12px" }}>
        <div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>Good afternoon</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>Welcome back 👋</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 14, background: "var(--accent-soft)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          border: "1px solid var(--border)", transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 20 }}>🔔</span>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="card card-elevated" style={{
        marginBottom: 16, padding: 24, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #1A2332 0%, #0F1923 50%, #1A2332 100%)",
        border: "1px solid rgba(78,205,196,0.15)",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4, letterSpacing: 0.5 }}>
          TOTAL BALANCE
        </div>
        <div style={{
          fontSize: 42, fontWeight: 800, fontFamily: "var(--font-display)",
          color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 16,
          background: "linear-gradient(135deg, var(--text-primary), var(--accent))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {formatCurrency(totalBalance)}
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Income</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--positive)", fontFamily: "var(--font-display)" }}>
              {formatCurrency(totalIncome, true)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Expenses</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--negative)", fontFamily: "var(--font-display)" }}>
              {formatCurrency(-totalExpenses)}
            </div>
          </div>
        </div>
      </div>

      {/* Safe to Spend */}
      <div className="card" style={{
        marginBottom: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
        background: safeToSpend > 1000 ? "rgba(78,205,196,0.06)" : "rgba(255,71,87,0.06)",
        border: `1px solid ${safeToSpend > 1000 ? "rgba(78,205,196,0.2)" : "rgba(255,71,87,0.2)"}`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          background: safeToSpend > 1000 ? "var(--accent-soft)" : "rgba(255,71,87,0.12)", fontSize: 24,
        }}>
          {safeToSpend > 1000 ? "✨" : "⚠️"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Safe to Spend</div>
          <div style={{
            fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)",
            color: safeToSpend > 1000 ? "var(--accent)" : "var(--negative)",
          }}>
            {formatCurrency(safeToSpend)}
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", lineHeight: 1.5 }}>
          Income − Bills<br />− Goals − Spent
        </div>
      </div>

      {/* Accounts Row */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>Accounts</h3>
          <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>See all</span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {ACCOUNTS.map((a) => (
            <div key={a.id} className="card" style={{
              minWidth: 160, padding: "16px", flex: "0 0 auto",
              border: a.balance < 0 ? "1px solid rgba(255,71,87,0.2)" : "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{a.name}</span>
              </div>
              <div style={{
                fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)",
                color: a.balance < 0 ? "var(--negative)" : "var(--text-primary)",
              }}>
                {formatCurrency(a.balance)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{a.institution}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Donut */}
      <div className="card card-elevated" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>Spending Overview</h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface-elevated)", padding: "4px 12px", borderRadius: 8, fontWeight: 500 }}>Feb 2026</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <DonutChart data={spendingByCategory} size={180} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 140 }}>
            {spendingByCategory.slice(0, 5).map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                <span style={{ color: "var(--text-secondary)", flex: 1 }}>{c.emoji} {c.name}</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{formatCurrency(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Bills */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>Upcoming Bills</h3>
          <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>View all</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {BILLS.slice(0, 3).map((b) => {
            const days = getDaysUntil(b.dueDate);
            return (
              <div key={b.id} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: "var(--surface-elevated)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: days <= 3 ? "var(--warning)" : "var(--text-muted)" }}>
                    {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due in ${days} days`}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                  {formatCurrency(b.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>Recent Transactions</h3>
          <span onClick={() => setTab("transactions")} style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>See all</span>
        </div>
        {transactions.slice(0, 5).map((tx) => {
          const cat = CATEGORIES.find((c) => c.id === tx.category);
          return (
            <div key={tx.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: cat ? cat.color + "18" : "var(--accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{cat ? cat.emoji : "💵"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  {tx.merchant}
                  {tx.pending && <span style={{ fontSize: 10, color: "var(--warning)", marginLeft: 6, fontWeight: 500 }}>Pending</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{getRelativeDate(tx.date)} · {tx.time}</div>
              </div>
              <div style={{
                fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)",
                color: tx.amount > 0 ? "var(--positive)" : "var(--text-primary)",
              }}>
                {formatCurrency(tx.amount, true)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div style={{ padding: "0 20px 120px", animation: "fadeInUp 0.4s ease" }}>
      <div style={{ padding: "16px 0 12px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Transactions</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{transactions.length} transactions this month</p>
      </div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 8 }}>
        {[{ id: "all", name: "All", emoji: "📋" }, ...CATEGORIES].map((c) => (
          <button key={c.id} onClick={() => setTxFilter(c.id)} style={{
            padding: "8px 14px", borderRadius: 12, border: "1px solid",
            borderColor: txFilter === c.id ? "var(--accent)" : "var(--border)",
            background: txFilter === c.id ? "var(--accent-soft)" : "transparent",
            color: txFilter === c.id ? "var(--accent)" : "var(--text-muted)",
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "var(--font-body)", transition: "all 0.2s",
          }}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>
      {/* Transaction List */}
      {filteredTx.map((tx) => {
        const cat = CATEGORIES.find((c) => c.id === tx.category);
        return (
          <div key={tx.id} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, background: cat ? cat.color + "15" : "var(--accent-soft)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{cat ? cat.emoji : "💵"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                {tx.merchant}
                {tx.pending && <span style={{ fontSize: 10, color: "var(--warning)", marginLeft: 8, fontWeight: 500, background: "rgba(255,176,32,0.12)", padding: "2px 6px", borderRadius: 4 }}>Pending</span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {cat ? cat.name : "Income"} · {getRelativeDate(tx.date)} · {tx.time}
              </div>
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)",
              color: tx.amount > 0 ? "var(--positive)" : "var(--text-primary)",
            }}>
              {formatCurrency(tx.amount, true)}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderBudget = () => (
    <div style={{ padding: "0 20px 120px", animation: "fadeInUp 0.4s ease" }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Budget</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>February 2026</p>
      </div>
      {/* Total Budget Summary */}
      <div className="card card-elevated" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Total Budget</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)" }}>
              {formatCurrency(CATEGORIES.reduce((s, c) => s + c.budget, 0))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Spent</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--negative)" }}>
              {formatCurrency(totalExpenses)}
            </div>
          </div>
        </div>
        <BudgetBar spent={totalExpenses} budget={CATEGORIES.reduce((s, c) => s + c.budget, 0)} color="var(--accent)" />
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
          {formatCurrency(CATEGORIES.reduce((s, c) => s + c.budget, 0) - totalExpenses)} remaining this month
        </div>
      </div>
      {/* Category Budgets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CATEGORIES.map((cat) => {
          const spent = getCategorySpent(cat.id);
          const pct = spent / cat.budget;
          return (
            <div key={cat.id} className="card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: cat.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>{cat.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {formatCurrency(spent)} of {formatCurrency(cat.budget)}
                  </div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
                  color: pct < 0.6 ? "var(--positive)" : pct < 0.85 ? "var(--warning)" : "var(--negative)",
                }}>
                  {Math.round(pct * 100)}%
                </div>
              </div>
              <BudgetBar spent={spent} budget={cat.budget} color={cat.color} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGoals = () => (
    <div style={{ padding: "0 20px 120px", animation: "fadeInUp 0.4s ease" }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Goals</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Track your savings progress</p>
      </div>
      {GOALS.map((g) => {
        const pct = g.saved / g.target;
        const daysLeft = getDaysUntil(g.deadline);
        const isComplete = pct >= 0.84;
        return (
          <div key={g.id} className="card card-elevated" style={{
            marginBottom: 16, padding: 22, position: "relative", overflow: "hidden",
            border: isComplete ? `1px solid ${g.color}33` : "1px solid var(--border)",
          }}>
            {isComplete && (
              <div style={{
                position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%",
                background: `radial-gradient(circle, ${g.color}22, transparent 70%)`,
                filter: "blur(20px)", pointerEvents: "none",
              }} />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CircularProgress pct={pct} size={68} color={g.color}>
                <span style={{ fontSize: 22 }}>{g.icon}</span>
              </CircularProgress>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{g.name}</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: g.color, margin: "4px 0" }}>
                  {formatCurrency(g.saved)}
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}> / {formatCurrency(g.target)}</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                  <span>{Math.round(pct * 100)}% complete</span>
                  <span>{daysLeft} days left</span>
                </div>
              </div>
            </div>
            {/* Milestone markers */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, padding: "0 2px" }}>
              {[25, 50, 75, 100].map((m) => (
                <div key={m} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", fontSize: 10,
                    background: pct * 100 >= m ? g.color : "var(--surface-elevated)",
                    color: pct * 100 >= m ? "#fff" : "var(--text-muted)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, transition: "all 0.4s ease",
                    boxShadow: pct * 100 >= m ? `0 2px 8px ${g.color}44` : "none",
                  }}>
                    {pct * 100 >= m ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{m}%</span>
                </div>
              ))}
            </div>
            <button onClick={() => { showToast("Keep going! 🎉", "success"); }}
              style={{
                width: "100%", marginTop: 14, padding: "12px", borderRadius: 12, border: `1px solid ${g.color}44`,
                background: g.color + "12", color: g.color, fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "var(--font-display)", transition: "all 0.2s",
              }}
            >
              + Add Money
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderMore = () => (
    <div style={{ padding: "0 20px 120px", animation: "fadeInUp 0.4s ease" }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Settings</h2>
      </div>
      {[
        { icon: "👤", label: "Profile", desc: "Manage your account" },
        { icon: "🏦", label: "Linked Accounts", desc: `${ACCOUNTS.length} accounts connected` },
        { icon: "🔔", label: "Notifications", desc: "Alerts & reminders" },
        { icon: "🎨", label: "Appearance", desc: "Dark mode is active" },
        { icon: "📊", label: "Reports", desc: "Monthly & yearly summaries" },
        { icon: "📤", label: "Export Data", desc: "CSV & PDF export" },
        { icon: "🔒", label: "Security", desc: "Biometrics & PIN" },
        { icon: "❓", label: "Help & Feedback", desc: "Support center" },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 14, padding: "16px 0",
          borderBottom: "1px solid var(--border)", cursor: "pointer",
        }}
          onClick={() => showToast(`${item.label} settings coming soon!`, "info")}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: "var(--surface-card)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            border: "1px solid var(--border)",
          }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</div>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
        </div>
      ))}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Budget Pro v1.0.0</div>
        <div style={{ fontSize: 11, color: "var(--border-light)", marginTop: 4 }}>Your data is encrypted with 256-bit encryption</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
          <span style={{ fontSize: 12 }}>🔒</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>We never sell your information</span>
        </div>
      </div>
    </div>
  );

  // ─── Navigation Config ─────────────────────────────────────────────────────
  const tabs = [
    { id: "home", label: "Home", icon: "⌂", activeIcon: "⌂" },
    { id: "transactions", label: "Activity", icon: "↕", activeIcon: "↕" },
    { id: "budget", label: "Budget", icon: "◎", activeIcon: "◎" },
    { id: "goals", label: "Goals", icon: "◆", activeIcon: "◆" },
    { id: "more", label: "More", icon: "⋯", activeIcon: "⋯" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "var(--bg-primary)", position: "relative",
        fontFamily: "var(--font-body)",
        boxShadow: "0 0 80px rgba(0,0,0,0.5)",
      }}>
        <Toast {...toast} />

        {/* Page Content */}
        <div style={{ overflowY: "auto", height: "100vh", paddingBottom: 0 }}>
          {tab === "home" && renderHome()}
          {tab === "transactions" && renderTransactions()}
          {tab === "budget" && renderBudget()}
          {tab === "goals" && renderGoals()}
          {tab === "more" && renderMore()}
        </div>

        {/* FAB - Add Transaction */}
        <div onClick={() => setSheetOpen(true)} style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          width: 56, height: 56, borderRadius: 18,
          background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 28px var(--accent-glow)", cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          zIndex: 100, animation: animated ? "gentleBounce 3s ease-in-out infinite" : "none",
        }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateX(-50%) scale(0.9)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateX(-50%) scale(1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(-50%) scale(1)"; }}
        >
          <span style={{ fontSize: 28, color: "#fff", fontWeight: 300, lineHeight: 1 }}>+</span>
        </div>

        {/* Bottom Tab Bar */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "linear-gradient(180deg, transparent, var(--bg-primary) 20%)",
          padding: "10px 8px 20px",
          zIndex: 90,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-around", alignItems: "center",
            background: "var(--surface-card)", borderRadius: 20, padding: "8px 4px",
            border: "1px solid var(--border)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
          }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "8px 12px", borderRadius: 14, border: "none",
                background: tab === t.id ? "var(--accent-soft)" : "transparent",
                cursor: "pointer", transition: "all 0.25s ease", minWidth: 56,
              }}>
                <span style={{
                  fontSize: 20, lineHeight: 1,
                  color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
                  fontWeight: tab === t.id ? 700 : 400,
                  transition: "color 0.25s",
                }}>{tab === t.id ? t.activeIcon : t.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
                  transition: "color 0.25s", fontFamily: "var(--font-body)",
                }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Transaction Sheet */}
        <AddTransactionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={handleAddTx} />
      </div>
    </>
  );
}
