import { SignIn } from "@clerk/clerk-react";



function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <SignIn
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            />
        </div>
    )
}


export default SignInPage