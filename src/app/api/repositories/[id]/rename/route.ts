import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { Octokit } from "@octokit/rest";
import { getGithubAccessToken } from "@/lib/getGithubToken";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    // Get the current repository
    await connectDB();
    const repository = await Repository.findById(id);
    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    // Get GitHub token
    const accessToken = await getGithubAccessToken();
    const octokit = new Octokit({ auth: accessToken });

    // Get the current user's username
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // Rename repository on GitHub
    await octokit.repos.update({
      owner, // Use current user's GitHub username
      repo: repository.name,
      name: name,
    });

    // Update in database
    repository.name = name;
    await repository.save();

    return NextResponse.json(repository);
  } catch (error) {
    console.error("Error renaming repository:", error);
    return NextResponse.json(
      { error: "Failed to rename repository" },
      { status: 500 },
    );
  }
}
