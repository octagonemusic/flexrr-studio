import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Add this import
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions); // Pass authOptions here
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      console.log('No user ID in session');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const repositories = await Repository.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); // Also update this
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      { status: 500 }
    );
  }
}