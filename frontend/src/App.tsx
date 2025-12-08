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
import Profile from './pages/profile';

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
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
