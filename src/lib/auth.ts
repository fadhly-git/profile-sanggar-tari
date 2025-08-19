import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options"
import { redirect } from "next/navigation"

export async function checkAuthSession() {
    const session = await getServerSession(authOptions)
    return session
}

export async function requireAuth() {
    const session = await checkAuthSession()
    if (!session) {
        throw new Error("Authentication required")
    }
    return session
}

export async function requireAdminAuth() {
    const session = await checkAuthSession()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/auth/login")
    }
    return session
}