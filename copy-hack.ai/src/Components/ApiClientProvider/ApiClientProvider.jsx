import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from '../../Api/api';

export default function ApiClientProvider({ children }) {
    const { getToken, isLoaded } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            setupAxiosInterceptors(getToken);
            setIsReady(true);
        }
    }, [isLoaded, getToken]);

    if (!isLoaded || !isReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium animate-pulse">
                    Securing CopyCraft workspace...
                </p>
            </div>
        );
    }

    return children;
}