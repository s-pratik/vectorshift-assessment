// nodes/outputNode.js

import { useState } from "react";
import { useStore } from "../store";
import {
  BaseNode,
  NodeLabel,
  NodeInput,
  NodeSelect,
  FieldRow,
} from "./baseNode";

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, "outputName", e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, "outputType", e.target.value);
  };

  return (
    <BaseNode
      nodeType="customOutput"
      title="Output"
      inputs={[{ id: `${id}-value`, label: "value" }]}
    >
      <FieldRow>
        <NodeLabel>Name</NodeLabel>
        <NodeInput
          value={currName}
          onChange={handleNameChange}
          placeholder="output_name"
        />
      </FieldRow>
      <FieldRow style={{ marginBottom: 0 }}>
        <NodeLabel>Type</NodeLabel>
        <NodeSelect
          value={outputType}
          onChange={handleTypeChange}
          options={[
            { value: "Text", label: "Text" },
            { value: "Image", label: "Image" },
          ]}
        />
      </FieldRow>
    </BaseNode>
  );
};
