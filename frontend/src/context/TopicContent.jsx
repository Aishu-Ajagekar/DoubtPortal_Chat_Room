// TopicContext.jsx
import React, { createContext, useState, useContext } from "react";

const TopicContext = createContext();

export const TopicProvider = ({ children }) => {
  const [topicId, setTopicId] = useState("");

  return (
    <TopicContext.Provider value={{ topicId, setTopicId }}>
      {children}
    </TopicContext.Provider>
  );
};

export const useTopic = () => useContext(TopicContext);
