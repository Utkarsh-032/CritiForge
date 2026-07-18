import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CodeReview from "./pages/CodeReview";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Mentor from "./pages/Mentor";
import WebsiteReview from "./pages/WebsiteReview";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/website-review" element={<WebsiteReview />} />
        <Route path="/code-review" element={<CodeReview />} />
        <Route path="/ai-mentor" element={<Mentor />} />
      </Route>
    </Routes>
  );
}
