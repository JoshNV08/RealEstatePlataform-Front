import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contact/>}/>
            <Route path="/sobre-nosotros" element={<About/>}/>
            <Route path="/propiedades" element={<PropertyExplorer/>}/>
            <Route path="/propiedades/:id" element={<PropertyDetail/>}/>
             <Route path="/ingreso" element={<Login/>}/>
             <Route path="/dashboard" element={<DashboardHome/>}/>
             <Route path="/dashboard/nueva-propiedad" element={<NewProperty/>}/>
             <Route path="/dashboard/editar/:id" element={<PropertyEdit/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;