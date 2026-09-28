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
    fetchHealth()
      .then((data) => setHealth(data.status ?? "UP"))
      .catch(() => setHealth("Offline"));
    fetchOwners()
      .then(setOwners)
      .catch(() => setOwners([]));
    if (session) refreshDashboard();
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
      <main className="app-shell auth-shell">
        <section className="auth-card">
          <p className="eyebrow">Maintenance, made human</p>
          <h1>FixFlow</h1>
          <p className="subtext">
            Report a problem, connect it to the right owner, and keep the repair
            moving.
          </p>
          <div className="segmented">
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
              {mode === "login" ? "Enter FixFlow" : "Create account"}
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="top-row">
          <div>
            <p className="eyebrow">FixFlow workspace</p>
            <h1>Good to see you, {session.username}</h1>
          </div>
          <div className="top-actions">
            <span className="status-pill">API: {health}</span>
            <button
              className="quiet-button"
              onClick={() => {
                localStorage.clear();
                setSession(null);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
        <p className="subtext">
          {session.role === "MANAGER"
            ? "Review incoming maintenance requests from your renters."
            : "Send a clear maintenance request to your property owner."}
        </p>
        {session.role === "CUSTOMER" && (
          <form className="panel request-form" onSubmit={submitRequest}>
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
        <div className="stats">
          <div>
            <strong>{metrics?.openRequests ?? 0}</strong>
            <span>Open requests</span>
          </div>
          <div>
            <strong>{metrics?.overdue ?? 0}</strong>
            <span>Overdue</span>
          </div>
          <div>
            <strong>{metrics?.completed ?? 0}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="content-grid">
          <div className="panel">
            <h2>Recent work orders</h2>
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
          <div className="panel">
            <h2>Operations snapshot</h2>
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
