import { deleteRecurringBill, updateRecurringBill } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

async function getId(context) {
  const { id } = await context.params;
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid recurring bill id.");
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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const amount = Number(body.amount);
  const status = typeof body.status === "string" ? body.status.trim() : "upcoming";

  if (!name) {
    return badRequest("Bill name is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest("Bill amount must be greater than 0.");
  }

  try {
    const recurringBill = await updateRecurringBill(id, { name, amount, status });
    return Response.json({ recurringBill });
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
    await deleteRecurringBill(id);
    return Response.json({ success: true });
  } catch (error) {
    return badRequest(error.message, 404);
  }
}
