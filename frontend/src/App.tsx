import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import DefaultHeader from './components/defaultHeader-signedout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes> 
        <Route path="/" element={<DefaultHeader />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
      </Routes>
    </Router>
  )
}

export default App
