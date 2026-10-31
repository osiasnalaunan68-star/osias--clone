// DEV ONLY. Lets the Dev Panel "Push to file" button write straight into
// src/data/issuances/. apply:"serve" = it is never part of `npm run build`.
import fs from "node:fs";
import path from "node:path";

const LOOPBACK = /^(::1|127\.0\.0\.1|::ffff:127\.0\.0\.1)$/;

const slug = (s) =>
  String(s ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// same id rule as issuancesStore.js  ->  "cmo-01-2026"
function idOf(raw) {
  const type = String(raw?.type ?? "").trim().toUpperCase();
  const number = String(raw?.number ?? "")
    .trim()
    .replace(/^(CMO|CAO)\b\s*(NO\.?|NUMBER)?\s*/i, "")
    .replace(/\s+/g, "");
  if ((type !== "CMO" && type !== "CAO") || !number) return null;
  return `${type.toLowerCase()}-${slug(number)}`;
}

const itemsOf = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.issuances) ? data.issuances : [data];

// find which existing file (cao-all.json, cmo_01-26.json, ...) already holds this id
function locate(dir, id) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")); } catch { continue; }
    const index = itemsOf(data).findIndex((r) => idOf(r) === id);
    if (index !== -1) return { file, data, index };
  }
  return null;
}

function replaceIn({ data, index }, obj) {
  if (Array.isArray(data)) data[index] = obj;
  else if (Array.isArray(data?.issuances)) data.issuances[index] = obj;
  else return obj; // file holds a single object
  return data;
}

export default function saveIssuancePlugin() {
  let dir = "";
  return {
    name: "dev-save-issuance",
    apply: "serve",
    configResolved(config) {
      dir = path.resolve(config.root, "src/data/issuances");
    },
    configureServer(server) {
      server.middlewares.use("/__dev/save-issuance", (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(obj));
        };
        if (req.method !== "POST") return send(405, { error: "method", message: "POST only." });
        if (!LOOPBACK.test(req.socket.remoteAddress || "")) {
          return send(403, { error: "forbidden", message: "Only localhost can write files." });
        }
        let body = "";
        req.on("data", (c) => {
          body += c;
          if (body.length > 8e6) req.destroy();
        });
        req.on("end", () => {
          try {
            const { content, overwrite } = JSON.parse(body || "{}");
            const obj = typeof content === "string" ? JSON.parse(content) : content;
            const id = idOf(obj);
            if (!id) return send(400, { error: "bad_request", message: 'Needs "type" (CMO/CAO) and "number".' });

            fs.mkdirSync(dir, { recursive: true });
            const rel = (f) => `src/data/issuances/${f}`;
            const found = locate(dir, id);

            if (found) {
              if (!overwrite) {
                return send(409, { error: "exists", file: rel(found.file), message: `${id} already exists in ${rel(found.file)}.` });
              }
              fs.writeFileSync(path.join(dir, found.file), JSON.stringify(replaceIn(found, obj), null, 2) + "\n");
              return send(200, { ok: true, action: "updated", file: rel(found.file) });
            }

            const name = `${id}.json`;
            const target = path.join(dir, name);
            if (fs.existsSync(target)) {
              return send(409, { error: "name_taken", message: `${rel(name)} exists but does not contain ${id}. Rename or remove it first.` });
            }
            fs.writeFileSync(target, JSON.stringify(obj, null, 2) + "\n");
            return send(200, { ok: true, action: "created", file: rel(name) });
          } catch (e) {
            return send(400, { error: "bad_request", message: e.message });
          }
        });
      });
    },
  };
}
