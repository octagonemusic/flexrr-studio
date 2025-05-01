import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo delete_repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email) return false;

        await connectDB();

        console.log("Sign in account details:", {
          hasAccessToken: !!account?.access_token,
          hasRefreshToken: !!account?.refresh_token,
          scopes: account?.scope,
        });

        // Only update token-related fields if we have new tokens
        if (account?.access_token) {
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            lastLogin: new Date(),
          };

          await User.findOneAndUpdate({ email: user.email }, userData, {
            upsert: true,
            new: true,
          });
        } else {
          // Just update basic data if no new tokens
          await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              image: user.image,
              lastLogin: new Date(),
            },
            { upsert: true },
          );
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        try {
          const dbUser = await User.findOne({
            email: session.user.email,
          }).select("+accessToken");

          if (!dbUser) {
            throw new Error("User not found in database");
          }

          session.user.id = dbUser._id.toString();
          session.user.accessToken = dbUser.accessToken;
        } catch (error) {
          console.error("Error getting user session:", error);
        }
      }
      return session;
    },

    async jwt({ token, account }) {
      // Include the provider account info in the token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
