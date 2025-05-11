import { AuthOptions } from "next-auth";
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
  
  interface JWT {
    accessToken?: string;
    sub?: string;
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

        // Attempt to connect with a short timeout
        const connectPromise = connectDB();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Database connection timed out")), 5000)
        );
        
        try {
          await Promise.race([connectPromise, timeoutPromise]);
        } catch (error) {
          console.error("Fast database connection failed:", error);
          // Allow sign-in even if DB connection fails
        }

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

          // Set a timeout for DB operations
          const updatePromise = User.findOneAndUpdate({ email: user.email }, userData, {
            upsert: true,
            new: true,
            maxTimeMS: 4000, // Database-level timeout
          });
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Database update timed out")), 5000)
          );
          
          try {
            await Promise.race([updatePromise, timeoutPromise]);
          } catch (error) {
            console.error("User update failed:", error);
            // Continue sign-in process despite DB error
          }
        } else {
          // Just update basic data if no new tokens
          try {
            const updatePromise = User.findOneAndUpdate(
              { email: user.email },
              {
                name: user.name,
                image: user.image,
                lastLogin: new Date(),
              },
              { 
                upsert: true,
                maxTimeMS: 4000, // Database-level timeout
              }
            );
          
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Database update timed out")), 5000)
            );
            
            await Promise.race([updatePromise, timeoutPromise]);
          } catch (error) {
            console.error("Basic user update failed:", error);
            // Continue despite DB error
          }
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
          // Set a timeout to prevent long-running operations
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Session lookup timed out")), 5000)
          );
          
          const userLookupPromise = User.findOne({
            email: session.user.email,
          }).select("+accessToken");
          
          // Use token data as fallback if DB lookup times out
          const dbUser = await Promise.race([userLookupPromise, timeoutPromise])
            .catch(error => {
              console.error("Session lookup error:", error);
              
              // Try to determine if token.sub is a MongoDB ObjectId or a GitHub ID
              let userId = token.sub;
              // If it's a GitHub numeric ID, try to find user by email without timeout
              if (token.sub && !token.sub.match(/^[0-9a-fA-F]{24}$/)) {
                console.log("Using email lookup fallback instead of numeric GitHub ID");
              }
              
              // Set fallback ID from token
              return { _id: userId, accessToken: token.accessToken };
            });

          if (dbUser) {
            // Ensure we're using a MongoDB ObjectId if available
            session.user.id = dbUser._id.toString();
            session.user.accessToken = dbUser.accessToken as string | undefined;
            // Make sure email is preserved in the session
            if (!session.user.email && dbUser.email) {
              session.user.email = dbUser.email;
            }
          } else if (token.sub) {
            // Use token as fallback if no DB user found
            session.user.id = token.sub;
            session.user.accessToken = token.accessToken as string | undefined;
            // Ensure email is available for secure repository queries
            if (!session.user.email && token.email) {
              session.user.email = token.email as string;
            }
            console.warn("Using token fallback for user ID, this might cause MongoDB ObjectId casting issues");
          }
        } catch (error) {
          console.error("Error getting user session:", error);
          // Ensure we have minimal id to prevent cascading errors
          if (token.sub && !session.user.id) {
            session.user.id = token.sub;
          }
        }
      }
      return session;
    },

    async jwt({ token, account, user }) {
      // Include the provider account info in the token
      if (account) {
        token.accessToken = account.access_token as string;
      }
      
      // If we have a user object with an _id (MongoDB ObjectId), store it in the token
      if (user && (user as any)._id) {
        token.mongoId = (user as any)._id.toString();
      }
      
      // Preserve email in the token for repository authorization
      if (user && user.email) {
        token.email = user.email;
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
