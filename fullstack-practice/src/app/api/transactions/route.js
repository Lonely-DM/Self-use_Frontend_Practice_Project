import { createTransaction, getTransactionsData } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  const data = await getTransactionsData();
  return Response.json(data);
}

export async function POST(request) {
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
    const transaction = await createTransaction({ name, amount, date, type });
    return Response.json({ transaction }, { status: 201 });
  } catch (error) {
    return badRequest(error.message || "Unable to create transaction.");
  }
}
