// nodes/inputNode.js

import { useState } from "react";
import { useStore } from "../store";
import {
  BaseNode,
  NodeLabel,
  NodeInput,
  NodeSelect,
  FieldRow,
} from "./baseNode";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, "inputName", e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, "inputType", e.target.value);
  };

  return (
    <BaseNode
      nodeType="customInput"
      title="Input"
      outputs={[{ id: `${id}-value`, label: "value" }]}
    >
      <FieldRow>
        <NodeLabel>Name</NodeLabel>
        <NodeInput
          value={currName}
          onChange={handleNameChange}
          placeholder="input_name"
        />
      </FieldRow>
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Type</NodeLabel>
        <NodeSelect
          value={inputType}
          onChange={handleTypeChange}
          options={[
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
          ]}
        />
      </FieldRow>
    </BaseNode>
  );
};
