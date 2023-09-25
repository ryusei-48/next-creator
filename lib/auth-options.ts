import type {NextAuthOptions} from "next-auth";
//import GitHubProvider from "next-auth/providers/github";
//import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
//import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
    debug: process.env.NODE_ENV !== "production",
    session: { strategy: "jwt" },
    //adapter: PrismaAdapter( prisma ),
    providers: [
        /*GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),*/
        CredentialsProvider({
            name: "ログイン",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: {label: "Password", type: "password"},
            },
            // メルアド認証処理
            async authorize(credentials) {
                try {
                    if ( !credentials ) return null;
                    if ( credentials.email === '' ) return null;

                    const user = await prisma.user.findUnique({
                        where: {
                            nameid: credentials!.email!
                        },
                    });

                    if ( user && await bcrypt.compare( credentials.password, user.password ) ) {
                        return { id: `${ user.id }`, name: user.nameid, email: user.email, role: "admin" };
                    } else {
                        return null;
                    }

                } catch (error) {
                    //throw error;
                    return null;
                } finally {
                    await prisma.$disconnect();
                }
            }
        }
        ),
    ],
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({token, user, account, profile, isNewUser}) => {
            // 注意: トークンをログ出力してはダメです。
            //console.log('in jwt', {user, token, account, profile})

            if (user) {
                token.user = user;
                const u = user as any
                token.role = u.role;
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token;
        },
        session: ({session, token}) => {
            //console.log("in session", {session, token});
            token.accessToken
            return {
                ...session,
                user: {
                    ...session.user,
                    role: token.role,
                },
            };
        },
    }
};