import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import './App.css'
import ClerkProviderWithRoutes from './Auth/ClerkProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ClerkProviderWithRoutes>
      <Routes>
      </Routes>
    </ClerkProviderWithRoutes>
  )
}

export default App
