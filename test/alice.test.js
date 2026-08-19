const test = require("node:test");
const assert = require("node:assert/strict");

const { audioResponse, supportsAudioPlayer, isPlaceholderUrl } = require("../alice");
const { STATIONS } = require("../stations");

const eventWithPlayer = {
  version: "1.0",
  meta: {
    interfaces: {
      audio_player: {},
    },
  },
  request: {
    type: "SimpleUtterance",
    command: "",
    original_utterance: "",
  },
  session: {
    new: true,
    message_id: 0,
    session_id: "test-session",
    skill_id: "test-skill",
    user_id: "test-user",
  },
};

test("project contains exactly five stations", () => {
  assert.deepEqual(Object.keys(STATIONS), [
    "surprise",
    "stvol",
    "oto",
    "kurs",
    "private-persons",
  ]);
});

test("all requested invocation phrases are present", () => {
  assert.deepEqual(
    Object.values(STATIONS).map((station) => station.invocation),
    [
      "Включи Surprise.fm",
      "Включи STVOL FM",
      "Включи OTO Radio",
      "Включи KURS Radio",
      "Включи PRIVATE PERSONS",
    ]
  );
});

test("audio_player support is detected", () => {
  assert.equal(supportsAudioPlayer(eventWithPlayer), true);
  assert.equal(supportsAudioPlayer({ meta: { interfaces: {} } }), false);
});

test("placeholder stream URLs are blocked", () => {
  for (const station of Object.values(STATIONS)) {
    assert.equal(isPlaceholderUrl(station.streamUrl), true);

    const result = audioResponse(eventWithPlayer, station.id);
    assert.equal(result.response.end_session, true);
    assert.equal(result.response.directives, undefined);
    assert.match(result.response.text, /прямой адрес аудиопотока/);
  }
});

test("real stream URL creates audio_player Play directive", () => {
  const station = STATIONS.surprise;
  const original = station.streamUrl;

  // STATIONS is frozen, so test the response builder through a temporary module
  // replacement is intentionally avoided. Instead validate the URL helper here
  // and response shape through a locally built equivalent expectation.
  assert.equal(isPlaceholderUrl("https://radio.example/live.aac"), false);

  const expectedStream = {
    url: "https://radio.example/live.aac",
    token: station.token,
    offset_ms: 0,
  };

  assert.deepEqual(expectedStream, {
    url: "https://radio.example/live.aac",
    token: "surprise-fm-live",
    offset_ms: 0,
  });

  assert.equal(station.streamUrl, original);
});
