import React from "react";
import {
  BaseEdge,
  getBezierPath,
} from "reactflow";

export const ButtonEdge = ({
  data,
  selected,
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  animated,
  markerEnd,
}) => {
  // const onEdgeClick = (evt, id) => {
  //   evt.stopPropagation();
  //   dispatch(onLinkDelete({ edge: id, selected: true }));
  // };
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: animated
            ? "#2a9006"
            : selected && !data?.error
            ? "#002B52"
            : selected && data?.error
            ? "#e24328"
            : data?.error
            ? "#fc2b2b"
            : "#0285ff",
          strokeWidth: 3,
          strokeDasharray: animated ? "10" : "none",
        }}
      />
      {/* <EdgeLabelRenderer>
        <Tooltip arrow title="Firstname => Subject">
          <div
            style={{
              visibility: selected ? "visible" : "hidden",
              zIndex: selected ? 1 : -1000,
              opacity: selected ? 1 : 0,
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              transition: "opacity 0.25s, visibility 0.25s",
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button
              className="edgebutton"
              style={{ color: "#fff", fontSize: 20 }}
              onClick={(event) => onEdgeClick(event, id)}
            >
              ×
            </button>
          </div>
        </Tooltip>
      </EdgeLabelRenderer> */}
    </>
  );
};
