import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "@/models/User";

export async function getGithubAccessToken() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("No authenticated user found");
    }

    // First check if the token is already in the session
    if (session.user.accessToken) {
      return session.user.accessToken;
    }

    // If not in session, try to get from database
    const user = await User.findOne({ email: session.user.email }).select(
      "+accessToken",
    );

    if (!user?.accessToken) {
      throw new Error("No GitHub access token found");
    }

    return user.accessToken;
  } catch (error) {
    console.error("Error getting GitHub token:", error);
    throw new Error("Failed to retrieve GitHub access token");
  }
}
