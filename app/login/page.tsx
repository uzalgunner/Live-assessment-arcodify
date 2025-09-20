"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMessage] = useState("");

  const handleLogin = () => {
    const staticUsername = "admin";
    const staticpassword = "admin";

    if (username === staticUsername && password === staticpassword) {
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
      }
      setMessage("Login Successfull");
      router.push("/dashboard");
    } else {
      setMessage("Invalid Username or Password");
    }
  };

  return (
    <>
      <div className="flex min-h-screen justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">UserName</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex-col mt-4 gap-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </CardFooter>
            </form>{" "}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
