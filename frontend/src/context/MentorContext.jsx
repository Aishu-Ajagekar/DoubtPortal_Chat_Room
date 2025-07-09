// MentorContext.jsx
import React, { createContext, useState, useContext } from "react";

const MentorContext = createContext();

export const MentorProvider = ({ children }) => {
  const [mentorId, setMentorId] = useState("");

  return (
    <MentorContext.Provider value={{ mentorId, setMentorId }}>
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = () => useContext(MentorContext);
