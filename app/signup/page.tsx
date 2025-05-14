// signup.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { signUp } from "@/lib/auth"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [userType, setUserType] = useState("tourist")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signUpError, data } = await signUp(email, password, {
        name: fullName,
        role: userType,
      })

      if (signUpError) {
        throw signUpError
      }

      toast({
        title: "Signup successful",
        description: data?.message || "Check your email to confirm your account.",
      })

      router.push("/login")
    } catch (err) {
      console.error("Signup error:", err)
      setError((err as Error).message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="tourist" className="w-full" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tourist">Tourist</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-red-500">{error}</p>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


