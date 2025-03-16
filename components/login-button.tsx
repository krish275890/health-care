"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function LoginButton() {
  const { user, login, logout } = useAuth()

  return user ? (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <a href={user.role === "manager" ? "/dashboard" : "/clock"}>
          {user.role === "manager" ? "Dashboard" : "Clock In/Out"}
        </a>
      </Button>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  ) : (
    <Button onClick={login}>Login</Button>
  )
}

