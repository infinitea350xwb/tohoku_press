import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Skills } from "./pages/Skills";
import { Projects } from "./pages/Projects";
import { Contact } from "./pages/Contact";
import { News } from "./pages/News";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
