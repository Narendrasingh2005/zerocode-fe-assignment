import { Navbar } from "./components/navbar";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
  return (
    <>
      <div className=" bg-gradient-to-b from-slate-400 to-gray-800">
        <div>
          <Navbar />
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
