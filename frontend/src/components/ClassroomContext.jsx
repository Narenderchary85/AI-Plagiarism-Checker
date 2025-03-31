import React, { createContext, useState } from "react";

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classroom, setClassroom] = useState(null);

  return (
    <ClassroomContext.Provider value={{ classroom, setClassroom }}>
      {children}
    </ClassroomContext.Provider>
  );
};