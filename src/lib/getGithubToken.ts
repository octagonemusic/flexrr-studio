import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "@/models/User";
import { validateGithubToken } from "./validateGithubToken";
import { connectDB } from "./mongoose";

export async function getGithubAccessToken() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("No authenticated user found");
    }

    // Check for valid token in session first (most efficient path)
    if (session.user.accessToken) {
      // Quick validation with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Token validation timed out")), 2000)
      );
      
      try {
        const validationPromise = validateGithubToken(session.user.accessToken);
        const result = await Promise.race([validationPromise, timeoutPromise]);
        
        if (result && typeof result === 'object' && 'valid' in result && result.valid) {
          return session.user.accessToken;
        }
      } catch (err) {
        // If validation times out, return the token anyway
        console.warn("Token validation timed out, using session token");
        return session.user.accessToken;
      }
    }

    // Set up DB timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Database lookup timed out")), 2000)
    );

    try {
      // Attempt MongoDB connection with timeout
      const connectPromise = connectDB();
      await Promise.race([connectPromise, timeoutPromise]);
      
      // Query user with timeout
      const findPromise = User.findOne({ email: session.user.email }).select("+accessToken");
      const user = await Promise.race([findPromise, timeoutPromise]);

      if (user?.accessToken) {
        return user.accessToken;
      }
    } catch (dbError) {
      console.warn("Database error or timeout:", dbError);
      
      // If DB fails and we have a session token, use it regardless of validation
      if (session.user.accessToken) {
        console.warn("Using session token as fallback after DB error");
        return session.user.accessToken;
      }
    }

    throw new Error("No GitHub access token found");
  } catch (error) {
    console.error("Token retrieval error:", error);
    throw new Error("Failed to retrieve GitHub access token");
  }
}
