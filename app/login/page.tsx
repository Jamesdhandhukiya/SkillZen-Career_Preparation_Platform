"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Brain, Eye, EyeOff, Mail, Lock, Code, BookOpen, Award, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, user, loading } = useAuth()

  useEffect(() => {
    // Trigger flip animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Redirect if user is already logged in (only when not loading)
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // For development, show a helpful message and suggest running the confirmation script
          setError("Email not confirmed. Please run the bulk confirmation script in Supabase SQL Editor, or contact support.")
        } else {
          setError(error.message)
        }
        setIsLoading(false)
      } else if (data.user) {
        // User will be redirected by the useEffect hook when user state updates
        // No need to redirect here to avoid double redirects
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">
              SkillZen
            </span>
          </Link>
        </div>

        <Card className={`border-2 border-gray-300 shadow-xl bg-white transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'rotate-y-0 opacity-100' 
            : 'rotate-y-90 opacity-0'
        }`} style={{
          transform: isVisible ? 'rotateY(0deg)' : 'rotateY(90deg)'
        }}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome back</CardTitle>
            <CardDescription className="text-gray-700">Sign in to continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="border-gray-200 bg-transparent">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
                Sign up for free
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Illustration */}
        <div className="hidden lg:block">
          <div className="relative w-full h-[500px] flex flex-col items-center justify-center">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src="/businessman-illustration.png" 
                alt="Professional businessman with career development elements"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Text Below Image */}
            <div className="text-center mt-6 px-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Master Your Career Journey
              </h3>
              <p className="text-gray-300 text-lg max-w-md">
                Join thousands of professionals achieving their career goals with SkillZen's personalized learning platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
