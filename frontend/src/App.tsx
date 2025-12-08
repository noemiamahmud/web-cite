import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import DefaultHeader from './components/defaultHeader-signedout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css' 
import Search from './pages/Search';
import Web from './pages/Web';
import ArticleView from './pages/ArticleView';

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div> 
      <Router>
        <DefaultHeader/>
        <Routes> 
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/web/:pmid" element={<Web />} />
          <Route path="/article/:pmid" element={<ArticleView />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
