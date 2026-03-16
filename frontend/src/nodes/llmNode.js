// nodes/llmNode.js

import { useState } from "react";
import { useStore } from "../store";
import { BaseNode, NodeLabel, NodeSelect, FieldRow } from "./baseNode";

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [model, setModel] = useState(data?.model || "gpt-4o");

  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateNodeField(id, "model", e.target.value);
  };

  return (
    <BaseNode
      nodeType="llm"
      title="LLM"
      inputs={[
        { id: `${id}-system`, label: "system" },
        { id: `${id}-prompt`, label: "prompt" },
      ]}
      outputs={[{ id: `${id}-response`, label: "response" }]}
    >
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Model</NodeLabel>
        <NodeSelect
          value={model}
          onChange={handleModelChange}
          options={[
            { value: "gpt-4o", label: "GPT-4o" },
            { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
            { value: "claude-3-opus", label: "Claude 3 Opus" },
            { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
          ]}
        />
      </FieldRow>
    </BaseNode>
  );
};
