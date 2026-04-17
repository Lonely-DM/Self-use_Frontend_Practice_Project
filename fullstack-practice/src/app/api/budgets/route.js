import { createBudget, getBudgetsData } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  const data = await getBudgetsData();
  return Response.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const amount = Number(body.amount);
  const spent = body.spent === undefined ? 0 : Number(body.spent);
  const color = typeof body.color === "string" ? body.color.trim() : undefined;

  if (!category) {
    return badRequest("Category is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest("Budget amount must be greater than 0.");
  }

  if (!Number.isFinite(spent) || spent < 0) {
    return badRequest("Spent amount must be 0 or greater.");
  }

  try {
    const budget = await createBudget({ category, amount, spent, color });
    return Response.json({ budget }, { status: 201 });
  } catch (error) {
    return badRequest(error.message || "Unable to create budget.");
  }
}
