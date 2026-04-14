/*
================ ORIGINAL FILE (ARCHIVED) ================

import { deleteProduct, getProduct, updateProduct } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  const { id } = await context.params;
  const product = await getProduct(Number(id));

  if (!product) {
    return Response.json({ error: "未找到该产品" }, { status: 404 });
  }

  return Response.json({ product });
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const product = await updateProduct(Number(id), payload);

    if (!product) {
      return Response.json({ error: "未找到该产品" }, { status: 404 });
    }

    return Response.json({ product });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "更新失败" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, context) {
  const { id } = await context.params;
  const deleted = await deleteProduct(Number(id));

  if (!deleted) {
    return Response.json({ error: "未找到该产品" }, { status: 404 });
  }

  return Response.json({ success: true });
}

=========================================================
*/