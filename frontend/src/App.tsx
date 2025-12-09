// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "reactflow/dist/style.css";

import Navbar from "./components/NavBar";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Web from "./pages/Web";
import MyWebs from "./pages/MyWebs";
import Profile from "./pages/profile";
import ArticleView from "./pages/ViewArticle";

function App() {
  return (
    <Router>
      {/* ✅ Global header that switches based on login state */}
      <Navbar />

      {/* ✅ Page routes */}
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/web/:webId" element={<Web />} />
        <Route path="/my-webs" element={<MyWebs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/article/:pmid" element={<ArticleView />} />
      </Routes>
    </Router>
  );
}

export default App;
