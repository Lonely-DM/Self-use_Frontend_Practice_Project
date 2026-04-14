/*
================ ORIGINAL FILE (ARCHIVED) ================

import { createProduct, listProducts } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return Response.json({ products });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const product = await createProduct(payload);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "创建失败" },
      { status: 400 }
    );
  }
}

=========================================================
*/