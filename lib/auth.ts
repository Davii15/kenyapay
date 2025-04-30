import { CredentialsProvider } from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { supabase } from "./supabaseClient"
import type { User } from "./supabaseClient"

async function verifyCredentials(credentials: any): Promise<User | null> {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    if (!user) {
      console.log("No user found with that email")
      return null
    }

    return user as User
  } catch (error) {
    console.error("Error verifying credentials:", error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        if (!credentials) {
          return null
        }

        const user = await verifyCredentials(credentials)

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
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
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as "tourist" | "business" | "admin",
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function login({ email, password }: any) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.session?.user.id)
      .single()

    if (userError) {
      throw userError
    }

    return {
      user: userData,
      session: data.session,
    }
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export async function signUp(userData: any) {
  try {
    const { email, password, name, role } = userData

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error("Failed to create user")
    }

    // Create user profile
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
      })
      .select()
      .single()

    if (userError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw userError
    }

    return {
      user,
      session: authData.session,
    }
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}
