import crypto from "crypto";

export type ScanResult = { status:"CLEAN"|"INFECTED"; reason?:string; sha256:string };

const DANGEROUS_EXT = new Set([".exe",".scr",".bat",".cmd",".js",".vbs",".jar",".ps1",".msi"]);
const DANGEROUS_MIME = new Set(["application/x-msdownload","application/java-archive","application/x-dosexec"]);

export async function scanBuffer(buf:Buffer, key?:string, mime?:string): Promise<ScanResult> {
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  const ext = (key||"").toLowerCase().slice((key||"").lastIndexOf("."));
  if (DANGEROUS_EXT.has(ext)) return { status:"INFECTED", reason:`blocked_ext:${ext}`, sha256 };
  if (mime && DANGEROUS_MIME.has(mime)) return { status:"INFECTED", reason:`blocked_mime:${mime}`, sha256 };
  // simple signature heuristic
  if (buf.includes(Buffer.from("MZ")) && buf[0]===0x4d && buf[1]===0x5a) return { status:"INFECTED", reason:"mz_header_exe", sha256 };
  return { status:"CLEAN", sha256 };
}
