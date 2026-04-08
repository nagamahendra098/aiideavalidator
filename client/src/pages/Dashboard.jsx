import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchIdeas, deleteIdea } from "../hooks/useApi.js";
import "./Dashboard.css";

function RiskBadge({ level }) {
  const map = { Low: "badge-green", Medium: "badge-amber", High: "badge-red" };
  return level ? <span className={`badge ${map[level] || ""}`}>{level} Risk</span> : null;
}

function ScoreRing({ score }) {
  if (score == null) return null;
  const color = score >= 70 ? "var(--green-soft)" : score >= 40 ? "var(--amber)" : "var(--red-soft)";
  return (
    <div className="score-ring" style={{ "--score-color": color }}>
      <span className="score-num">{score}</span>
      <span className="score-label">/ 100</span>
    </div>
  );
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      const hasAnalyzing = ideas.some((i) => i.status === "analyzing");
      if (hasAnalyzing) load();
    }, 4000);
    return () => clearInterval(interval);
  }, [ideas.length]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Remove this idea?")) return;
    await deleteIdea(id);
    setIdeas((prev) => prev.filter((i) => i._id !== id));
  };

  if (loading) return <div className="state-msg">Loading your ideas…</div>;
  if (error) return <div className="state-msg error">{error}</div>;

  if (ideas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✦</div>
        <h2>No ideas yet</h2>
        <p>Submit your first startup idea and get an AI-powered validation report.</p>
        <Link to="/submit" className="btn-primary">Start with an idea</Link>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Your Ideas</h1>
          <p className="subtitle">{ideas.length} idea{ideas.length !== 1 ? "s" : ""} validated</p>
        </div>
        <Link to="/submit" className="btn-primary">+ New Idea</Link>
      </div>

      <div className="ideas-grid">
        {ideas.map((idea) => (
          <Link to={`/ideas/${idea._id}`} key={idea._id} className="idea-card">
            <div className="card-top">
              <div className="card-status">
                {idea.status === "analyzing" && <span className="dot dot-pulse" />}
                {idea.status === "done" && <span className="dot dot-green" />}
                {idea.status === "error" && <span className="dot dot-red" />}
                <span className="status-text">{idea.status === "analyzing" ? "Analyzing…" : idea.status === "done" ? "Done" : "Error"}</span>
              </div>
              <button className="delete-btn" onClick={(e) => handleDelete(e, idea._id)} title="Delete">✕</button>
            </div>

            <h2 className="card-title">{idea.title}</h2>
            <p className="card-desc">{idea.description.slice(0, 110)}{idea.description.length > 110 ? "…" : ""}</p>

            {idea.status === "done" && idea.report && (
              <div className="card-meta">
                <RiskBadge level={idea.report.riskLevel} />
                <ScoreRing score={idea.report.profitabilityScore} />
              </div>
            )}

            <div className="card-date">
              {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
