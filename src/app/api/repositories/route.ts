import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { validateGithubToken } from "@/lib/validateGithubToken";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id || !session?.user?.email) {
      console.log("No user ID in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token validity
    if (session.user.accessToken) {
      const tokenValidation = await validateGithubToken(session.user.accessToken);
      if (!tokenValidation.valid) {
        console.log("Access token invalid:", tokenValidation.error);
        return NextResponse.json(
          { error: "Invalid access token", code: "token_expired" },
          { status: 401 }
        );
      }
    } else {
      // Try to get token from database
      await connectDB();
      const user = await User.findOne({ email: session.user.email }).select("+accessToken");
      
      if (!user?.accessToken) {
        return NextResponse.json(
          { error: "No access token found", code: "no_token" },
          { status: 401 }
        );
      }
      
      // Validate the token from database
      const tokenValidation = await validateGithubToken(user.accessToken);
      if (!tokenValidation.valid) {
        return NextResponse.json(
          { error: "Invalid access token", code: "token_expired" },
          { status: 401 }
        );
      }
    }

    await connectDB();

    // Secure query that only returns repositories owned by the current user
    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
    
    let query;
    if (isValidObjectId) {
      // If it's a valid ObjectId, use it directly
      query = { userId: session.user.id };
    } else {
      // If using email as identifier (safer than GitHub ID)
      query = { userEmail: session.user.email };
      console.warn(`Using email for repository lookup instead of invalid ObjectId: ${session.user.id}`);
    }
    
    const repositories = await Repository.find(query).sort({ createdAt: -1 });

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token validity
    if (session.user.accessToken) {
      const tokenValidation = await validateGithubToken(session.user.accessToken);
      if (!tokenValidation.valid) {
        console.log("Access token invalid:", tokenValidation.error);
        return NextResponse.json(
          { error: "Invalid access token", code: "token_expired" },
          { status: 401 }
        );
      }
    }

    const { name, description } = await req.json();

    await connectDB();

    const repository = await Repository.create({
      name,
      description,
      userId: session.user.id,
    });

    return NextResponse.json(repository);
  } catch (error) {
    console.error("Error creating repository:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
