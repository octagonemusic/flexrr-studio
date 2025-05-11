import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "@/models/User";
import { validateGithubToken } from "./validateGithubToken";

export async function getGithubAccessToken() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("No authenticated user found");
    }

    // First check if the token is already in the session
    if (session.user.accessToken) {
      // Validate the token before returning it
      try {
        const validation = await validateGithubToken(session.user.accessToken);
        if (validation.valid) {
          return session.user.accessToken;
        } else {
          console.warn("Session token validation failed:", validation.error);
          // Continue to database check if token is invalid
        }
      } catch (validationError) {
        console.warn("Error validating session token:", validationError);
        // Continue to database check if validation fails
      }
    }

    // If not in session or session token is invalid, try to get from database
    const user = await User.findOne({ email: session.user.email }).select(
      "+accessToken",
    );

    if (!user?.accessToken) {
      throw new Error("No GitHub access token found");
    }

    // Validate the database token before returning it
    try {
      const validation = await validateGithubToken(user.accessToken);
      if (!validation.valid) {
        throw new Error(`Invalid GitHub token: ${validation.error}`);
      }
    } catch (validationError) {
      console.error("Database token validation failed:", validationError);
      throw new Error("GitHub token validation failed");
    }

    return user.accessToken;
  } catch (error) {
    console.error("Error getting GitHub token:", error);
    throw new Error("Failed to retrieve GitHub access token");
  }
}
