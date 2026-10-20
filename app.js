* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --primary: #0a7f6a;
  --primary-deep: #065c4a;
  --accent: #e9f8f4;
  --success: #eaf9ef;
  --warning: #fff6e3;
  --text: #17313f;
  --muted: #5d7382;
  --border: #dfeaf2;
  --shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #edf6f4 0%, var(--bg) 20%, #eef4fb 100%);
  color: var(--text);
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 18px 42px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
}

.primary-btn {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%);
  color: white;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(10, 127, 106, 0.28);
}

.dashboard {
  display: grid;
  gap: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 18px 16px;
  box-shadow: var(--shadow);
}

.summary-card.accent { background: var(--accent); }
.summary-card.success { background: var(--success); }
.summary-card.warning { background: var(--warning); }

.summary-card .label {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.summary-card strong {
  font-size: clamp(1.3rem, 2.4vw, 2rem);
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px;
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel h2 {
  margin: 0;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
}

input,
select {
  width: 100%;
  border: 1px solid var(--border);
  background: #fbfcfe;
  border-radius: 12px;
  padding: 11px 12px;
  color: var(--text);
}

.full-width {
  grid-column: 1 / -1;
}

.student-list {
  display: grid;
  gap: 14px;
}

.student-card {
  border: 1px solid var(--border);
  background: #fbfcfe;
  border-radius: 16px;
  padding: 14px;
}

.student-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 10px;
}

.student-top h3 {
  margin: 0;
  font-size: 1.1rem;
}

.meta-line {
  margin: 4px 0;
  color: var(--muted);
  font-size: 0.84rem;
}

.student-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 14px 0;
}

.metric-box {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
}

.metric-box span {
  display: block;
  font-size: 0.72rem;
  color: var(--muted);
}

.metric-box strong {
  display: block;
  margin-top: 6px;
  font-size: 1rem;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.secondary-btn {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 600;
  cursor: pointer;
}

.history-list {
  display: grid;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
}

.history-item strong {
  display: block;
  margin-bottom: 4px;
}

.history-item small {
  color: var(--muted);
}

.amount-pill {
  font-weight: 700;
  color: var(--primary-deep);
}

.empty-state {
  color: var(--muted);
  padding: 18px 6px;
}

@media (max-width: 920px) {
  .summary-grid,
  .panel-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 680px) {
  .app-shell {
    padding-left: 12px;
    padding-right: 12px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid,
  .panel-grid,
  .student-metrics {
    grid-template-columns: 1fr;
  }

  .student-top,
  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-actions {
    width: 100%;
  }

  .secondary-btn,
  .primary-btn {
    width: 100%;
  }
}
