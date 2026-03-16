// nodes/textNode.js
// Part 3: auto-resize width+height, dynamic {{variable}} handles

import { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";
import { BaseNode, NodeLabel, FieldRow } from "./baseNode";

// Matches valid JS variable names wrapped in {{ }}
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = [];
  const seen = new Set();
  let match;
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push(name);
    }
  }
  return vars;
};

const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const ACCENT = "#60A5FA";

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState(() =>
    extractVariables(data?.text || "{{input}}"),
  );
  const [nodeWidth, setNodeWidth] = useState(MIN_WIDTH);
  const [textareaHeight, setTextareaHeight] = useState(54);

  const textareaRef = useRef(null);

  // Auto-grow height whenever text changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    setTextareaHeight(Math.max(el.scrollHeight, 54));
  }, [currText]);

  // Auto-grow width based on longest line
  useEffect(() => {
    const lines = currText.split("\n");
    const longest = Math.max(...lines.map((l) => l.length), 10);
    setNodeWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longest * 7.5 + 48)));
  }, [currText]);

  const handleChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    setVariables(extractVariables(val));
    updateNodeField(id, "text", val);
  };

  // Header height (accent bar 3px + header padding ~36px) + body top padding 10px
  const HEADER_HEIGHT = 49;
  const BODY_PADDING_TOP = 10;
  const LABEL_HEIGHT = 18; // NodeLabel line

  // Total height of content above the textarea
  const aboveTextarea = HEADER_HEIGHT + BODY_PADDING_TOP + LABEL_HEIGHT;

  return (
    // We use position:relative on a wrapper so variable handles can be
    // absolutely positioned relative to the whole node card accurately.
    <div style={{ position: "relative" }}>
      <BaseNode
        nodeType="text"
        title="Text"
        width={nodeWidth}
        outputs={[{ id: `${id}-output`, label: "output" }]}
      >
        <FieldRow style={{ marginBottom: 0 }}>
          <NodeLabel>Content</NodeLabel>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleChange}
            rows={2}
            placeholder="Type text or use {{variable}}"
            style={{
              width: "100%",
              height: textareaHeight,
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 6,
              padding: "5px 8px",
              fontSize: 12,
              color: "#E2E8F0",
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              fontFamily: "'DM Mono', 'Fira Mono', monospace",
              lineHeight: 1.6,
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = ACCENT)}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />
        </FieldRow>
      </BaseNode>

      {/* Variable handles — positioned relative to the wrapper div */}
      {variables.map((varName, i) => {
        // Spread handles evenly across the textarea's vertical space
        const spacing = textareaHeight / (variables.length + 1);
        const topOffset = aboveTextarea + spacing * (i + 1);

        return (
          <div
            key={varName}
            style={{
              position: "absolute",
              left: 0,
              top: topOffset,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-var-${varName}`}
              style={{
                position: "relative",
                left: -4,
                top: "unset",
                transform: "none",
                width: 10,
                height: 10,
                background: ACCENT,
                border: "2px solid #0F172A",
                borderRadius: "50%",
                pointerEvents: "all",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                marginLeft: 6,
                fontSize: 9,
                color: "#94A3B8",
                whiteSpace: "nowrap",
                background: "#1E293B",
                borderRadius: 3,
                padding: "1px 5px",
                border: "1px solid #334155",
                pointerEvents: "none",
              }}
            >
              {varName}
            </span>
          </div>
        );
      })}
    </div>
  );
};
