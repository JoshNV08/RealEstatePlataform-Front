import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PropertyExplorer from "./pages/PropertyExplorer";
import PropertyDetail from "./pages/PropertyDetails";
import Login from "./pages/Login"; 
import DashboardHome from "./pages/AdminDashboard/DashboardHome";
import NewProperty from "./pages/AdminDashboard/NewProperty";
import PropertyEdit from "./pages/AdminDashboard/EditProperty";
import Profile from "./pages/AdminDashboard/Profile";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../src/services/firestore";
import ProtectedRoute from "./pages/ProtectedRoute";

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsub;
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/propiedades" element={<PropertyExplorer />} />
            <Route path="/propiedades/:id" element={<PropertyDetail />} />
            <Route path="/ingreso" element={<Login />} />
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/nueva-propiedad" element={<NewProperty currentUser={user} />} />
              <Route path="/dashboard/editar/:id" element={<PropertyEdit />} />
              <Route path="/dashboard/perfil" element={<Profile currentUser={user} />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;