import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Submit from "./pages/Submit.jsx";
import IdeaDetail from "./pages/IdeaDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/ideas/:id" element={<IdeaDetail />} />
      </Route>
    </Routes>
  );
}
