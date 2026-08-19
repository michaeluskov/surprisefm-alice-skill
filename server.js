const http = require("node:http");
const { audioResponse } = require("./alice");
const { STATIONS } = require("./stations");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const ROUTES = Object.freeze({
  "/skills/surprise": "surprise",
  "/skills/stvol": "stvol",
  "/skills/oto": "oto",
  "/skills/kurs": "kurs",
  "/skills/private-persons": "private-persons",
});

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new Error("Request body is too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/healthz") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/") {
    return sendJson(res, 200, {
      service: "surprisefm-alice-skill",
      skills: Object.entries(ROUTES).map(([path, stationId]) => ({
        path,
        invocation: STATIONS[stationId].invocation,
      })),
    });
  }

  const stationId = ROUTES[url.pathname];

  if (!stationId) {
    return sendJson(res, 404, { error: "Not found" });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const event = await readJson(req);
    const response = audioResponse(event, stationId);
    return sendJson(res, 200, response);
  } catch (error) {
    console.error(error);
    return sendJson(res, 400, { error: "Invalid JSON request" });
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`surprisefm-alice-skill listening on http://${HOST}:${PORT}`);
  });
}

module.exports = { server, ROUTES };
