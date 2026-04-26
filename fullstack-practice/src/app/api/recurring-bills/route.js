import { createRecurringBill, getRecurringBillsData } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  const data = await getRecurringBillsData();
  return Response.json(data);
}

export async function POST(request) {
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
    const recurringBill = await createRecurringBill({ name, amount, status });
    return Response.json({ recurringBill }, { status: 201 });
  } catch (error) {
    return badRequest(error.message || "Unable to create recurring bill.");
  }
}
