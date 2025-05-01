import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { Octokit } from "@octokit/rest";
import { getGithubAccessToken } from "@/lib/getGithubToken";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Interface for API errors
interface GitHubApiError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Repository ID is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const repository = await Repository.findById(id);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    // Get GitHub token
    let accessToken;
    try {
      accessToken = await getGithubAccessToken();
    } catch (tokenError) {
      return NextResponse.json(
        {
          error: "Failed to retrieve GitHub token",
          details:
            tokenError instanceof Error ? tokenError.message : "Unknown error",
        },
        { status: 401 },
      );
    }

    const octokit = new Octokit({ auth: accessToken });

    // Get the current user's username - this is critical for correct deletion
    let owner;
    try {
      const { data: user } = await octokit.users.getAuthenticated();
      owner = user.login;
      console.log("Authenticated user for deletion:", owner);
    } catch (userError) {
      console.error("Error getting GitHub user:", userError);
      return NextResponse.json(
        {
          error: "Failed to get GitHub user information",
          details: "Could not determine repository owner",
        },
        { status: 500 },
      );
    }

    // Delete repository from GitHub
    try {
      console.log(
        `Attempting to delete GitHub repository: ${owner}/${repository.name}`,
      );
      await octokit.repos.delete({
        owner, // Use the authenticated user's username
        repo: repository.name,
      });

      console.log("GitHub repository deleted successfully");
    } catch (deleteError) {
      const error = deleteError as GitHubApiError;
      console.error("GitHub deletion error:", error);

      const errorStatus = error.status || error.response?.status;
      const errorMessage = error.message || error.response?.data?.message;

      // If the repository is already deleted (404) or we don't have permission (403),
      // continue with database deletion anyway
      if (errorStatus !== 404 && errorStatus !== 403) {
        return NextResponse.json(
          {
            error: "Failed to delete repository from GitHub",
            details: errorMessage || "Unknown GitHub error",
            code: "github_error",
          },
          { status: 500 },
        );
      }
    }

    // Delete from database
    await Repository.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Repository deleted successfully",
      deploymentNote:
        "Don't forget to remove the project from your Vercel dashboard if deployed.",
    });
  } catch (error) {
    console.error("Error deleting repository:", error);
    return NextResponse.json(
      {
        error: "Failed to delete repository",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
