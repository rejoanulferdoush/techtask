import React, { useEffect, useState } from "react";

const TruncateText = ({ text, length, className = "" }) => {
  const [truncatedText, setTruncatedText] = useState(text);
  useEffect(() => {
    const words = text.split(" ");

    if (words.length > length) {
      const truncatedWords = words.slice(0, length);
      setTruncatedText(truncatedWords.join(" ") + "...");
    } else {
      setTruncatedText(text);
    }
  }, [text, length]);

  return <span className={className}>{truncatedText}</span>;
};

export default TruncateText;
