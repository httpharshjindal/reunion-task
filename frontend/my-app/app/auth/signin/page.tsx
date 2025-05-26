"use client";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupResponse } from "@/lib/types";
import LoadingComponent from "@/components/ui/LoadingComponent";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const router = useRouter();
  const sendRequest = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email.trim());
    const passwordValid = password.trim() !== "" && password.length >= 8;
    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);

    if (emailValid && passwordValid) {
      setLoading(true);
      setError(null);
      axios
        .post<SignupResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signin`,
          {
            email: email,
            password: password,
          }
        )
        .then((res) => {
          console.log(res);
          if (res.status >= 200 && res.status < 300) {
            setLoading(false);
          }
          if (res.data.token) {
            localStorage.setItem("token", `Bearer ${res.data.token}`);
            router.push("/tasks");
          }
        })
        .catch((err) => {
          console.error("Error occurred:", err.response?.data || err.message);
          setError(
            err.response?.data?.error ||
            "Something went wrong. Please try again."
          );
          setLoading(false);
        });
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-indigo-900 relative">
      <div>
        <BackgroundBeams />
      </div>
      <Card className="mx-auto  z-50 absolute flex justify-center items-center flex-col overflow-hidden">
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl font-bold text-indigo-700">
            Login
          </CardTitle>
          <CardDescription className="text-lg  text-zinc-800 text-center">
            Enter Your Credentials to Sign In
            <br /> to Your Account
          </CardDescription>
          {error && <p className="text-red-700 text-md text-center">{error}</p>}
        </CardHeader>
        <CardContent className="w-full">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={`${isEmailValid ? "" : " outline outline-1 outline-red-700"
                  }`}
                required
              />
              {!isEmailValid && (
                <p className="text-red-700 text-xs">Email is required!</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                onChange={(e) => {
                  setPassword(e.target.value.toString());
                }}
                className={`${isPasswordValid ? "" : " outline outline-1 outline-red-700"
                  }`}
                required
              />
              {!isPasswordValid && (
                <p className="text-red-700 text-xs">Password is required!</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-900"
              onClick={sendRequest}
            >
              Signup
            </Button>
            <CardDescription className="text-sm text-zinc-800 text-center">
              <p>Don't have an account yet?</p>
              <span
                className="text-indigo-700 hover:text-indigo-900 cursor-pointer font-semibold"
                onClick={() => {
                  router.push("/auth/signup");
                }}
              >
                Signin
              </span>
            </CardDescription>
          </div>
        </CardContent>
        {loading && (
          <div className="absolute z-50 w-full bg-[#796e6e63]">
            <LoadingComponent />
          </div>
        )}
      </Card>
    </div>
  );
}
