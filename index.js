const { audioResponse } = require("./alice");

// Five independent Yandex Cloud Functions handlers.
// Each Alice skill can point to its own entry point:
//
//   index.surprise
//   index.stvol
//   index.oto
//   index.kurs
//   index.privatePersons
//
// The Docker HTTP server exposes the same handlers on five different paths.

module.exports.surprise = async (event) => audioResponse(event, "surprise");
module.exports.stvol = async (event) => audioResponse(event, "stvol");
module.exports.oto = async (event) => audioResponse(event, "oto");
module.exports.kurs = async (event) => audioResponse(event, "kurs");
module.exports.privatePersons = async (event) =>
  audioResponse(event, "private-persons");
