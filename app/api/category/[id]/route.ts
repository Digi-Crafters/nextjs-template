import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.categories.findUnique({
      where: { id: params.id },
      include: { items: true }, // ✅ fetch related items
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, description, imageUrl, price, rating } = body;

    const updated = await prisma.categories.update({
      where: { id: params.id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        imageUrl: imageUrl ?? undefined,
        price: price ?? undefined,
        rating: rating ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await prisma.categories.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
