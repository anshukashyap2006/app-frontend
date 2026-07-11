import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from '../../Api/api';

export default function ApiClientProvider({ children }) {
    // 1. We are safely inside a React component, so we can use Clerk's hook!
    const { getToken, isLoaded } = useAuth();

    useEffect(() => {
        // 2. Wait until Clerk is fully initialized
        if (isLoaded) {
        // 3. Pass the token-fetching function into our vanilla JavaScript Axios setup
        setupAxiosInterceptors(getToken);
        }
    }, [isLoaded, getToken]);

    // Optional: Prevent the rest of the app from rendering until the interceptor is ready
    if (!isLoaded) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-gray-500 font-medium animate-pulse">
            Securing CopyCraft workspace...
            </p>
        </div>
        );
    }

    // 4. Render whatever is wrapped inside this provider (your App routes)
    //children represents your entire React Router setup.
    return children;

}