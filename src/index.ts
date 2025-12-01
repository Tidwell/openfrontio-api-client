import https from 'https';
import querystring from 'querystring';

import {
  ApiError,
  GameListItem,
  GameListOptions,
  PartialGameRecord,
  PlayerProfile,
  PlayerGame,
  ClanOptions,
  ClanLeaderboardResponse,
  ClanStats,
  ClanSession
} from './types';

const HOSTNAME = 'api.openfront.io';

/**
 * Helper function to make HTTPS GET requests.
 * @param path - The endpoint path (e.g., '/public/games').
 * @param params - Optional query parameters.
 * @returns Resolves with the parsed JSON response of type T.
 */
function makeRequest<T>(path: string, params: Record<string, any> = {}): Promise<T> {
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
        ? '?' + querystring.stringify(cleanParams)
        : '';
    const fullPath = path + query;

    const options: https.RequestOptions = {
      hostname: HOSTNAME,
      path: fullPath,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'OpenFront-JS-Client/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data) as T);
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

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

/**
 * Games
 */

/**
 * List Game Metadata
 * Get game IDs and basic metadata for games that started within a specified time range.
 * @param start - Unix timestamp (number) for the start of the range.
 * @param end - Unix timestamp (number) for the end of the range.
 */
export function getGames(start: number, end: number, options: GameListOptions = {}): Promise<GameListItem[]> {
  if (!start || !end) {
    throw new Error('Start and End timestamps are required.');
  }
  return makeRequest<GameListItem[]>('/public/games', {
    start,
    end,
    ...options,
  });
}

/**
 * Get Game Info
 * Retrieve detailed information about a specific game.
 * Note: The API response now follows the nested PartialGameRecord structure (version, info, turns).
 */
export function getGameInfo(gameId: string, includeTurns: boolean = true): Promise<PartialGameRecord> {
  const params: { turns?: string } = {};
  if (includeTurns === false) {
    params.turns = 'false';
  }
  return makeRequest<PartialGameRecord>(`/public/game/${gameId}`, params);
}

/**
 * Players
 */

/**
 * Get Player Info
 * Retrieve information and stats for a specific player.
 */
export function getPlayerInfo(playerId: string): Promise<PlayerProfile> {
  return makeRequest<PlayerProfile>(`/public/player/${playerId}`);
}

/**
 * Get Player Sessions
 * Retrieve a list of games & client ids (session ids) for a specific player.
 */
export function getPlayerSessions(playerId: string): Promise<PlayerGame[]> {
  return makeRequest<PlayerGame[]>(`/public/player/${playerId}/sessions`);
}

/**
 * Clans
 */

/**
 * Clan Leaderboard
 * Shows the top 100 clans by weighted wins.
 */
export function getClanLeaderboard(): Promise<ClanLeaderboardResponse[]> {
  return makeRequest<ClanLeaderboardResponse[]>('/public/clans/leaderboard');
}

/**
 * Clan Stats
 * Displays comprehensive clan performance statistics.
 */
export function getClanStats(clanTag: string, options: ClanOptions = {}): Promise<ClanStats> {
  return makeRequest<ClanStats>(`/public/clan/${clanTag}`, options as Record<string, any>);
}

/**
 * Clan Sessions
 * Retrieve clan sessions for a specific clan.
 */
export function getClanSessions(clanTag: string, options: ClanOptions = {}): Promise<ClanSession[]> {
  return makeRequest<ClanSession[]>(`/public/clan/${clanTag}/sessions`, options as Record<string, any>);
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
