import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

// ================= GET: Single Item =================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.items.findUnique({
      where: { id: params.id },
      include: { category: true }, // ✅ include category details
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

// ================= PUT: Update Item =================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, description, price, imageUrl, rating, categoryId } = body;
    //Convert  Price and rating to string
    const priceStr = price ? price.toString() : undefined;
    const ratingStr = rating ? rating.toString() : undefined;
    const updatedItem = await prisma.items.update({
      where: { id: params.id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        price: priceStr ?? undefined,
        imageUrl: imageUrl ?? undefined,
        rating: ratingStr ?? undefined,
        categoryId: categoryId ?? undefined,
      },
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update item" },
      { status: 500 }
    );
  }
}

// ================= DELETE: Remove Item =================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await prisma.items.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete item" },
      { status: 500 }
    );
  }
}
