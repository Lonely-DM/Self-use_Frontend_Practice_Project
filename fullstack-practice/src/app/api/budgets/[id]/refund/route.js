import { reduceBudgetSpend } from "@/lib/database";

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

export async function POST(request, context) {
  let id;

  try {
    id = await getId(context);
  } catch (error) {
    return badRequest(error.message);
  }

  const body = await request.json();
  const amount = Number(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest("Amount must be greater than 0.");
  }

  try {
    const budget = await reduceBudgetSpend(id, amount);
    return Response.json({ budget });
  } catch (error) {
    const status = error.message === "Spent amount cannot be negative." ? 400 : 404;
    return badRequest(error.message, status);
  }
}
