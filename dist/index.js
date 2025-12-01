import https from 'https';
import querystring from 'querystring';

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
            resolve(JSON.parse(data));
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
function getGameInfo(gameId, includeTurns = true) {
  const params = {};
  if (includeTurns === false) {
    params.turns = "false";
  }
  return makeRequest(`/public/game/${gameId}`, params);
}
function getPlayerInfo(playerId) {
  return makeRequest(`/public/player/${playerId}`);
}
function getPlayerSessions(playerId) {
  return makeRequest(`/public/player/${playerId}/sessions`);
}
function getClanLeaderboard() {
  return makeRequest("/public/clans/leaderboard");
}
function getClanStats(clanTag, options = {}) {
  return makeRequest(`/public/clan/${clanTag}`, options);
}
function getClanSessions(clanTag, options = {}) {
  return makeRequest(`/public/clan/${clanTag}/sessions`, options);
}

export { getClanLeaderboard, getClanSessions, getClanStats, getGameInfo, getGames, getPlayerInfo, getPlayerSessions };
