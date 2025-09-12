import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

export async function POST(req: Request) {
  try {
    // ✅ Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, imageUrl, price, rating } = body;

    // ✅ Validate required field
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // ✅ Create category in DB
    const category = await prisma.categories.create({
      data: {
        name,
        description: description ?? null,
        imageUrl: imageUrl ?? null,
        price: price ?? null,
        rating: rating ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
