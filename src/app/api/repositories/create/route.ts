import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getGithubAccessToken } from "@/lib/getGithubToken";

// Define a type for GitHub API errors
interface GitHubApiError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: any;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          code: "auth_error",
          message: "Authentication required",
          details: "You must be signed in to create a repository",
        },
        { status: 401 },
      );
    }

    const {
      name,
      siteUrl,
      databaseUri,
      s3Bucket,
      s3AccessKeyId,
      s3SecretAccessKey,
      s3Region,
      s3Endpoint,
    } = await req.json();

    if (!name || !siteUrl) {
      return NextResponse.json(
        {
          code: "validation_error",
          message: "Missing required fields",
          details: "Name and site URL are required",
        },
        { status: 400 },
      );
    }

    // Validate repository name format
    const nameRegex = /^[a-z0-9-]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        {
          code: "validation_error",
          message: "Invalid repository name format",
          details:
            "Repository name can only contain lowercase letters, numbers, and hyphens",
        },
        { status: 400 },
      );
    }

    // Check if the repo already exists in our database
    await connectDB();
    const existingRepo = await Repository.findOne({
      userId: session.user.id,
      name,
    });

    if (existingRepo) {
      return NextResponse.json(
        {
          code: "name_exists",
          message: "Repository already exists",
          details: "You already have a repository with this name",
        },
        { status: 409 },
      );
    }

    // Get GitHub access token
    let accessToken;
    try {
      accessToken = await getGithubAccessToken();
    } catch (tokenError) {
      return NextResponse.json(
        {
          code: "github_error",
          message: "Failed to get GitHub access token",
          details: "Please sign out and sign in again",
        },
        { status: 401 },
      );
    }

    const octokit = new Octokit({
      auth: accessToken,
    });

    // Create a new repository on GitHub
    let newRepo;
    try {
      newRepo = await octokit.repos.createForAuthenticatedUser({
        name,
        description: `Flexrr project created from template`,
        private: true,
        auto_init: false,
      });
    } catch (repoError) {
      // Type check the error before using it
      const githubError = repoError as GitHubApiError;

      // Handle GitHub API errors
      const errorStatus = githubError.status || githubError.response?.status;

      if (errorStatus === 422) {
        return NextResponse.json(
          {
            code: "github_error",
            message: "Repository creation failed",
            details:
              "A repository with this name already exists in your GitHub account",
          },
          { status: 422 },
        );
      }

      console.error("GitHub repo creation error:", githubError);
      return NextResponse.json(
        {
          code: "github_error",
          message: "Failed to create repository on GitHub",
          details: githubError.message || "Unknown GitHub error",
        },
        { status: 500 },
      );
    }

    // Helper function to recursively copy files
    const copyContentsRecursively = async (path: string) => {
      try {
        console.log(`Getting contents for path: ${path}`);
        const contents = await octokit.repos.getContent({
          owner: "octagonemusic",
          repo: "flexrr",
          path,
        });

        if (Array.isArray(contents.data)) {
          for (const item of contents.data) {
            if (item.type === "dir") {
              // If it's a directory, recursively copy its contents
              await copyContentsRecursively(item.path);
            } else if (item.type === "file") {
              // If it's a file, copy it to the new repo
              console.log(`Copying file: ${item.path}`);
              const fileContent = await octokit.repos.getContent({
                owner: "octagonemusic",
                repo: "flexrr",
                path: item.path,
              });

              if ("content" in fileContent.data) {
                await octokit.repos.createOrUpdateFileContents({
                  owner: newRepo.data.owner.login,
                  repo: name,
                  path: item.path,
                  message: `Add ${item.path}`,
                  content: fileContent.data.content,
                  branch: "main",
                });
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error copying contents at path ${path}:`, error);
        throw error;
      }
    };

    // Start recursive copy from root
    try {
      console.log("Starting recursive copy of template...");
      await copyContentsRecursively("");
    } catch (copyError) {
      console.error("Error copying template contents:", copyError);
      const error = copyError as Error;
      return NextResponse.json(
        {
          code: "template_error",
          message: "Failed to copy template files",
          details:
            error.message || "Error copying template files to your repository",
        },
        { status: 500 },
      );
    }

    // Generate environment variables using form input values
    const envVars = {
      DATABASE_URI: databaseUri,
      PAYLOAD_SECRET: Math.random().toString(36).slice(-8),
      S3_BUCKET: s3Bucket,
      S3_ACCESS_KEY_ID: s3AccessKeyId,
      S3_SECRET_ACCESS_KEY: s3SecretAccessKey,
      S3_REGION: s3Region,
      S3_ENDPOINT: s3Endpoint,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    };

    // Get latest template version
    const templateVersion = await octokit.repos.getContent({
      owner: "octagonemusic",
      repo: "flexrr",
      path: "package.json",
    });

    let version = "1.0.0";
    if ("content" in templateVersion.data) {
      const packageJson = JSON.parse(
        Buffer.from(templateVersion.data.content, "base64").toString(),
      );
      version = packageJson.version || "1.0.0";
    }

    // Save to database
    const repository = await Repository.create({
      name,
      description: `Flexrr project created from template`,
      userId: session.user.id,
      githubUrl: newRepo.data.html_url,
      envVars,
      version,
    });

    return NextResponse.json({
      repository,
      envVars,
      githubUrl: newRepo.data.html_url,
    });
  } catch (error) {
    console.error("Error creating repository:", error);
    return NextResponse.json(
      {
        code: "server_error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create repository",
        details: error instanceof Error ? error.stack : "Unknown error",
      },
      { status: 500 },
    );
  }
}
