const useText = () => {
  const truncateText = (text, maxWords) => {
    // Split the text into words
    const words = text.split(" ");

    // Check if the number of words is greater than the maximum allowed
    if (words.length > maxWords) {
      // Slice the array up to the maximum allowed words
      const truncatedWords = words.slice(0, maxWords);

      // Join the words back together and add ellipses
      return truncatedWords.join(" ") + "...";
    }

    // If the number of words is within the limit, return the original text
    return text;
  };
  return [truncateText];
};

export default useText;
