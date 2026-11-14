import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest)
{
    const token = request.cookies.get("authToken");

    const pathname = request.nextUrl.pathname;

    const protectedRoutes = 
    [
        "/profile",
        "/admin"
    ];

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token)
    {
        return NextResponse.redirect( new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config =
{
    matcher: 
    [
        "/profile/:path*",
        "/admin/:path*"
    ]
};