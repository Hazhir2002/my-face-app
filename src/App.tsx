import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { loadFaceModels } from "./face-models";
import FaceCapture from "./FaceCapture";
import { Route, Routes } from "react-router-dom";
import ResultsPage from "./ResultsPage";

function App() {
  useEffect(() => {
    loadFaceModels();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<FaceCapture />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}

export default App;
