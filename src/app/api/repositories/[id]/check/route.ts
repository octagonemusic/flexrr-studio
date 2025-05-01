import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { Octokit } from "@octokit/rest";
import { getGithubAccessToken } from "@/lib/getGithubToken";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    await connectDB();
    const repository = await Repository.findById(id);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    let accessToken;
    try {
      accessToken = await getGithubAccessToken();
    } catch (tokenError) {
      return NextResponse.json(
        {
          error: "Failed to retrieve GitHub token",
          details:
            tokenError instanceof Error ? tokenError.message : "Unknown error",
          exists: false,
        },
        { status: 401 },
      );
    }

    const octokit = new Octokit({ auth: accessToken });

    // Get the current user's GitHub username
    const { data: githubUser } = await octokit.users.getAuthenticated();
    const owner = githubUser.login;

    console.log(`Checking if repository exists: ${owner}/${repository.name}`);

    // Check if repository still exists on GitHub under the current user
    try {
      await octokit.repos.get({
        owner,
        repo: repository.name,
      });

      // Update the status in our database if it exists
      repository.status = "active";
      await repository.save();

      return NextResponse.json({ exists: true, status: "active" });
    } catch (error: any) {
      console.error("GitHub check error:", error);

      if (error.status === 404) {
        // Repo doesn't exist on GitHub
        repository.status = "deleted_on_github";
        await repository.save();

        return NextResponse.json({
          exists: false,
          status: "deleted_on_github",
        });
      }

      // Other error
      return NextResponse.json(
        {
          error: "Failed to check repository existence",
          details: error.message || "Unknown error",
          exists: null,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error checking repository:", error);
    return NextResponse.json(
      {
        error: "Failed to check repository",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
