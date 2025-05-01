import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Repository } from "@/models/Repository";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Wait for params to resolve
  const { id } = await params;

  if (!id || !isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid repository ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const repository = await Repository.findById(id);
    
    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(repository);
  } catch (error) {
    console.error('Error fetching repository:', error);
    return NextResponse.json(
      { error: "Failed to fetch repository" },
      { status: 500 }
    );
  }
}