import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Providers added in auth.ts
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');

            if (isOnAdminPanel) {
                if (isLoggedIn) {
                    // @ts-ignore
                    const role = auth.user.role;
                    return role === 'ADMIN';
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.role = user.role
            }
            return token
        },
        session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
                // @ts-ignore
                session.user.role = token.role as string
            }
            return session
        }
    }
} satisfies NextAuthConfig
