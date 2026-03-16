// draggableNode.js

export const DraggableNode = ({
  type,
  label,
  accent = "#60A5FA",
  icon = "◻",
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType }),
    );
    event.dataTransfer.effectAllowed = "move";
    event.target.style.opacity = "0.7";
  };

  return (
    <div
      className={type}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => {
        e.target.style.opacity = "1";
        e.target.style.cursor = "grab";
      }}
      draggable
      title={`Drag to add ${label} node`}
      style={{
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "6px 12px",
        borderRadius: 8,
        background: "#1E293B",
        border: `1px solid ${accent}44`,
        minWidth: 68,
        transition: "all 0.15s ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${accent}18`;
        e.currentTarget.style.borderColor = `${accent}88`;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${accent}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#1E293B";
        e.currentTarget.style.borderColor = `${accent}44`;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#CBD5E1",
          letterSpacing: "0.04em",
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};
