const http = require("node:http");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

// URL: /skills/<key>
// say: what Alice says before playback
// url: direct HTTPS audio stream URL
const SKILLS = Object.freeze({
  surprise: {
    say: "Включаю Surprise.fm",
    url: "https://replace-me.invalid/surprise-fm",
  },
  stvol: {
    say: "Включаю STVOL FM",
    url: "https://replace-me.invalid/stvol-fm",
  },
  oto: {
    say: "Включаю OTO Radio",
    url: "https://replace-me.invalid/oto-radio",
  },
  kurs: {
    say: "Включаю KURS Radio",
    url: "https://replace-me.invalid/kurs-radio",
  },
  "private-persons": {
    say: "Включаю PRIVATE PERSONS",
    url: "https://replace-me.invalid/private-persons",
  },
});

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  response.end(body);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const { pathname } = new URL(
    request.url,
    `http://${request.headers.host || "localhost"}`
  );

  if (request.method === "GET" && pathname === "/healthz") {
    return sendJson(response, 200, { ok: true });
  }

  if (request.method === "GET" && pathname === "/") {
    return sendJson(
      response,
      200,
      Object.entries(SKILLS).map(([slug, skill]) => ({
        path: `/skills/${slug}`,
        say: skill.say,
        url: skill.url,
      }))
    );
  }

  const match = pathname.match(/^\/skills\/([^/]+)$/);
  const slug = match?.[1];
  const skill = SKILLS[slug];

  if (!skill) {
    return sendJson(response, 404, { error: "Skill not found" });
  }

  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  try {
    const event = await readJson(request);

    if (new URL(skill.url).hostname.endsWith(".invalid")) {
      return sendJson(response, 200, {
        version: event.version || "1.0",
        response: {
          text: "Для этого навыка пока не указана ссылка на аудиопоток.",
          end_session: true,
        },
      });
    }

    return sendJson(response, 200, {
      version: event.version || "1.0",
      response: {
        text: skill.say,
        tts: skill.say,
        end_session: true,
        directives: {
          audio_player: {
            action: "Play",
            item: {
              stream: {
                url: skill.url,
                token: `${slug}-live`,
                offset_ms: 0,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return sendJson(response, 400, { error: "Invalid JSON request" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
