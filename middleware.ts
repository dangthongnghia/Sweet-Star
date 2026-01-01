import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLcggedIn = !!req.auth;
    // @ts-ignore
    const role = req.auth?.user?.role;
    const isOnAdminPanel = req.nextUrl.pathname.startsWith('/admin');

    if (isOnAdminPanel) {
        if (!isLcggedIn) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        if (role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/admin/:path*"],
}
