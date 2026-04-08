import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitIdea } from "../hooks/useApi.js";
import "./Submit.css";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const idea = await submitIdea({ title: title.trim(), description: description.trim() });
      navigate(`/ideas/${idea._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const charLimit = 1000;
  const remaining = charLimit - description.length;

  return (
    <div className="submit-page">
      <div className="submit-intro">
        <h1>What's the idea?</h1>
        <p>Describe it plainly. The more specific you are, the better the analysis.</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Idea title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. AI-powered meal planning for busy parents"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="description">
            Description
            <span className={`char-count ${remaining < 50 ? "warn" : ""}`}>{remaining} left</span>
          </label>
          <textarea
            id="description"
            placeholder="Explain the problem, who it's for, and how your idea solves it. Include any unique angle or insight you have."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={charLimit}
            rows={7}
            required
            disabled={loading}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-footer">
          <p className="form-hint">Analysis takes 15–30 seconds using Claude AI.</p>
          <button type="submit" className="btn-submit" disabled={loading || !title.trim() || !description.trim()}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Analyzing…
              </span>
            ) : (
              "Validate Idea ✦"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
