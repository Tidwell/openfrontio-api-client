import https from 'https';
import querystring from 'querystring';

function isNumeric(value) {
  return typeof value === "string" && /^\d+$/.test(value);
}
function convertStringBigIntsToBigInts(obj) {
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
            resolve(d);
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
function getGames(start, end, options = {}) {
  if (!start || !end) {
    throw new Error("Start and End timestamps are required.");
  }
  return makeRequest("/public/games", {
    start,
    end,
    ...options
  });
}
async function getGameInfo(gameId, includeTurns = true) {
  const params = {};
  if (includeTurns === false) {
    params.turns = "false";
  }
  const game = await makeRequest(`/public/game/${gameId}`, params);
  return convertStringBigIntsToBigInts(game);
}
async function getPlayerInfo(playerId) {
  const profile = await makeRequest(
    `/public/player/${playerId}`
  );
  return convertStringBigIntsToBigInts(profile);
}
async function getPlayerSessions(playerId) {
  const sessions = await makeRequest(
    `/public/player/${playerId}/sessions`
  );
  return convertStringBigIntsToBigInts(sessions);
}
function getClanLeaderboard() {
  return makeRequest("/public/clans/leaderboard");
}
function getClanStats(clanTag, options = {}) {
  return makeRequest(
    `/public/clan/${clanTag}`,
    options
  );
}
function getClanSessions(clanTag, options = {}) {
  return makeRequest(
    `/public/clan/${clanTag}/sessions`,
    options
  );
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
