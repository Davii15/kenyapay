"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Globe, ArrowLeft, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserGreeting } from "@/components/user-greeting"
import { signUp } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userType, setUserType] = useState("tourist")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    businessName: "",
    businessType: "",
    passportFile: null as File | null,
    businessLicenseFile: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to ensure we're running on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files?.[0] || null }))
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate required files
    if (userType === "tourist" && !formData.passportFile) {
      setError("Passport or ID document is required")
      setIsLoading(false)
      return
    }

    if (userType === "business" && !formData.businessLicenseFile) {
      setError("Business registration license is required")
      setIsLoading(false)
      return
    }

    try {
      // Prepare signup data
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: userType === "tourist" ? formData.fullName : formData.businessName,
        role: userType as "tourist" | "business" | "admin",
        country: userType === "tourist" ? formData.country : undefined,
        businessName: userType === "business" ? formData.businessName : undefined,
        businessType: userType === "business" ? formData.businessType : undefined,
        passportFile: userType === "tourist" ? formData.passportFile : null,
        businessLicenseFile: userType === "business" ? formData.businessLicenseFile : null,
      }

      // Call signup function
      const result = await signUp(signupData)

      if (!result.user) {
        throw new Error("Signup failed. Please try again.")
      }

      toast({
        title: "Account created successfully",
        description: "Your account has been created and is pending verification.",
      })

      // Redirect based on user type
      if (userType === "tourist") {
        router.push("/tourist/dashboard")
      } else if (userType === "business") {
        router.push("/business/dashboard")
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred during signup")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render the form until we're on the client to avoid hydration issues
  if (!isClient) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <UserGreeting className="flex flex-col items-center justify-center" />
          <p className="text-sm text-muted-foreground">Sign up to start using KenyaPay for your transactions</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="tourist" className="w-full" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tourist">Tourist</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {userType === "tourist" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={(value) => handleSelectChange("country", value)} value={formData.country}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="cn">China</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportFile">Passport/ID Document (Required)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="passportFile"
                        name="passportFile"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "passportFile")}
                        required
                      />
                      <div className="rounded-md bg-amber-50 p-1">
                        <FileCheck className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Please upload a clear image of your passport or national ID for verification.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Owner Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("businessType", value)}
                      value={formData.businessType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel">Hotel/Accommodation</SelectItem>
                        <SelectItem value="restaurant">Restaurant/Café</SelectItem>
                        <SelectItem value="tour">Tour Operator</SelectItem>
                        <SelectItem value="retail">Retail Shop</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessLicenseFile">Business Registration License (Required)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="businessLicenseFile"
                        name="businessLicenseFile"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "businessLicenseFile")}
                        required
                      />
                      <div className="rounded-md bg-amber-50 p-1">
                        <FileCheck className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Please upload your business registration certificate or license for verification.
                    </p>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
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
