// nodes/customNodes.js
// Five new nodes built with the BaseNode abstraction

import { useState } from "react";
import { useStore } from "../store";
import {
  BaseNode,
  NodeLabel,
  NodeInput,
  NodeSelect,
  NodeTextarea,
  FieldRow,
} from "./baseNode";

/* ─── 1. Note Node ──────────────────────────────────────────────
   Sticky-note annotation — no handles, just a comment area.
─────────────────────────────────────────────────────────────── */
export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [note, setNote] = useState(data?.note || "Add a comment...");

  const handleChange = (e) => {
    setNote(e.target.value);
    updateNodeField(id, "note", e.target.value);
  };

  return (
    <BaseNode nodeType="note" title="Note" width={200}>
      <NodeTextarea
        value={note}
        onChange={handleChange}
        placeholder="Write a note..."
        style={{ height: 70 }}
      />
    </BaseNode>
  );
};

/* ─── 2. Transform Node ─────────────────────────────────────────
   Applies a string/data transformation to its input.
─────────────────────────────────────────────────────────────── */
export const TransformNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [operation, setOperation] = useState(data?.operation || "uppercase");

  const handleChange = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, "operation", e.target.value);
  };

  return (
    <BaseNode
      nodeType="transform"
      title="Transform"
      inputs={[{ id: `${id}-in`, label: "input" }]}
      outputs={[{ id: `${id}-out`, label: "output" }]}
    >
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Operation</NodeLabel>
        <NodeSelect
          value={operation}
          onChange={handleChange}
          options={[
            { value: "uppercase", label: "UPPERCASE" },
            { value: "lowercase", label: "lowercase" },
            { value: "trim", label: "Trim whitespace" },
            { value: "reverse", label: "Reverse string" },
            { value: "json_parse", label: "JSON Parse" },
            { value: "json_stringify", label: "JSON Stringify" },
          ]}
        />
      </FieldRow>
    </BaseNode>
  );
};

/* ─── 3. Filter Node ────────────────────────────────────────────
   Routes data to pass/fail based on a condition.
─────────────────────────────────────────────────────────────── */
export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(
    data?.condition || "value.length > 0",
  );

  const handleChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, "condition", e.target.value);
  };

  return (
    <BaseNode
      nodeType="filter"
      title="Filter"
      inputs={[{ id: `${id}-in`, label: "input" }]}
      outputs={[
        { id: `${id}-pass`, label: "pass ✓" },
        { id: `${id}-fail`, label: "fail ✗" },
      ]}
    >
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Condition</NodeLabel>
        <NodeInput
          value={condition}
          onChange={handleChange}
          placeholder="e.g. value.length > 0"
        />
      </FieldRow>
    </BaseNode>
  );
};

/* ─── 4. Merge Node ─────────────────────────────────────────────
   Combines 2–5 inputs into one output with a separator.
─────────────────────────────────────────────────────────────── */
export const MergeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [separator, setSeparator] = useState(data?.separator || "\\n");
  const [count, setCount] = useState(data?.count || 2);

  const handleSepChange = (e) => {
    setSeparator(e.target.value);
    updateNodeField(id, "separator", e.target.value);
  };

  const handleCountChange = (e) => {
    setCount(Number(e.target.value));
    updateNodeField(id, "count", Number(e.target.value));
  };

  const inputs = Array.from(
    { length: Math.min(Math.max(Number(count), 2), 5) },
    (_, i) => ({ id: `${id}-in${i + 1}`, label: `input ${i + 1}` }),
  );

  return (
    <BaseNode
      nodeType="merge"
      title="Merge"
      inputs={inputs}
      outputs={[{ id: `${id}-out`, label: "merged" }]}
      minHeight={110}
    >
      <FieldRow>
        <NodeLabel>Inputs</NodeLabel>
        <NodeSelect
          value={count}
          onChange={handleCountChange}
          options={[2, 3, 4, 5].map((n) => ({
            value: n,
            label: `${n} inputs`,
          }))}
        />
      </FieldRow>
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Separator</NodeLabel>
        <NodeInput
          value={separator}
          onChange={handleSepChange}
          placeholder="\n or , or space"
        />
      </FieldRow>
    </BaseNode>
  );
};

/* ─── 5. API Request Node ───────────────────────────────────────
   Makes an HTTP request to an external endpoint.
─────────────────────────────────────────────────────────────── */
export const ApiNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [url, setUrl] = useState(data?.url || "https://api.example.com/");
  const [method, setMethod] = useState(data?.method || "GET");

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    updateNodeField(id, "url", e.target.value);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, "method", e.target.value);
  };

  return (
    <BaseNode
      nodeType="api"
      title="API Request"
      width={240}
      inputs={[
        { id: `${id}-body`, label: "body" },
        { id: `${id}-headers`, label: "headers" },
      ]}
      outputs={[
        { id: `${id}-response`, label: "response" },
        { id: `${id}-error`, label: "error" },
      ]}
    >
      <FieldRow>
        <NodeLabel>Method</NodeLabel>
        <NodeSelect
          value={method}
          onChange={handleMethodChange}
          options={["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => ({
            value: m,
            label: m,
          }))}
        />
      </FieldRow>
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>URL</NodeLabel>
        <NodeInput
          value={url}
          onChange={handleUrlChange}
          placeholder="https://..."
        />
      </FieldRow>
    </BaseNode>
  );
};
