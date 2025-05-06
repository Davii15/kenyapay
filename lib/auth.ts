import type { SupabaseClientOptions } from "@supabase/supabase-js"
import type { NextAuthOptions } from "next-auth"
// Fix the import - CredentialsProvider is a default export, not a named export
import CredentialsProvider from "next-auth/providers/credentials"
import { getSupabase } from "@/lib/supabaseClient"

// Properly define authOptions as NextAuthOptions type
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { user, session } = await login({
            email: credentials.email,
            password: credentials.password,
          })

          if (!user) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function createClientComponentClient<Database = any>(options?: SupabaseClientOptions<"public">) {
  // Only run on client side
  if (typeof window === "undefined") {
    throw new Error("createClientComponentClient can only be used on the client side")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase credentials not found. Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.",
    )
  }

  // Import createClient dynamically to avoid initialization issues
  const { createClient } = require("@supabase/supabase-js")
  return createClient<Database>(supabaseUrl, supabaseAnonKey, options)
}

// Authentication functions
export async function login({ email, password }: { email: string; password: string }) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Fetch additional user data from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user?.id)
      .single()

    if (userError) {
      throw userError
    }

    // Log the login event
    await logAuthEvent({
      user_id: data.user?.id,
      event_type: "login",
      details: "User logged in successfully",
    })

    return { user: userData, session: data.session }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function logout() {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

export async function signUp(userData: {
  email: string
  password: string
  name: string
  role: string
  country?: string
  businessName?: string
  businessType?: string
  passportFile?: File | null
  businessLicenseFile?: File | null
}) {
  try {
    console.log("Starting signup process...")
    const supabase = getSupabase()

    // Log the userData (excluding sensitive info)
    console.log("Signup data:", {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      hasPassportFile: !!userData.passportFile,
      hasBusinessLicenseFile: !!userData.businessLicenseFile,
    })

    // Start a transaction by using supabase functions
    const { email, password, name, role, country, businessName, businessType, passportFile, businessLicenseFile } =
      userData

    // 1. Create the auth user
    console.log("Creating auth user...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    })

    if (authError) {
      console.error("Auth error during signup:", authError)
      throw authError
    }

    if (!authData.user) {
      console.error("No user returned from auth.signUp")
      throw new Error("Failed to create user")
    }

    const userId = authData.user.id
    console.log("Auth user created with ID:", userId)

    // 2. Create the user profile in the users table
    console.log("Creating user profile...")
    const userProfile = {
      id: userId,
      email,
      name,
      role,
      country: country || null,
      business_name: businessName || null,
      business_type: businessType || null,
      verification_status: "pending",
      created_at: new Date().toISOString(),
    }

    const { error: profileError } = await supabase.from("users").insert(userProfile)

    if (profileError) {
      console.error("Profile error during signup:", profileError)
      // Rollback by deleting the auth user
      await supabase.auth.admin.deleteUser(userId)
      throw profileError
    }

    // 3. Create a wallet for the user
    console.log("Creating user wallet...")
    const { error: walletError } = await supabase.from("wallets").insert({
      user_id: userId,
      balance: 0,
      currency: "KSH",
      updated_at: new Date().toISOString(),
    })

    if (walletError) {
      console.error("Wallet error during signup:", walletError)
      // Rollback
      await supabase.from("users").delete().eq("id", userId)
      await supabase.auth.admin.deleteUser(userId)
      throw walletError
    }

    // 4. Upload documents if provided
    try {
      // Upload passport document for tourists
      if (role === "tourist" && passportFile) {
        const fileExt = passportFile.name.split(".").pop()
        const fileName = `${userId}-passport.${fileExt}`
        const filePath = `documents/${fileName}`

        const { error: uploadError } = await supabase.storage.from("user_documents").upload(filePath, passportFile)

        if (uploadError) {
          console.error("Passport document upload error:", uploadError)
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage.from("user_documents").getPublicUrl(filePath)

          // Update user record with document URL
          await supabase.from("users").update({ passport_document_url: publicUrlData.publicUrl }).eq("id", userId)
        }
      }

      // Upload business license for businesses
      if (role === "business" && businessLicenseFile) {
        const fileExt = businessLicenseFile.name.split(".").pop()
        const fileName = `${userId}-business-license.${fileExt}`
        const filePath = `documents/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("user_documents")
          .upload(filePath, businessLicenseFile)

        if (uploadError) {
          console.error("Business license upload error:", uploadError)
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage.from("user_documents").getPublicUrl(filePath)

          // Update user record with document URL
          await supabase.from("users").update({ business_license_url: publicUrlData.publicUrl }).eq("id", userId)
        }
      }
    } catch (uploadError) {
      console.error("Document upload error:", uploadError)
      // Continue with signup even if document upload fails
    }

    // 5. Log the signup event
    await logAuthEvent({
      user_id: userId,
      event_type: "signup",
      details: `New ${role} account created`,
    })

    // Fetch the complete user data to return
    const { data: userData, error: userDataError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userDataError) {
      throw userDataError
    }

    return { user: userData, session: authData.session }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export async function resetPassword(email: string) {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    throw error
  }
}

export async function updatePassword(password: string) {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Update password error:", error)
    throw error
  }
}

export async function confirmPasswordReset(token: string, password: string) {
  try {
    const supabase = getSupabase()

    // First verify the token
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    })

    if (verifyError) {
      throw verifyError
    }

    // Then update the password
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Password reset confirmation error:", error)
    throw error
  }
}

// Helper function to log authentication events
async function logAuthEvent({
  user_id,
  event_type,
  details,
}: {
  user_id?: string
  event_type: string
  details: string
}) {
  try {
    const supabase = getSupabase()
    await supabase.from("admin_logs").insert({
      admin_id: user_id || "system",
      action: event_type,
      entity_type: "user",
      entity_id: user_id,
      details,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to log auth event:", error)
    // Don't throw here, as this is a non-critical operation
  }
}
