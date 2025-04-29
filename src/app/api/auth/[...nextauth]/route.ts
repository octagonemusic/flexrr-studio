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
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      await connectDB();
      
      const dbUser = await User.findOneAndUpdate(
        { email: user.email },
        { name: user.name, email: user.email, image: user.image },
        { upsert: true, new: true }
      );
      
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          const dbUser = await User.findOne({ email: session.user.email });
          if (!dbUser) {
            throw new Error('User not found');
          }
          session.user.id = dbUser._id.toString();
        } catch (error) {
          console.error('Error getting user session:', error);
          throw error;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };