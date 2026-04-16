import { deletePot, updatePot } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message, status = 400) {
  return Response.json({ error: message }, { status });
}

async function getId(context) {
  const { id } = await context.params;
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid pot id.");
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
  const target = Number(body.target);
  const color = typeof body.color === "string" ? body.color.trim() : undefined;

  if (!name) {
    return badRequest("Name is required.");
  }

  if (!Number.isFinite(target) || target <= 0) {
    return badRequest("Target must be greater than 0.");
  }

  try {
    const pot = await updatePot(id, { name, target, color });
    return Response.json({ pot });
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
    await deletePot(id);
    return Response.json({ success: true });
  } catch (error) {
    return badRequest(error.message, 404);
  }
}
