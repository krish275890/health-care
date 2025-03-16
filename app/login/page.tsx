"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"manager" | "worker">("worker")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate Auth0 login
    const user = {
      id: "user-1",
      name: "John Doe",
      email: email,
      role: role,
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user))

    // Force a page reload to ensure the auth state is updated
    if (role === "manager") {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/clock"
    }
  }

  const handleGoogleLogin = () => {
    // Simulate Google login
    const user = {
      id: "user-google",
      name: "Google User",
      email: "google@example.com",
      role: role,
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user))

    // Force a page reload to ensure the auth state is updated
    if (role === "manager") {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/clock"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="worker" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="worker" onClick={() => setRole("worker")}>
                Care Worker
              </TabsTrigger>
              <TabsTrigger value="manager" onClick={() => setRole("manager")}>
                Manager
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => alert("Registration would be handled by Auth0")}
            >
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

