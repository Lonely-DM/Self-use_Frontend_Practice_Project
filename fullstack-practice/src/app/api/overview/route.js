import { getOverviewData } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const overview = await getOverviewData();
  return Response.json(overview);
}