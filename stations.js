// Direct audio stream URLs.
//
// Replace ONLY these five constants after extracting the actual stream URLs
// from surprise.fm (DevTools -> Network while pressing Play).
//
// The .invalid domain is intentional: the server will refuse to send these
// placeholders to Alice, so a forgotten URL cannot silently point elsewhere.
const SURPRISE_FM_STREAM_URL = "https://replace-me.invalid/surprise-fm";
const STVOL_FM_STREAM_URL = "https://replace-me.invalid/stvol-fm";
const OTO_RADIO_STREAM_URL = "https://replace-me.invalid/oto-radio";
const KURS_RADIO_STREAM_URL = "https://replace-me.invalid/kurs-radio";
const PRIVATE_PERSONS_STREAM_URL = "https://replace-me.invalid/private-persons";

const STATIONS = Object.freeze({
  surprise: Object.freeze({
    id: "surprise",
    name: "Surprise.fm",
    invocation: "Включи Surprise.fm",
    streamUrl: SURPRISE_FM_STREAM_URL,
    token: "surprise-fm-live",
  }),

  stvol: Object.freeze({
    id: "stvol",
    name: "STVOL FM",
    invocation: "Включи STVOL FM",
    streamUrl: STVOL_FM_STREAM_URL,
    token: "stvol-fm-live",
  }),

  oto: Object.freeze({
    id: "oto",
    name: "OTO Radio",
    invocation: "Включи OTO Radio",
    streamUrl: OTO_RADIO_STREAM_URL,
    token: "oto-radio-live",
  }),

  kurs: Object.freeze({
    id: "kurs",
    name: "KURS Radio",
    invocation: "Включи KURS Radio",
    streamUrl: KURS_RADIO_STREAM_URL,
    token: "kurs-radio-live",
  }),

  "private-persons": Object.freeze({
    id: "private-persons",
    name: "PRIVATE PERSONS",
    invocation: "Включи PRIVATE PERSONS",
    streamUrl: PRIVATE_PERSONS_STREAM_URL,
    token: "private-persons-live",
  }),
});

module.exports = {
  SURPRISE_FM_STREAM_URL,
  STVOL_FM_STREAM_URL,
  OTO_RADIO_STREAM_URL,
  KURS_RADIO_STREAM_URL,
  PRIVATE_PERSONS_STREAM_URL,
  STATIONS,
};
