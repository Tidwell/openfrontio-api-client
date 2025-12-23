import https from 'https';
import querystring from 'querystring';

function isNumeric(value) {
  return typeof value === "string" && /^\d+$/.test(value);
}
function convertStringBigIntsToBigInts(obj) {
  console.log("converting", JSON.stringify(obj));
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertStringBigIntsToBigInts(item));
  }
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (isNumeric(value)) {
      try {
        acc[key] = BigInt(value);
      } catch (e) {
        acc[key] = value;
      }
    } else if (typeof value === "object") {
      acc[key] = convertStringBigIntsToBigInts(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

const HOSTNAME = "api.openfront.io";
function makeRequest(path, params = {}) {
  return new Promise((resolve, reject) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    });
    const query = Object.keys(cleanParams).length > 0 ? "?" + querystring.stringify(cleanParams) : "";
    const fullPath = path + query;
    const options = {
      hostname: HOSTNAME,
      path: fullPath,
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "OpenFront-JS-Client/1.0"
      }
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const d = JSON.parse(data);
            resolve({ body: d, headers: res.headers });
          } else {
            const error = {
              statusCode: res.statusCode || 500,
              message: res.statusMessage,
              body: data
            };
            reject(error);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", (e) => {
      reject(e);
    });
    req.end();
  });
}
async function getGames(params) {
  const { start, end } = params;
  if (!start || !end) {
    throw new Error("Start and End timestamps are required.");
  }
  const { body, headers } = await makeRequest("/public/games", params);
  let total = 0;
  let rangeStart = 0;
  let rangeEnd = 0;
  const rangeHeader = headers["content-range"];
  if (rangeHeader && typeof rangeHeader === "string") {
    const match = rangeHeader.match(/games (\d+)-(\d+)\/(\d+)/);
    if (match) {
      rangeStart = parseInt(match[1], 10);
      rangeEnd = parseInt(match[2], 10);
      total = parseInt(match[3], 10);
    }
  }
  return {
    items: body,
    total,
    range: {
      start: rangeStart,
      end: rangeEnd
    }
  };
}
async function getGameInfo(params) {
  const { gameId, includeTurns = true, useBigInt = false } = params;
  const requestParams = {};
  if (includeTurns === false) {
    requestParams.turns = "false";
  }
  const { body } = await makeRequest(`/public/game/${gameId}`, requestParams);
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}
async function getPlayerInfo(params) {
  const { playerId, useBigInt = false } = params;
  const { body } = await makeRequest(
    `/public/player/${playerId}`
  );
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}
async function getPlayerSessions(params) {
  const { playerId, useBigInt = false } = params;
  const { body } = await makeRequest(
    `/public/player/${playerId}/sessions`
  );
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}
async function getClanLeaderboard() {
  const { body } = await makeRequest("/public/clans/leaderboard");
  return body;
}
async function getClanStats(params) {
  const { clanTag, ...options } = params;
  const { body } = await makeRequest(
    `/public/clan/${clanTag}`,
    options
  );
  return body;
}
async function getClanSessions(params) {
  const { clanTag, ...options } = params;
  const { body } = await makeRequest(
    `/public/clan/${clanTag}/sessions`,
    options
  );
  return body;
}
var index = {
  getGames,
  getGameInfo,
  getPlayerInfo,
  getPlayerSessions,
  getClanLeaderboard,
  getClanStats,
  getClanSessions
};

export { index as default, getClanLeaderboard, getClanSessions, getClanStats, getGameInfo, getGames, getPlayerInfo, getPlayerSessions };
