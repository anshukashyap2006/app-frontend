import {ClerkProvider} from '@clerk/clerk-react'
import { Children, useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// Children here are the all the components which will just get change without refresh of Page
// Browser Router tells React change the component whenever URL changes
function ClerkProviderWithRoutes({ children }) {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <BrowserRouter>
            {Children} 
            </BrowserRouter>
        </ClerkProvider>
    )
}

export default ClerkProviderWithRoutes