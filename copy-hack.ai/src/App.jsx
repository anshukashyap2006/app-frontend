import { useState, useEffect, useRef } from 'react'
import {Routes, Route, BrowserRouter, Navigate, useLocation} from "react-router-dom"
import './App.css'
import ClerkProviderWithRoutes from './Auth/ClerkProvider'
import ApiClientProvider from './Components/ApiClientProvider/ApiClientProvider'
import Layout from './Components/Layout'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import SignInPage from './Pages/SignIn'
import SignUpPage from './Pages/SignUp'
import Dashboard from './Components/Dashboard/Dashboard'
import Home from './Pages/Home'
import PageLoader from './Components/PageLoader'

function RouteTransitionLoader({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip artificial loader on initial page load since ApiClientProvider already handles it
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
}

function App() {

  return (
    <ClerkProviderWithRoutes>
      <BrowserRouter>
        <ApiClientProvider>  
          <RouteTransitionLoader>
            <Routes>
              {/* Public routes wrapped in layout */}
              <Route element={<Layout/>}>
                <Route path ="/" element={<Home/>}/>
              </Route>

              {/* Auth routes without layout (no header/footer) */}
              <Route path='/sign-up/*' element={<SignUpPage/>}/>
              <Route path='/sign-in/*' element={<SignInPage/>}/>
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
          </RouteTransitionLoader>
        </ApiClientProvider>
      </BrowserRouter>
      
    </ClerkProviderWithRoutes>
  )
}


export default App
