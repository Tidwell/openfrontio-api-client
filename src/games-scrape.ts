import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import {
  getGames,
  getGameInfo
} from './index.ts';

// Configuration Constants
const OUTPUT_DIR = 'games-data-output';

/**
 * Helper to save API responses to the filesystem.
 */
async function saveResponse(endpointName, paramsObj, data) {
  const paramString = Object.entries(paramsObj)
    .map(([key, value]) => `${key}-${value}`)
    .join('_');

  const safeParamString = paramString.replace(/[:.]/g, '-').replace(/[^a-zA-Z0-9-_\.]/g, '');
  
  const filename = safeParamString 
    ? `${endpointName}_${safeParamString}.json` 
    : `${endpointName}.json`;
    
  const filePath = path.join(OUTPUT_DIR, filename);

  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`   [Saved] ${filename}`);
}

async function runGameScraper() {
  try {
    console.log('--- OpenFront API: Games Fetcher ---\n');

    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // 1. GET GAMES (List)
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    const gamesParams = { 
      start: yesterday.toISOString(), 
      end: now.toISOString(), 
      limit: 10 // Adjust limit as needed
    };
    
    console.log(`1. Fetching games list (${gamesParams.limit} max)...`);
    const gamesList = await getGames(gamesParams.start, gamesParams.end, { limit: gamesParams.limit });
    
    // Save the master list
    await saveResponse('00_games-list', gamesParams, gamesList);

    // 2. ITERATE AND FETCH INDIVIDUAL GAME INFO
    // Note: Adjust depending on if the API returns an array directly or an object with an 'items' property
    const gamesArray = Array.isArray(gamesList) ? gamesList : (gamesList.items || []);

    console.log(`\n2. Found ${gamesArray.length} games. Fetching details for each...`);

    for (const game of gamesArray) {
      if (!game.game) {
        console.warn('   [Skip] Game object missing ID', game);
        continue;
      }

      console.log(`   > Fetching details for Game ID: ${game.game}...`);
      
      // Fetch specific details
      const gameDetails = await getGameInfo(game.game);
      
      // Save specific details
      await saveResponse('game-detail', { id: game.game }, gameDetails);
    }

    console.log(`\n--- Run Complete. Check the './${OUTPUT_DIR}' folder. ---`);

  } catch (error) {
    console.error('\n!!! Error running scraper !!!');
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Message: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

await runGameScraper();
