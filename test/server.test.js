const test = require("node:test");
const assert = require("node:assert/strict");
const { ROUTES } = require("../server");

test("Docker server exposes exactly five Alice webhook routes", () => {
  assert.deepEqual(ROUTES, {
    "/skills/surprise": "surprise",
    "/skills/stvol": "stvol",
    "/skills/oto": "oto",
    "/skills/kurs": "kurs",
    "/skills/private-persons": "private-persons",
  });
});
