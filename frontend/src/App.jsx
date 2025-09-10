import HomePage from "./components/HomePage";
import FindBus from "./components/FindBus";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/findbus" element={<FindBus />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
