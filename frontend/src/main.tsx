import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Maintenance operations</p>
        <h1>FixFlow</h1>
        <p className="subtext">
          A platform for tracking maintenance requests from report to
          completion, with assignment workflows, SLA monitoring, and operational
          visibility.
        </p>
        <div className="stats">
          <div>
            <strong>37</strong>
            <span>Open Requests</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Overdue</span>
          </div>
          <div>
            <strong>18.4h</strong>
            <span>Avg Resolution</span>
          </div>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
