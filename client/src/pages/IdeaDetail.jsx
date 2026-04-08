import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchIdea, deleteIdea } from "../hooks/useApi.js";
import "./IdeaDetail.css";

function RiskBadge({ level }) {
  const map = { Low: "badge-green", Medium: "badge-amber", High: "badge-red" };
  return level ? <span className={`badge ${map[level] || ""}`}>{level} Risk</span> : null;
}

function Section({ label, children }) {
  return (
    <div className="report-section">
      <h3 className="section-label">{label}</h3>
      <div className="section-body">{children}</div>
    </div>
  );
}

function TagList({ items }) {
  return (
    <div className="tag-list">
      {items.map((item, i) => (
        <span key={i} className="tag">{item}</span>
      ))}
    </div>
  );
}

export default function IdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await fetchIdea(id);
      setIdea(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Poll while analyzing
  useEffect(() => {
    if (!idea || idea.status !== "analyzing") return;
    const interval = setInterval(load, 3500);
    return () => clearInterval(interval);
  }, [idea?.status]);

  const handleDelete = async () => {
    if (!confirm("Delete this idea permanently?")) return;
    await deleteIdea(id);
    navigate("/");
  };

  if (loading) return <div className="state-msg">Loading…</div>;
  if (error) return <div className="state-msg error">{error}</div>;
  if (!idea) return null;

  const r = idea.report;

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <Link to="/" className="back-link">← All ideas</Link>
        <button className="delete-text-btn" onClick={handleDelete}>Delete</button>
      </div>

      <div className="detail-header">
        <div className="detail-status">
          {idea.status === "analyzing" && <><span className="dot dot-pulse" /> <span className="status-text">Analyzing…</span></>}
          {idea.status === "done" && <><span className="dot dot-green" /> <span className="status-text">Analysis complete</span></>}
          {idea.status === "error" && <><span className="dot dot-red" /> <span className="status-text">Analysis failed</span></>}
        </div>
        <h1>{idea.title}</h1>
        <p className="detail-description">{idea.description}</p>
        <p className="detail-date">
          {new Date(idea.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {idea.status === "analyzing" && (
        <div className="analyzing-state">
          <div className="analyze-spinner" />
          <p>Claude is reading your idea and generating a full report. This usually takes 15–30 seconds.</p>
        </div>
      )}

      {idea.status === "error" && (
        <div className="error-state">
          <p>Something went wrong during analysis. Please try submitting your idea again.</p>
          <Link to="/submit" className="btn-primary">Try again</Link>
        </div>
      )}

      {idea.status === "done" && r && (
        <div className="report">
          <div className="report-top">
            <div className="score-block">
              <span className="score-big" style={{
                color: r.profitabilityScore >= 70 ? "var(--green-soft)" : r.profitabilityScore >= 40 ? "var(--amber)" : "var(--red-soft)"
              }}>
                {r.profitabilityScore}
              </span>
              <span className="score-denom">/100</span>
              <span className="score-desc">Profitability Score</span>
            </div>
            <RiskBadge level={r.riskLevel} />
          </div>

          <Section label="Problem">
            <p>{r.problemSummary}</p>
          </Section>

          <Section label="Customer">
            <p>{r.customerPersona}</p>
          </Section>

          <Section label="Market">
            <p>{r.marketOverview}</p>
          </Section>

          <Section label="Competitors">
            <TagList items={r.competitors || []} />
          </Section>

          <Section label="Suggested Tech Stack">
            <TagList items={r.techStack || []} />
          </Section>

          <Section label="Overall Assessment">
            <p className="full-analysis">{r.fullAnalysis}</p>
          </Section>
        </div>
      )}
    </div>
  );
}
