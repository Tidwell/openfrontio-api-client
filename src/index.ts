import https from "https";
import { IncomingHttpHeaders } from "http";
import querystring from "querystring";
import { convertStringBigIntsToBigInts } from "./utils";

import {
  ApiError,
  GameListItem,
  GameListOptions,
  PartialGameRecord,
  PlayerProfile,
  ClanOptions,
  ClanLeaderboardResponse,
  ClanStats,
  ClanSession,
  PlayerSessions,
  PaginatedGameList,
} from "./types";

const HOSTNAME = "api.openfront.io";

interface ApiResponse<T> {
  body: T;
  headers: IncomingHttpHeaders;
}

/**
 * Helper function to make HTTPS GET requests.
 * @param path - The endpoint path (e.g., '/public/games').
 * @param params - Optional query parameters.
 * @returns Resolves with the parsed JSON response of type T.
 */
function makeRequest<T>(
  path: string,
  params: Record<string, any> = {},
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    // Filter out undefined/null parameters
    const cleanParams: Record<string, any> = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    });

    const query =
      Object.keys(cleanParams).length > 0
        ? "?" + querystring.stringify(cleanParams)
        : "";
    const fullPath = path + query;

    const options: https.RequestOptions = {
      hostname: HOSTNAME,
      path: fullPath,
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "OpenFront-JS-Client/1.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      // A chunk of data has been received.
      res.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on("end", () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const d = JSON.parse(data) as T;
            resolve({ body: d, headers: res.headers });
          } else {
            const error: ApiError = {
              statusCode: res.statusCode || 500,
              message: res.statusMessage,
              body: data,
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

/**
 * List Game Metadata
 * Get game IDs and basic metadata for games that started within a specified time range.
 * @param params - Object containing start, end, and optional type/limit/offset params.
 */
export async function getGames(
  params: GameListOptions,
): Promise<PaginatedGameList> {
  const { start, end } = params;
  if (!start || !end) {
    throw new Error("Start and End timestamps are required.");
  }
  const { body, headers } = await makeRequest<GameListItem[]>(
    "/public/games",
    params,
  );

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
      end: rangeEnd,
    },
  };
}

export interface GetGameInfoParams {
  gameId: string;
  includeTurns?: boolean;
  useBigInt?: boolean;
}

/**
 * Get Game Info
 * Retrieve detailed information about a specific game.
 */
export async function getGameInfo(
  params: GetGameInfoParams,
): Promise<PartialGameRecord> {
  const { gameId, includeTurns = true, useBigInt = false } = params;
  const requestParams: { turns?: string } = {};
  if (includeTurns === false) {
    requestParams.turns = "false";
  }
  const { body } = await makeRequest<PartialGameRecord>(
    `/public/game/${gameId}`,
    requestParams,
  );
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}

/**
 * Players
 */

export interface GetPlayerInfoParams {
  playerId: string;
  useBigInt?: boolean;
}

/**
 * Get Player Info
 * Retrieve information and stats for a specific player.
 */
export async function getPlayerInfo(
  params: GetPlayerInfoParams,
): Promise<PlayerProfile> {
  const { playerId, useBigInt = false } = params;
  const { body } = await makeRequest<PlayerProfile>(
    `/public/player/${playerId}`,
  );
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}

export interface GetPlayerSessionsParams {
  playerId: string;
  useBigInt?: boolean;
}

/**
 * Get Player Sessions
 * Retrieve a list of games & client ids (session ids) for a specific player.
 */
export async function getPlayerSessions(
  params: GetPlayerSessionsParams,
): Promise<PlayerSessions> {
  const { playerId, useBigInt = false } = params;
  const { body } = await makeRequest<PlayerSessions>(
    `/public/player/${playerId}/sessions`,
  );
  return useBigInt ? convertStringBigIntsToBigInts(body) : body;
}

/**
 * Clans
 */

/**
 * Clan Leaderboard
 * Shows the top 100 clans by weighted wins.
 */
export async function getClanLeaderboard(): Promise<ClanLeaderboardResponse[]> {
  const { body } = await makeRequest<ClanLeaderboardResponse[]>(
    "/public/clans/leaderboard",
  );
  return body;
}

export interface GetClanStatsParams extends ClanOptions {
  clanTag: string;
}

/**
 * Clan Stats
 * Displays comprehensive clan performance statistics.
 */
export async function getClanStats(
  params: GetClanStatsParams,
): Promise<ClanStats> {
  const { clanTag, ...options } = params;
  const { body } = await makeRequest<ClanStats>(
    `/public/clan/${clanTag}`,
    options as Record<string, any>,
  );
  return body;
}

export interface GetClanSessionsParams extends ClanOptions {
  clanTag: string;
}

/**
 * Clan Sessions
 * Retrieve clan sessions for a specific clan.
 */
export async function getClanSessions(
  params: GetClanSessionsParams,
): Promise<ClanSession[]> {
  const { clanTag, ...options } = params;
  const { body } = await makeRequest<ClanSession[]>(
    `/public/clan/${clanTag}/sessions`,
    options as Record<string, any>,
  );
  return body;
}

export default {
  getGames,
  getGameInfo,
  getPlayerInfo,
  getPlayerSessions,
  getClanLeaderboard,
  getClanStats,
  getClanSessions,
};

export * from "./types";
