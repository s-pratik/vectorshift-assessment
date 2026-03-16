// toolbar.js

import { DraggableNode } from "./draggableNode";

const NODE_DEFS = [
  { type: "customInput", label: "Input", accent: "#6EE7B7", icon: "⬇" },
  { type: "customOutput", label: "Output", accent: "#FCA5A5", icon: "⬆" },
  { type: "llm", label: "LLM", accent: "#A78BFA", icon: "🧠" },
  { type: "text", label: "Text", accent: "#60A5FA", icon: "📝" },
  { type: "note", label: "Note", accent: "#FDE68A", icon: "🗒️" },
  { type: "transform", label: "Transform", accent: "#F9A8D4", icon: "⚙️" },
  { type: "filter", label: "Filter", accent: "#FB923C", icon: "🔍" },
  { type: "merge", label: "Merge", accent: "#34D399", icon: "🔀" },
  { type: "api", label: "API", accent: "#38BDF8", icon: "🌐" },
];

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
        borderBottom: "1px solid #1E293B",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Logo/Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginRight: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#F1F5F9",
            letterSpacing: "0.02em",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          VectorShift
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: "#334155" }} />

      {/* Node palette label */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#64748B",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Nodes
      </span>

      {/* Draggable nodes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {NODE_DEFS.map(({ type, label, accent, icon }) => (
          <DraggableNode
            key={type}
            type={type}
            label={label}
            accent={accent}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
};
