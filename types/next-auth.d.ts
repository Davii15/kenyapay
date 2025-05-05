// Add this file to extend the NextAuth types
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
