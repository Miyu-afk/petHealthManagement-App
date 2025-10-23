import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./accounts/LogIn";
import PetHealthMain from "./PetHealthMain";

const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/main" element={<PetHealthMain />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;
