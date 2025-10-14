import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./accounts/LogIn";
import PetHealthMain from "./PetHealthMain"

const App: React.FC =() => {
  return(
    <Routes>
      <Route path="/" element={<PetHealthMain />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App;