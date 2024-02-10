import React from "react";
import "./styles.scss";

interface HighlightMatchProps {
  text: string;
  searchTerm: string;
}

const HighlightMatch = ({ text, searchTerm }: HighlightMatchProps) => {
  if (!searchTerm) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <strong key={index} className="highlight">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
};

export default HighlightMatch;
