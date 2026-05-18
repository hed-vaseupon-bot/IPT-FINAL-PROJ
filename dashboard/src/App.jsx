import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Location from "./pages/location";
import Login from "./pages/loginpage";
import AdminDashboard from "./pages/admin";
import Navbar from "./pages/navbar";

function App() {
  // Check if user data exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;