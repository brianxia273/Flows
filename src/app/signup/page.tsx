import { SignupForm } from "@/components/signup-form";
import { AuthUserProvider } from "@/components/auth-provider";

export default function LoginPage() {
  return (
    <AuthUserProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-black">
        <div className="w-xl max-w-md md:max-w-3xl px-4">
          <SignupForm />
        </div>
      </div>
    </AuthUserProvider>
  );
}
