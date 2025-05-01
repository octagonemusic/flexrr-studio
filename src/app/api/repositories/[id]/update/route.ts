import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { Octokit } from "@octokit/rest";
import { getGithubAccessToken } from "@/lib/getGithubToken";

// Define a type for GitHub API errors
interface GitHubApiError {
  status?: number;
  message?: string;
}

export async function POST(
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

    // Get version info to check for updates
    let templateVersion;
    try {
      templateVersion = await octokit.repos.getContent({
        owner: "octagonemusic",
        repo: "flexrr",
        path: "package.json",
      });
    } catch (templateError) {
      return NextResponse.json(
        {
          error: "Failed to fetch template version",
          details: "Could not access the template repository",
        },
        { status: 502 },
      );
    }

    if (!("content" in templateVersion.data)) {
      return NextResponse.json(
        {
          error: "Invalid template data",
          details: "Could not read package.json from template",
        },
        { status: 502 },
      );
    }

    const { version: latestVersion } = JSON.parse(
      Buffer.from(templateVersion.data.content, "base64").toString(),
    );

    if (repository.version === latestVersion) {
      return NextResponse.json({
        message: "Already up to date",
        version: latestVersion,
      });
    }

    // Helper function to recursively copy files
    async function updateContentsRecursively(path = "") {
      try {
        const contents = await octokit.repos.getContent({
          owner: "octagonemusic",
          repo: "flexrr",
          path,
        });

        const { data: githubUser } = await octokit.users.getAuthenticated();
        const owner = githubUser.login;

        if (Array.isArray(contents.data)) {
          for (const item of contents.data) {
            if (item.type === "dir") {
              await updateContentsRecursively(item.path);
            } else if (item.type === "file") {
              // Get file content from template
              const templateFile = await octokit.repos.getContent({
                owner: "octagonemusic",
                repo: "flexrr",
                path: item.path,
              });

              if (!("content" in templateFile.data)) {
                console.warn(`Skipping ${item.path}: No content available`);
                continue;
              }

              try {
                // Try to get existing file in user's repo
                const existingFile = await octokit.repos.getContent({
                  owner: owner,
                  repo: repository.name,
                  path: item.path,
                });

                // Update existing file
                if ("sha" in existingFile.data) {
                  await octokit.repos.createOrUpdateFileContents({
                    owner: owner,
                    repo: repository.name,
                    path: item.path,
                    message: `Update ${item.path} from template`,
                    content: templateFile.data.content,
                    sha: existingFile.data.sha,
                    branch: "main",
                  });
                }
              } catch (fileError) {
                // Type check fileError before using it
                const error = fileError as GitHubApiError;

                // File doesn't exist, create it
                if (error.status === 404) {
                  await octokit.repos.createOrUpdateFileContents({
                    owner: repository.userId,
                    repo: repository.name,
                    path: item.path,
                    message: `Add ${item.path} from template`,
                    content: templateFile.data.content,
                    branch: "main",
                  });
                } else {
                  console.error(`Error processing file ${item.path}:`, error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error updating contents at path ${path}:`, error);
        throw error;
      }
    }

    // Update all files from template
    await updateContentsRecursively();

    // Update version in database
    repository.version = latestVersion;
    await repository.save();

    return NextResponse.json({
      message: "Repository updated successfully",
      version: latestVersion,
    });
  } catch (error) {
    console.error("Error updating repository:", error);

    // More detailed error handling
    if (error instanceof Error) {
      const message = error.message;

      if (message.includes("Not Found") || message.includes("404")) {
        return NextResponse.json(
          {
            error: "Repository not found on GitHub",
            details: "The repository may have been deleted from GitHub",
          },
          { status: 404 },
        );
      }

      if (message.includes("Bad credentials") || message.includes("401")) {
        return NextResponse.json(
          {
            error: "GitHub authentication failed",
            details:
              "Your GitHub session may have expired. Try signing in again.",
          },
          { status: 401 },
        );
      }

      if (message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "GitHub API rate limit exceeded",
            details: "Please try again later",
          },
          { status: 429 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update repository",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
