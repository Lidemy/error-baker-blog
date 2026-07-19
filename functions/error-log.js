"use strict";

// Front-end error beacon sink.
//
// Receives the JSON that src/main.js's error beacon sends via navigator
// .sendBeacon, writes a sanitized one-line record to the Netlify function
// logs, and returns 204 with an empty body. It NEVER echoes the input back
// (no reflection surface), validates/truncates every field, and persists
// nothing beyond the log line. No PII is expected or stored — only technical
// fields (message/source/line/col/stack/path/UA).

const LIMITS = {
  message: 500,
  source: 500,
  stack: 2000,
  path: 300,
  ua: 300,
};

function str(value, max) {
  if (typeof value !== "string") return "";
  return value.length > max ? value.slice(0, max) : value;
}

function nonNegInt(value) {
  const n = typeof value === "number" ? value : parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

// Exported so the sanitizer can be unit-tested without HTTP plumbing.
function sanitize(data) {
  return {
    ts: new Date().toISOString(),
    message: str(data.message, LIMITS.message),
    source: str(data.source, LIMITS.source),
    line: nonNegInt(data.line),
    col: nonNegInt(data.col),
    stack: str(data.stack, LIMITS.stack),
    path: str(data.path, LIMITS.path),
    ua: str(data.ua, LIMITS.ua),
  };
}

exports.sanitize = sanitize;
exports.LIMITS = LIMITS;

exports.handler = async function handler(event) {
  // Only accept the beacon POST. Anything else is a no-op.
  if (!event || event.httpMethod !== "POST") {
    return { statusCode: 405, body: "" };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    // Malformed payload: acknowledge quietly, don't log attacker-controlled noise.
    return { statusCode: 204, body: "" };
  }

  // A useful report must at least carry a message string.
  if (!data || typeof data !== "object" || typeof data.message !== "string" || !data.message) {
    return { statusCode: 204, body: "" };
  }

  const record = sanitize(data);

  // Netlify captures stdout into the function logs; that is the whole sink.
  // eslint-disable-next-line no-console
  console.log("[client-error] " + JSON.stringify(record));

  // 204 No Content: nothing is reflected back to the caller.
  return { statusCode: 204, body: "" };
};
