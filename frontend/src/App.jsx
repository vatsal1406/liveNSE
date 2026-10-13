import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NewsDetails from "./pages/NewsDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news/:id" element={<NewsDetails />} />
    </Routes>
  );
}