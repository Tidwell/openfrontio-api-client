import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import {
  getGames,
  getGameInfo,
  getPlayerInfo,
  getPlayerSessions,
  getClanLeaderboard,
  getClanStats,
  getClanSessions
} from './index.js';

// Configuration Constants
const GAME_ID = 'ABSgwin6';
const CLAN_TAG = 'UN';
const PLAYER_ID = 'HabCsQYR';
const OUTPUT_DIR = 'sample-output';

/**
 * Helper to save API responses to the filesystem.
 * It constructs a filename based on the endpoint name and parameters.
 */
async function saveResponse(endpointName, paramsObj, data) {
  // 1. Convert params object to a string (e.g., "id-123_limit-5")
  const paramString = Object.entries(paramsObj)
    .map(([key, value]) => `${key}-${value}`)
    .join('_');

  // 2. Sanitize filename: remove/replace characters invalid in file systems (like : in timestamps)
  const safeParamString = paramString.replace(/[:.]/g, '-').replace(/[^a-zA-Z0-9-_\.]/g, '');
  
  // 3. Construct full path
  // If there are no params (like leaderboard), just use the endpoint name
  const filename = safeParamString 
    ? `${endpointName}_${safeParamString}.json` 
    : `${endpointName}.json`;
    
  const filePath = path.join(OUTPUT_DIR, filename);

  // 4. Write file
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`   [Saved] ${filename}`);
}

async function runSample() {
  try {
    console.log('--- OpenFront API Library Sample (File Output Mode) ---\n');

    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // 1. GET GAMES (List)
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const gamesParams = { 
      start: yesterday.toISOString(), 
      end: now.toISOString(), 
      limit: 5 
    };
    
    console.log(`1. Fetching games list...`);
    const games = await getGames(gamesParams.start, gamesParams.end, { limit: gamesParams.limit });
    await saveResponse('games-list', gamesParams, games);


    // 2. GET GAME INFO (Specific)
    console.log(`\n2. Fetching details for Game ID: ${GAME_ID}...`);
    const gameInfo = await getGameInfo(GAME_ID);
    await saveResponse('game-info', { gameId: GAME_ID }, gameInfo);


    // 3. GET CLAN LEADERBOARD
    console.log('\n3. Fetching Clan Leaderboard...');
    const leaderboard = await getClanLeaderboard();
    await saveResponse('clan-leaderboard', {}, leaderboard);


    // 4. GET CLAN STATS
    console.log(`\n4. Fetching stats for Clan Tag: ${CLAN_TAG}...`);
    const clanStats = await getClanStats(CLAN_TAG);
    await saveResponse('clan-stats', { tag: CLAN_TAG }, clanStats);


    // 5. GET CLAN SESSIONS
    const sessionParams = { limit: 5 };
    console.log(`\n5. Fetching sessions for Clan Tag: ${CLAN_TAG}...`);
    const clanSessions = await getClanSessions(CLAN_TAG, sessionParams);
    await saveResponse('clan-sessions', { tag: CLAN_TAG, ...sessionParams }, clanSessions);


    // 6. GET PLAYER INFO
    console.log(`\n6. Fetching info for Player ID: ${PLAYER_ID}...`);
    const playerInfo = await getPlayerInfo(PLAYER_ID);
    await saveResponse('player-info', { playerId: PLAYER_ID }, playerInfo);


    // 7. GET PLAYER SESSIONS
    console.log(`\n7. Fetching sessions for Player ID: ${PLAYER_ID}...`);
    const playerSessions = await getPlayerSessions(PLAYER_ID);
    await saveResponse('player-sessions', { playerId: PLAYER_ID }, playerSessions);


    console.log(`\n--- Sample Run Complete. Check the './${OUTPUT_DIR}' folder. ---`);

  } catch (error) {
    console.error('\n!!! Error running sample !!!');
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Message: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

await runSample();
