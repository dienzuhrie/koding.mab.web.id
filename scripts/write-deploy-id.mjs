// Dijalankan otomatis oleh npm sebelum "npm run build" (script "prebuild").
// Menulis ID unik per build ke .deploy-id. next.config.ts membacanya sebagai
// deploymentId, sehingga nilainya SAMA antara saat build dan saat `next start`
// (tidak dihitung ulang tiap proses start).
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
writeFileSync(join(process.cwd(), ".deploy-id"), id);
console.log(`[deploy-id] ${id}`);
