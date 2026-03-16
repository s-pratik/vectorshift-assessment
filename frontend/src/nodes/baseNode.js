// nodes/BaseNode.js
// Core node abstraction — all nodes are built on top of this.

import { Handle, Position } from "reactflow";

const NODE_STYLES = {
  customInput: { accent: "#6EE7B7", bg: "rgba(110,231,183,0.08)", icon: "⬇" },
  customOutput: { accent: "#FCA5A5", bg: "rgba(252,165,165,0.08)", icon: "⬆" },
  llm: { accent: "#A78BFA", bg: "rgba(167,139,250,0.08)", icon: "🧠" },
  text: { accent: "#60A5FA", bg: "rgba(96,165,250,0.08)", icon: "📝" },
  note: { accent: "#FDE68A", bg: "rgba(253,230,138,0.08)", icon: "🗒️" },
  transform: { accent: "#F9A8D4", bg: "rgba(249,168,212,0.08)", icon: "⚙️" },
  filter: { accent: "#FB923C", bg: "rgba(251,146,60,0.08)", icon: "🔍" },
  merge: { accent: "#34D399", bg: "rgba(52,211,153,0.08)", icon: "🔀" },
  api: { accent: "#38BDF8", bg: "rgba(56,189,248,0.08)", icon: "🌐" },
};

const FALLBACK = { accent: "#94A3B8", bg: "rgba(148,163,184,0.08)", icon: "◻" };

/**
 * BaseNode — the single shared template for every node in the pipeline.
 *
 * Props:
 *  nodeType  {string}    — key into NODE_STYLES for colour theming
 *  title     {string}    — shown in the node header
 *  children  {ReactNode} — field controls rendered in the body
 *  inputs    {Array}     — [{ id, label, style? }] left-side target handles
 *  outputs   {Array}     — [{ id, label, style? }] right-side source handles
 *  width     {number}    — card width  (default 220)
 *  minHeight {number}    — card min-height (default 90)
 */
export const BaseNode = ({
  nodeType = "text",
  title,
  children,
  inputs = [],
  outputs = [],
  width = 220,
  minHeight = 90,
}) => {
  const { accent, bg, icon } = NODE_STYLES[nodeType] ?? FALLBACK;

  return (
    <div
      style={{
        width,
        minHeight,
        background: "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
        border: `1.5px solid ${accent}55`,
        borderRadius: 12,
        boxShadow: `0 0 0 1px ${accent}22, 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 ${accent}22`,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Coloured accent bar at top */}
      <div
        style={{
          height: 3,
          borderRadius: "12px 12px 0 0",
          background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px 6px",
          background: bg,
          borderBottom: `1px solid ${accent}22`,
        }}
      >
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "10px 12px 12px" }}>{children}</div>

      {/* Left — target handles */}
      {inputs.map(({ id, label, style: extraStyle = {} }, i) => {
        const top =
          inputs.length === 1
            ? "50%"
            : `${((i + 1) / (inputs.length + 1)) * 100}%`;

        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: -10,
              top,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Handle
              type="target"
              position={Position.Left}
              id={id}
              style={{
                position: "relative",
                top: "unset",
                left: "unset",
                transform: "none",
                width: 10,
                height: 10,
                background: accent,
                border: "2px solid #0F172A",
                borderRadius: "50%",
                flexShrink: 0,
                ...extraStyle,
              }}
            />
            {label && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 9,
                  color: "#94A3B8",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}

      {/* Right — source handles */}
      {outputs.map(({ id, label, style: extraStyle = {} }, i) => {
        const top =
          outputs.length === 1
            ? "50%"
            : `${((i + 1) / (outputs.length + 1)) * 100}%`;

        return (
          <div
            key={id}
            style={{
              position: "absolute",
              right: -10,
              top,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            <Handle
              type="source"
              position={Position.Right}
              id={id}
              style={{
                position: "relative",
                top: "unset",
                right: "unset",
                transform: "none",
                width: 10,
                height: 10,
                background: accent,
                border: "2px solid #0F172A",
                borderRadius: "50%",
                flexShrink: 0,
                ...extraStyle,
              }}
            />
            {label && (
              <span
                style={{
                  marginRight: 6,
                  fontSize: 9,
                  color: "#94A3B8",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Shared form primitives ── */

export const NodeLabel = ({ children }) => (
  <span
    style={{
      display: "block",
      fontSize: 10,
      fontWeight: 600,
      color: "#64748B",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 3,
    }}
  >
    {children}
  </span>
);

export const NodeInput = ({ value, onChange, placeholder, style = {} }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: "#0F172A",
      border: "1px solid #334155",
      borderRadius: 6,
      padding: "4px 8px",
      fontSize: 12,
      color: "#E2E8F0",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#60A5FA")}
    onBlur={(e) => (e.target.style.borderColor = "#334155")}
  />
);

export const NodeSelect = ({ value, onChange, options, style = {} }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      background: "#0F172A",
      border: "1px solid #334155",
      borderRadius: 6,
      padding: "4px 8px",
      fontSize: 12,
      color: "#E2E8F0",
      outline: "none",
      cursor: "pointer",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {options.map(({ value: v, label }) => (
      <option key={v} value={v}>
        {label}
      </option>
    ))}
  </select>
);

export const NodeTextarea = ({ value, onChange, placeholder, style = {} }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: "#0F172A",
      border: "1px solid #334155",
      borderRadius: 6,
      padding: "4px 8px",
      fontSize: 12,
      color: "#E2E8F0",
      outline: "none",
      resize: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
      transition: "border-color 0.15s",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#60A5FA")}
    onBlur={(e) => (e.target.style.borderColor = "#334155")}
  />
);

export const FieldRow = ({ children, style = {} }) => (
  <div style={{ marginBottom: 8, ...style }}>{children}</div>
);
