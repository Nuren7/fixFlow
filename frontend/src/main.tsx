import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  authenticate,
  createRequest,
  fetchDashboardMetrics,
  fetchHealth,
  fetchOwners,
  fetchRequests,
  Owner,
} from "./api";
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
  ownerName?: string;
};
type Session = { token: string; username: string; role: string };

function App() {
  const [session, setSession] = useState<Session | null>(() => {
    const saved = localStorage.getItem("fixflow_session");
    return saved ? JSON.parse(saved) : null;
  });
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<"owner" | "renter">("renter");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [health, setHealth] = useState("Checking...");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [message, setMessage] = useState("");

  const refreshDashboard = () => {
    fetchDashboardMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null));
    fetchRequests()
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    const handleAuthExpired = () => setSession(null);
    window.addEventListener("fixflow-auth-expired", handleAuthExpired);
    fetchHealth()
      .then((data) => setHealth(data.status ?? "UP"))
      .catch(() => setHealth("Offline"));
    fetchOwners()
      .then(setOwners)
      .catch(() => setOwners([]));
    if (session) refreshDashboard();
    return () =>
      window.removeEventListener("fixflow-auth-expired", handleAuthExpired);
  }, [session]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      const result = await authenticate(
        mode === "login" ? "/auth/login" : "/auth/register",
        {
          username,
          ...(mode === "register"
            ? { email, role: accountType === "owner" ? "MANAGER" : "CUSTOMER" }
            : {}),
          password,
        },
      );
      localStorage.setItem("fixflow_token", result.token);
      localStorage.setItem("fixflow_session", JSON.stringify(result));
      setSession(result);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  };

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createRequest({
        title,
        description,
        priority,
        ownerId: ownerId ? Number(ownerId) : null,
      });
      setTitle("");
      setDescription("");
      setMessage("Request submitted");
      refreshDashboard();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not submit request",
      );
    }
  };

  if (!session) {
    return (
      <main className="auth-layout">
        <section className="auth-panel">
          <div className="auth-form-wrap">
            <div className="brand-lockup">
              <span>FixFlow</span>
            </div>
            <div className="auth-heading">
              <p className="eyebrow">Maintenance operations</p>
              <h1>
                {mode === "login" ? "Welcome back" : "Create your workspace"}
              </h1>
              <p className="subtext">
                {mode === "login"
                  ? "Sign in to keep every property issue moving."
                  : "Set up a focused workspace for your property."}
              </p>
            </div>
            <div className="segmented auth-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Create account
              </button>
            </div>
            <form onSubmit={submitAuth} className="form-stack">
              {mode === "register" && (
                <div className="choice-row">
                  <button
                    type="button"
                    className={
                      accountType === "renter" ? "choice active" : "choice"
                    }
                    onClick={() => setAccountType("renter")}
                  >
                    Renter / customer
                  </button>
                  <button
                    type="button"
                    className={
                      accountType === "owner" ? "choice active" : "choice"
                    }
                    onClick={() => setAccountType("owner")}
                  >
                    Property owner
                  </button>
                </div>
              )}
              <label>
                Username
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              {mode === "register" && (
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              )}
              <label>
                Password
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {mode === "register" && accountType === "renter" && (
                <label>
                  Choose your owner
                  <select
                    required
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                  >
                    <option value="">Select an owner</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.username}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button className="primary-button" type="submit">
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
            {message && <p className="form-message">{message}</p>}
          </div>
        </section>
        <aside className="auth-brand-panel">
          <div className="brand-grid" />
          <div className="brand-content">
            <p className="eyebrow">Property service platform</p>
            <h2>
              Make maintenance
              <br />
              <span>feel manageable.</span>
            </h2>
            <p>
              One clear place for renters to report issues and owners to keep
              work under control.
            </p>
            <div className="brand-rule" />
            <span className="brand-meta">
              01 / 03 &nbsp; Operational clarity
            </span>
          </div>
          <div className="brand-footer">
            FIXFLOW <span>Built for better buildings</span>
          </div>
        </aside>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-lockup sidebar-brand">
          <span className="brand-mark">F</span>
          <span>FixFlow</span>
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav">
          <a className="nav-item active">
            <span className="nav-icon">▦</span>Overview
          </a>
          <a className="nav-item">
            <span className="nav-icon">＋</span>Requests
          </a>
          <a className="nav-item">
            <span className="nav-icon">◷</span>Activity
          </a>
        </nav>
        <div className="sidebar-section-label">Manage</div>
        <nav className="sidebar-nav">
          <a className="nav-item">
            <span className="nav-icon">⌂</span>Properties
          </a>
          <a className="nav-item">
            <span className="nav-icon">⚙</span>Settings
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip">
            <span className="avatar">
              {session.username.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{session.username}</strong>
              <small>
                {session.role === "MANAGER" ? "Property owner" : "Renter"}
              </small>
            </div>
          </div>
          <button
            className="signout-button"
            onClick={() => {
              localStorage.clear();
              setSession(null);
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Good to see you, {session.username}</h1>
          </div>
          <div className="top-actions">
            <span className="status-pill">
            </span>
            <span className="header-date">Monday, September 28</span>
          </div>
        </header>
        <div className="dashboard-intro">
          <div>
            <p className="subtext">
              {session.role === "MANAGER"
                ? "Review incoming maintenance requests from your renters."
                : "Send a clear maintenance request to your property owner."}
            </p>
          </div>
          <div className="view-label">
            LIVE OVERVIEW <span>↗</span>
          </div>
        </div>
        {session.role === "CUSTOMER" && (
          <form
            className="panel request-form request-form-wide"
            onSubmit={submitRequest}
          >
            <div className="panel-heading">
              <div>
                <p className="eyebrow">New request</p>
                <h2>What needs attention?</h2>
              </div>
              <span className="request-dot" />
            </div>
            <label>
              Short title
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leaking kitchen tap"
              />
            </label>
            <label>
              Details
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the owner what happened and where."
              />
            </label>
            <div className="form-grid">
              <label>
                Priority
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                  <option>URGENT</option>
                </select>
              </label>
              <label>
                Owner
                <select
                  required
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                >
                  <option value="">Select owner</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.username}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="primary-button" type="submit">
              Send request
            </button>
            {message && <p className="form-message">{message}</p>}
          </form>
        )}
        <div className="stats metrics-grid">
          <div className="metric-card metric-primary">
            <span className="metric-kicker">CURRENT LOAD</span>
            <strong>{metrics?.openRequests ?? 0}</strong>
            <span>Open requests</span>
          </div>
          <div className="metric-card metric-alert">
            <span className="metric-kicker">NEEDS ATTENTION</span>
            <strong>{metrics?.overdue ?? 0}</strong>
            <span>Overdue</span>
          </div>
          <div className="metric-card metric-success">
            <span className="metric-kicker">RESOLVED TO DATE</span>
            <strong>{metrics?.completed ?? 0}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="content-grid dashboard-grid">
          <div className="panel">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Recent work orders</h2>
              </div>
              <span className="panel-count">{requests.length} total</span>
            </div>
            {requests.length === 0 ? (
              <p className="empty">No requests yet.</p>
            ) : (
              <ul className="request-list">
                {requests.map((request) => (
                  <li key={request.id}>
                    <div>
                      <strong>#{request.id}</strong>
                      <span>{request.title}</span>
                      <small>
                        {request.ownerName
                          ? `Owner: ${request.ownerName}`
                          : "Unassigned owner"}
                      </small>
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
          <div className="panel operations-panel">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Performance</p>
                <h2>Operations snapshot</h2>
              </div>
            </div>
            <ul className="mini-stats">
              <li>
                <span>In progress</span>
                <strong>{metrics?.inProgress ?? 0}</strong>
              </li>
              <li>
                <span>Average resolution</span>
                <strong>{metrics?.avgResolutionHours ?? 0}h</strong>
              </li>
              <li>
                <span>Account type</span>
                <strong>
                  {session.role === "MANAGER" ? "Owner" : "Renter"}
                </strong>
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
