// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        
        // SKIP middleware untuk static files dan uploads
        if (
            pathname.startsWith('/uploads/') || 
            pathname.startsWith('/_next/') ||
            pathname.startsWith('/api/') ||
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

        if (pathname === "/admin/login" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        if (pathname === "/admin" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                
                // Allow access ke uploads dan static files
                if (pathname.startsWith('/uploads/') || pathname.startsWith('/_next/')) {
                    return true;
                }
                
                // Untuk admin pages, require token
                if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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
        // EXCLUDE static files dan uploads dari middleware
        "/((?!_next/static|_next/image|uploads|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)",
        "/admin/:path*",
    ],
};