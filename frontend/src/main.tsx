import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { fetchDashboardMetrics, fetchHealth, fetchRequests } from "./api";
import "./styles.css";

type Metrics = {
  openRequests: number;
  overdue: number;
  inProgress: number;
  completed: number;
  avgResolutionHours: number;
};

type RequestItem = {
  id: number;
  title: string;
  status: string;
  priority: string;
  customerName?: string;
};

function App() {
  const [health, setHealth] = useState<string>("Checking...");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data.status ?? "UP"))
      .catch(() => setHealth("Offline"));
    fetchDashboardMetrics()
      .then((data) => setMetrics(data))
      .catch(() => setMetrics(null));
    fetchRequests()
      .then((data) => setRequests(data))
      .catch(() => setRequests([]));
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="top-row">
          <p className="eyebrow">Maintenance operations</p>
          <span className="status-pill">API: {health}</span>
        </div>

        <h1>FixFlow</h1>
        <p className="subtext">
          A platform for tracking maintenance requests from report to
          completion, with assignment workflows, SLA monitoring, and operational
          visibility.
        </p>

        <div className="stats">
          <div>
            <strong>{metrics?.openRequests ?? 37}</strong>
            <span>Open Requests</span>
          </div>
          <div>
            <strong>{metrics?.overdue ?? 5}</strong>
            <span>Overdue</span>
          </div>
          <div>
            <strong>{metrics?.avgResolutionHours ?? 18.4}h</strong>
            <span>Avg Resolution</span>
          </div>
        </div>

        <div className="content-grid">
          <div className="panel">
            <h2>Recent work orders</h2>
            {requests.length === 0 ? (
              <p className="empty">No requests loaded yet.</p>
            ) : (
              <ul className="request-list">
                {requests.map((request) => (
                  <li key={request.id}>
                    <div>
                      <strong>#{request.id}</strong>
                      <span>{request.title}</span>
                    </div>
                    <div className="request-meta">
                      <span>{request.status}</span>
                      <span>{request.priority}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel">
            <h2>Operations snapshot</h2>
            <ul className="mini-stats">
              <li>
                <span>In Progress</span>
                <strong>{metrics?.inProgress ?? 14}</strong>
              </li>
              <li>
                <span>Completed</span>
                <strong>{metrics?.completed ?? 82}</strong>
              </li>
              <li>
                <span>Response SLA</span>
                <strong>On track</strong>
              </li>
            </ul>
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
