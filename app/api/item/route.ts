import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

// ================= POST: Create Item =================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, price, imageUrl, rating, categoryId } = body;


    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Item name is required" },
        { status: 400 }
      );
    }
    //Convert price and rating to strings
    const priceStr = price !== undefined ? String(price) : undefined;
    const ratingStr = rating !== undefined ? String(rating) : undefined;

    const item = await prisma.items.create({
      data: {
        name,
        description: description ?? null,
        price: priceStr ?? null,
        imageUrl: imageUrl ?? null,
        rating: ratingStr ?? null,
        categoryId: categoryId ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create item" },
      { status: 500 }
    );
  }
}

// ================= GET: Fetch All Items =================
export async function GET() {
  try {
    const items = await prisma.items.findMany({
      orderBy: { id: "desc" },
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      message: "Items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
