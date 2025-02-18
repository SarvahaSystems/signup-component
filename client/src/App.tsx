import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
        </Router>
    );
};

export default App;
