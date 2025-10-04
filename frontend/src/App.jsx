import HomePage from "./components/HomePage";
import FindBus from "./components/FindBus";
import Navbar from "./components/Navbar";
import LanguageSelector from "./components/Language.jsx";
import { Routes, Route } from "react-router-dom";
import Sos from "./components/Sos.jsx";
import AdminDashboard from "./components/Dashboard.jsx";
import Assistant from "./components/Assistant.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/findbus" element={<FindBus />} />
        <Route path="/language" element={<LanguageSelector />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="/voice" element={<Assistant />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
