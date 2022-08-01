import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./AppLayout";

const App: React.FC = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
