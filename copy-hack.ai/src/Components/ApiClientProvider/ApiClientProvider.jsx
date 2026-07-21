import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from '../../Api/api';

import PageLoader from '../PageLoader';

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
        return <PageLoader />;
    }

    return children;
}