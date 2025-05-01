import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', {
      hasUser: !!session?.user,
      hasAccessToken: !!session?.user?.accessToken,
    });

    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const octokit = new Octokit({
      auth: session.user.accessToken
    });

    // Get version info from template repository
    const templateVersion = await octokit.repos.getContent({
      owner: 'octagonemusic',
      repo: 'flexrr',
      path: 'package.json'
    });

    if (!('content' in templateVersion.data)) {
      throw new Error('Could not read package.json from template');
    }

    const { version } = JSON.parse(
      Buffer.from(templateVersion.data.content, 'base64').toString()
    );

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return NextResponse.json(
      { error: "Failed to fetch latest version" },
      { status: 500 }
    );
  }
}