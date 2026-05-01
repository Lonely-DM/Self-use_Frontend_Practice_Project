import { deleteTransaction, updateTransaction } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function PUT(request, context) {
  const params = await context.params;
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const amount = Number(body.amount);
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "expense";

  if (!name) {
    return badRequest("Transaction name is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest("Transaction amount must be greater than 0.");
  }

  if (!date) {
    return badRequest("Transaction date is required.");
  }

  try {
    const transaction = await updateTransaction(params.id, { name, amount, date, type });
    return Response.json({ transaction });
  } catch (error) {
    return badRequest(error.message || "Unable to update transaction.", error.message === "Transaction not found." ? 404 : 400);
  }
}

export async function DELETE(_request, context) {
  const params = await context.params;

  try {
    await deleteTransaction(params.id);
    return Response.json({ success: true });
  } catch (error) {
    return badRequest(error.message || "Unable to delete transaction.", error.message === "Transaction not found." ? 404 : 400);
  }
}
