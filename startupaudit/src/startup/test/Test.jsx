// import React from "react";
// import useCounter from "../components/Hooks/counter";
// function Test() {
//   const { count, increase, decrease } = useCounter(0); // Start the counter at 0

//   return (
//     <div style={{ textAlign: "center", margin: "20px" }}>
//       <h1>Counter: {count}</h1>
//       <div>
//         <button
//           onClick={increase}
//           style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
//         >
//           Increase
//         </button>
//         <button
//           onClick={decrease}
//           style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
//         >
//           Decrease
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Test;
import React, { useCallback, useRef, useState } from "react";
import ReactTags from "react-tag-autocomplete";

function TagComponent({ tag, removeButtonText, onDelete }) {
  return (
    <button
      type="button"
      title={`${removeButtonText}: ${tag.name}`}
      onClick={onDelete}
      style={{
        margin: "5px",
        padding: "5px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
      }}
    >
      {tag.name} &times;
    </button>
  );
}

function SuggestionComponent({ item }) {
  return (
    <div style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
      {item.name}
    </div>
  );
}

function Test() {
  // State for managing auditees tags
  const [auditees, setAuditees] = useState([]);

  // State for managing suggestions
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Johnson" },
    { id: 4, name: "Emily Davis" },
    { id: 5, name: "David Brown" },
    { id: 6, name: "Sarah Wilson" },
  ]);

  const reactTags = useRef();

  const onDelete = useCallback(
    (tagIndex) => {
      setAuditees(auditees.filter((_, i) => i !== tagIndex));
    },
    [auditees]
  );

  const onAddition = useCallback(
    (newTag) => {
      setAuditees([...auditees, newTag]);
    },
    [auditees]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Auditees:", auditees);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="auditees">Auditees:</label>
        <ReactTags
          ref={reactTags}
          tags={auditees}
          suggestions={suggestions}
          onDelete={onDelete}
          onAddition={onAddition}
          allowNew={true} // Enable adding new tags
          allowBackspace={true} // Enable backspace to delete
          tagComponent={TagComponent} // Custom tag component
          suggestionComponent={SuggestionComponent} // Custom suggestion component
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Test;
