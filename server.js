const express = require("express");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const SKILLS = Object.freeze({
  surprise: {
    say: "Включаю Surprise.fm",
    url: "https://radio.surprise.fm/listen/surprise/radio.mp3",
  },
  stvol: {
    say: "Включаю STVOL FM",
    url: "https://listen9.myradio24.com/49669",
  },
  oto: {
    say: "Включаю OTO Radio",
    url: "https://myradio24.org/7859",
  },
  kurs: {
    say: "Включаю KURS Radio",
    url: "https://myradio24.org/kursradio",
  },
  "private-persons": {
    say: "Включаю PRIVATE PERSONS",
    url: "https://myradio24.org/private",
  },
});

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_request, response) => {
  response.json({ ok: true });
});

app.get("/", (_request, response) => {
  response.json(
    Object.entries(SKILLS).map(([slug, skill]) => ({
      path: `/skills/${slug}`,
      say: skill.say,
      url: skill.url,
    }))
  );
});

app.post("/skills/:slug", (request, response) => {
  const { slug } = request.params;
  const skill = SKILLS[slug];

  if (!skill) {
    return response.status(404).json({ error: "Skill not found" });
  }

  const version = request.body?.version || "1.0";

  if (new URL(skill.url).hostname.endsWith(".invalid")) {
    return response.json({
      version,
      response: {
        text: "Для этого навыка пока не указана ссылка на аудиопоток.",
        end_session: true,
      },
    });
  }

  return response.json({
    version,
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
});

app.all("/skills/:slug", (request, response) => {
  const status = SKILLS[request.params.slug] ? 405 : 404;
  const error = status === 405 ? "Method not allowed" : "Skill not found";
  response.status(status).json({ error });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  const invalidJson = error.type === "entity.parse.failed";
  response
    .status(invalidJson ? 400 : 500)
    .json({ error: invalidJson ? "Invalid JSON request" : "Internal server error" });
});

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
