// submit.js
// Part 4: sends nodes/edges to /pipelines/parse and shows a styled result modal

import { useState } from "react";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

// ── Modal component ─────────────────────────────────────────────────────────
const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const { num_nodes, num_edges, is_dag } = result;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1E293B, #0F172A)",
          border: "1.5px solid #334155",
          borderRadius: 16,
          padding: "32px 36px",
          minWidth: 340,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Pipeline Analysis
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>
            Results
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <StatCard label="Nodes" value={num_nodes} color="#6EE7B7" />
          <StatCard label="Edges" value={num_edges} color="#60A5FA" />
        </div>

        {/* DAG status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 10,
            background: is_dag
              ? "rgba(110,231,183,0.1)"
              : "rgba(252,165,165,0.1)",
            border: `1px solid ${is_dag ? "#6EE7B766" : "#FCA5A566"}`,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 20 }}>{is_dag ? "✅" : "⚠️"}</span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: is_dag ? "#6EE7B7" : "#FCA5A5",
              }}
            >
              {is_dag ? "Valid DAG" : "Contains Cycles"}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
              {is_dag
                ? "Pipeline has no cycles — ready to execute."
                : "Pipeline contains cycles and cannot be executed."}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.03em",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div
    style={{
      flex: 1,
      background: "#0F172A",
      border: `1px solid ${color}44`,
      borderRadius: 10,
      padding: "12px 16px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div
      style={{
        fontSize: 11,
        color: "#64748B",
        marginTop: 2,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </div>
  </div>
);

// ── ErrorToast ───────────────────────────────────────────────────────────────
const ErrorToast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#450a0a",
        border: "1px solid #991b1b",
        color: "#FCA5A5",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        zIndex: 9999,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      ⚠️ {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: 12,
          background: "none",
          border: "none",
          color: "#FCA5A5",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ×
      </button>
    </div>
  );
};

// ── SubmitButton ─────────────────────────────────────────────────────────────
export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setError("Add at least one node before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "11px 36px",
            borderRadius: 10,
            border: "none",
            background: loading
              ? "#334155"
              : "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
            color: loading ? "#64748B" : "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.45)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
        >
          {loading ? "⏳ Analyzing…" : "⚡ Submit Pipeline"}
        </button>
      </div>

      <ResultModal result={result} onClose={() => setResult(null)} />
      <ErrorToast message={error} onClose={() => setError(null)} />
    </>
  );
};
