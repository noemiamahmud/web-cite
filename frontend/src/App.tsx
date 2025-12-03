import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import DefaultHeader from './components/defaultHeader-signedout'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     

      <DefaultHeader />
      
    </>
  )
}

export default App
