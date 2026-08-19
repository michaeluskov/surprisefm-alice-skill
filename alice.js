const { STATIONS } = require("./stations");

function supportsAudioPlayer(event) {
  return Boolean(event?.meta?.interfaces?.audio_player);
}

function isPlaceholderUrl(url) {
  try {
    return new URL(url).hostname.endsWith(".invalid");
  } catch {
    return true;
  }
}

function textResponse(version, text) {
  return {
    version: version || "1.0",
    response: {
      text,
      end_session: true,
    },
  };
}

function audioResponse(event, stationId) {
  const version = event?.version || "1.0";
  const station = STATIONS[stationId];

  if (!station) {
    return textResponse(version, "Неизвестная радиостанция.");
  }

  if (!supportsAudioPlayer(event)) {
    return textResponse(
      version,
      `На этом устройстве недоступен аудиоплеер для ${station.name}.`
    );
  }

  if (isPlaceholderUrl(station.streamUrl)) {
    return textResponse(
      version,
      `Для ${station.name} пока не указан прямой адрес аудиопотока.`
    );
  }

  return {
    version,
    response: {
      text: `Включаю ${station.name}`,
      tts: `Включаю ${station.name}`,
      end_session: true,
      directives: {
        audio_player: {
          action: "Play",
          item: {
            stream: {
              url: station.streamUrl,
              token: station.token,
              offset_ms: 0,
            },
          },
        },
      },
    },
  };
}

module.exports = {
  audioResponse,
  supportsAudioPlayer,
  isPlaceholderUrl,
};
