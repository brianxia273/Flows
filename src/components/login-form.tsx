"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./styles.css";
import { BsSoundwave } from "react-icons/bs";
import { useRouter } from "next/navigation";
import LoginButton from "./loginButton";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/clientApp";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignupClick = () => {
    router.push("/signup");
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="login-text">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <div
              className="home-text logo-text pr-10 mb-5"
              style={{ color: "#0e1111", fontSize: "2.5rem" }}
            >
              Fl
              <BsSoundwave
                style={{
                  fontSize: "2.5rem",
                  color: "#0e1111",
                  verticalAlign: "middle",
                  display: "inline-block",
                }}
              />
              ws
            </div>
          </CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <LoginButton />
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  onClick={handleSignupClick}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
