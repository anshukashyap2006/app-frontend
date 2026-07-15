import { useState } from 'react'
import {Routes,Route,BrowserRouter,Navigate} from "react-router-dom"
import './App.css'
import ClerkProviderWithRoutes from './Auth/ClerkProvider'
import ApiClientProvider from './Components/ApiClientProvider/ApiClientProvider'
import Layout from './Components/Layout'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import SignInPage from './Pages/SignIn'
import SignUpPage from './Pages/SignUp'
import Dashboard from './Components/Dashboard/Dashboard'
import Home from './Pages/Home'



function App() {

  return (
    <ClerkProviderWithRoutes>
      <BrowserRouter>
        <ApiClientProvider>  
          <Routes>
            {/* Public routes wrapped in layout */}
            <Route element={<Layout/>}>
              <Route path ="/" element={<Home/>}/>
              <Route path='/sign-up/*' element={<SignUpPage/>}/>
              <Route path='/sign-in/*' element={<SignInPage/>}/>
            </Route>
            <Route
              path='/dashboard/*' element={
                <>
                  <SignedIn>
                    <Dashboard/>
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" replace/>
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </ApiClientProvider>
      </BrowserRouter>
      
    </ClerkProviderWithRoutes>
  )
}


export default App
