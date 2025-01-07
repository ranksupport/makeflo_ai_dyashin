import React, { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import "./style.css";
import { useDispatch } from "react-redux";
import { onSettingNode } from "../../store/slices/flowSlice";

export const MentionInput = ({
  data = [],
  value,
  text,
  onChange,
  nodes,
  componentData,
}) => {
  const options = [
    {
      name: "Group 1",
      data: [
        { id: 1, display: "John Doe" },
        { id: 2, display: "Jane Smith" },
      ],
    },
    {
      name: "Group 2",
      data: [
        { id: 3, display: "React" },
        { id: 4, display: "JavaScript" },
      ],
    },
  ];
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    onChange(e);

  };

  const stopEventPropagation = (e) => {
    dispatch(onSettingNode({ ...componentData, focused: "nodrag" }));
    e.stopPropagation();
  };

  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const renderSuggestions = (
    suggestion,
    search,
    highlightedDisplay,
    index,
    focused
  ) => {
    const isGrouped = options.find((group) =>
      group.data.find((item) => item.id === suggestion.id)
    );
    if (isGrouped && collapsedGroups[isGrouped.name]) {
      return null; // Don't render suggestions for collapsed groups
    }
    return (
      <div className={`suggestion ${focused ? "focused" : ""}`}>
        {highlightedDisplay}
      </div>
    );
  };

  const renderSuggestionHeader = (groupName, group) => (
    <div
      key={groupName}
      onClick={() => toggleGroup(groupName)}
      style={{ cursor: "pointer" }}
    >
      {collapsedGroups[groupName] ? "▶" : "▼"} {groupName} ({group.data.length})
    </div>
  );

  return (
    <MentionsInput
      className="mentions"
      singleLine={false}
      allowSuggestionsAboveCursor={false}
      value={value}
      onFocus={stopEventPropagation}
      onBlur={() => {
        dispatch(onSettingNode({ ...componentData, focused: "" }));
      }}
      onChange={handleTextChange}
      placeholder="Enter '@' and select the values"
      customSuggestionsContainer={(children) => <div style={{width: "100%"}}>{children}</div>}
    >
      {/* {options.map((group, i) => ( */}
      <Mention
        // key={i}
        trigger={"@"}
        data={data}
        // renderSuggestion={renderSuggestions}
        markup={"@[__display__](__id__)"}
        className={"mentions__mention"}
        appendSpaceOnAdd
        displayTransform={(id, display) => {
          return data ? `@{${display}}` : "";
        }}
      />
      {/* ))} */}
      {/* <Mention
        trigger="@"
        data={data}
        markup={"@[__display__](__id__)"}
        className={"mentions__mention"}
        appendSpaceOnAdd
        displayTransform={(id, display) => {
          return data ? `@{${display}}` : "";
        }}
        renderSuggestion={(suggestions, search, onFocus, onBlur) => (
          <CustomMentionSuggestions
            suggestions={suggestions}
            // onAddMention={handleAddMention}
          />
        )}
      /> */}
    </MentionsInput>
  );
};
