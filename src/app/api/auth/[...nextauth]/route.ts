import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"]
  }
}

const handler = NextAuth({
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
    async signIn({ user }) {
      try {
        await connectDB();
        
        // Store or update user
        await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            email: user.email,
            image: user.image,
          },
          { upsert: true }
        );
        
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        await connectDB();
        const user = await User.findOne({ email: session.user?.email });
        
        if (user && session.user) {
          session.user.id = user._id.toString();
        }
        
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };