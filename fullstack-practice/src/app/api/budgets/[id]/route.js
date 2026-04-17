import { deleteBudget, updateBudget } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

async function getId(context) {
  const { id } = await context.params;
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid budget id.");
  }
  return parsedId;
}

export async function PUT(request, context) {
  let id;

  try {
    id = await getId(context);
  } catch (error) {
    return badRequest(error.message);
  }

  const body = await request.json();
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const amount = Number(body.amount);
  const color = typeof body.color === "string" ? body.color.trim() : undefined;

  if (!category) {
    return badRequest("Category is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest("Budget amount must be greater than 0.");
  }

  try {
    const budget = await updateBudget(id, { category, amount, color });
    return Response.json({ budget });
  } catch (error) {
    return badRequest(error.message, 404);
  }
}

export async function DELETE(_request, context) {
  let id;

  try {
    id = await getId(context);
  } catch (error) {
    return badRequest(error.message);
  }

  try {
    await deleteBudget(id);
    return Response.json({ success: true });
  } catch (error) {
    return badRequest(error.message, 404);
  }
}
