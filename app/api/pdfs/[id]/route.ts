import { env } from "cloudflare:workers";
import { PDFDocument } from "pdf-lib";
import { getChatGPTUser } from "../../../chatgpt-auth";

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const row = await env.DB.prepare("SELECT f.* FROM pdf_files f WHERE f.id=?").bind(Number(id)).first<{file_key:string;original_name:string;status:string;owner_id:string}>();
  if (!row) return Response.json({ error: "PDF not found" }, { status: 404 });
  const user = await getChatGPTUser();
  if (row.status !== "approved" && user?.userId !== row.owner_id) return Response.json({ error: "This PDF is awaiting review" }, { status: 403 });
  const url = new URL(request.url);
  const start = Number(url.searchParams.get("start") || 0), end = Number(url.searchParams.get("end") || 0);
  const download = url.searchParams.get("download") === "1";
  let bytes: Uint8Array;
  if (row.file_key.startsWith("public:")) {
    const asset = await fetch(new URL(row.file_key.slice("public:".length), url.origin));
    if (!asset.ok) return Response.json({ error: "File unavailable" }, { status: 404 });
    bytes = new Uint8Array(await asset.arrayBuffer());
  } else {
    const object = await env.UPLOADS.get(row.file_key);
    if (!object) return Response.json({ error: "File unavailable" }, { status: 404 });
    bytes = new Uint8Array(await object.arrayBuffer());
  }
  if (start > 0 && end >= start) {
    const source = await PDFDocument.load(bytes), out = await PDFDocument.create();
    const indexes = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1).filter(i => i >= 0 && i < source.getPageCount());
    const pages = await out.copyPages(source, indexes); pages.forEach(page => out.addPage(page)); bytes = await out.save();
  }
  const filename = row.original_name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const disposition = `${download ? "attachment" : "inline"}; filename="${filename}"`;
  return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": disposition, "Cache-Control": row.status === "approved" ? "public, max-age=3600" : "private, no-store" } });
}
