import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;

        // SKIP middleware untuk static files dan uploads
        if (
            pathname.startsWith('/uploads/') ||
            pathname.startsWith('/_next/') ||
            pathname.includes('.png') ||
            pathname.includes('.jpg') ||
            pathname.includes('.jpeg') ||
            pathname.includes('.gif') ||
            pathname.includes('.webp') ||
            pathname.includes('.svg')
        ) {
            return NextResponse.next();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = (req as any).nextauth?.token;

        // Redirect logged-in users away from login page
        if (pathname === "/admin/login" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        // Redirect logged-in users accessing /admin to dashboard
        if (pathname === "/admin" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        // Protect /api/admin endpoints
        if (pathname.startsWith('/api/admin')) {
            if (!token) {
                return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow access to uploads and static files
                if (pathname.startsWith('/uploads/') || pathname.startsWith('/_next/')) {
                    return true;
                }

                // Require token for admin pages and API
                if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
                    return !!token;
                }

                return true;
            }
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: [
        // Protect admin pages and API endpoints
        "/((?!_next/static|_next/image|uploads|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)",
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};