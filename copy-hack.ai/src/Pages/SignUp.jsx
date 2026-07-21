import {SignUp} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#09090b] relative overflow-hidden p-4">
            {/* Subtle green ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#BFFF00]/10 via-[#09090b]/0 to-transparent blur-[120px] rounded-[100%] pointer-events-none"></div>

            <div className="relative z-10">
                <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: '#BFFF00',
                            colorBackground: '#18181B',
                            colorInputBackground: '#27272A',
                        }
                    }}
                />
            </div>
        </div>
    )
}


export default SignUpPage