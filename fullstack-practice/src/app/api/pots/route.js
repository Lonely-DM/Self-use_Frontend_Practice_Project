import { createPot, getPotsData } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GET() {
  const data = await getPotsData();
  return Response.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const target = Number(body.target);
  const saved = body.saved === undefined ? 0 : Number(body.saved);
  const color = typeof body.color === "string" ? body.color.trim() : undefined;

  if (!name) {
    return badRequest("Name is required.");
  }

  if (!Number.isFinite(target) || target <= 0) {
    return badRequest("Target must be greater than 0.");
  }

  if (!Number.isFinite(saved) || saved < 0) {
    return badRequest("Saved amount must be 0 or greater.");
  }

  try {
    const pot = await createPot({ name, target, saved, color });
    return Response.json({ pot }, { status: 201 });
  } catch (error) {
    return badRequest(error.message || "Unable to create pot.");
  }
}
