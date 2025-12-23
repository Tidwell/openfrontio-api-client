import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import {
  getGames,
  getGameInfo,
  getPlayerInfo,
  getPlayerSessions,
  getClanLeaderboard,
  getClanStats,
  getClanSessions,
} from "../src";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shouldWrite = process.env.WRITE_API_RESPONSES === "true";
const tmpDir = path.join(__dirname, ".tmp");

if (shouldWrite && !fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const writeResponse = (name, data) => {
  if (shouldWrite) {
    fs.writeFileSync(
      path.join(tmpDir, `${name}.json`),
      JSON.stringify(data, null, 2),
    );
  }
};

describe("E2E API Schema Validation", () => {
  let fetchedGameId;
  let fetchedClanTag;
  const playerId = "HabCsQYR";

  it("should validate getGames response", async () => {
    const games = await getGames({
      start: new Date(Date.now() - 86400000).toISOString(), // Last 24 hours
      end: new Date().toISOString(),
      limit: 5,
    });

    writeResponse("getGames", games);
    expect(typeof games.total).toBe("number");
    expect(Array.isArray(games.items)).toBe(true);
    console.log(`Fetched ${games.items.length} games (Total: ${games.total})`);

    if (games.items.length > 0) {
      fetchedGameId = games.items[0].game;
    }
  });

  it("should validate getGameInfo response", async () => {
    if (!fetchedGameId) {
      console.warn("Skipping getGameInfo test (no games found in range)");
      return;
    }

    console.log(`Testing getGameInfo for gameId: ${fetchedGameId}...`);
    const gameInfo = await getGameInfo({ gameId: fetchedGameId });
    writeResponse("getGameInfo", gameInfo);
    expect(gameInfo).toBeDefined();
    expect(gameInfo.info).toBeDefined();
  });

  it("should validate getClanLeaderboard response", async () => {
    const leaderboard = await getClanLeaderboard();
    writeResponse("getClanLeaderboard", leaderboard);
    expect(Array.isArray(leaderboard.clans)).toBe(true);

    if (leaderboard.clans.length > 0) {
      // Extract a clan tag for subsequent tests
      if (leaderboard.clans && leaderboard.clans.length > 0) {
        fetchedClanTag = leaderboard.clans[0].clanTag;
      }
    }
  });

  it("should validate getClanStats and getClanSessions", async () => {
    if (!fetchedClanTag) {
      console.warn("Skipping clan stats tests (no clan tag found)");
      return;
    }

    console.log(`Testing getClanStats for tag: ${fetchedClanTag}...`);
    const stats = await getClanStats({ clanTag: fetchedClanTag });
    writeResponse("getClanStats", stats);
    expect(stats).toBeDefined();
    expect(stats.clan).toBeDefined();

    console.log(`Testing getClanSessions for tag: ${fetchedClanTag}...`);
    const sessions = await getClanSessions({ clanTag: fetchedClanTag });
    writeResponse("getClanSessions", sessions);
    expect(Array.isArray(sessions)).toBe(true);
  });

  it("should validate getPlayerInfo and getPlayerSessions", async () => {
    console.log(`Testing getPlayerInfo for playerId: ${playerId}...`);
    const player = await getPlayerInfo({ playerId });
    writeResponse("getPlayerInfo", player);
    expect(player).toBeDefined();
    expect(player.createdAt).toBeDefined();

    console.log(`Testing getPlayerSessions for playerId: ${playerId}...`);
    const sessions = await getPlayerSessions({ playerId });
    writeResponse("getPlayerSessions", sessions);
    expect(sessions).toBeDefined();
    expect(Array.isArray(sessions)).toBe(true);
  });
});
