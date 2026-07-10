import axios from "axios";


// API client setup so that we can pass ClerkJWT in the headers for authentication

const apiClient = axios.create(
    {
        baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
        headers: {
            "Content-Type": "application/json",
        },
    }
)

/**
 * 2. This function attaches the Clerk auth context to our Axios instance.
 * Since Clerk hooks only run inside React components, we pass the `getToken`
 * function into this setup routine when the app initializes.
 */
export const setupAxiosInterceptors = (getToken) => {
    // intereceptors method acts as a middleware to modify headers before sending it to server
    apiClient.interceptors.request.use(
        async (config) => {
            try {
                // fetch jwt from clerk
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer : ${token}`;
                }
            } catch (error) {
                console.error("Could not fetch clerk auth token for beckend request header",error)
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    );

    // Global response interceptor to handle errors cleanly
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            // Catch token expirations or missing users globally
            if (error.response?.status === 401) {
            console.warn("Backend rejected token. User might be unauthenticated.");
            }
            return Promise.reject(error);
        }
    );
};


export default apiClient