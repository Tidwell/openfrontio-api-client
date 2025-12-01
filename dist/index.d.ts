type GameType = 'Private' | 'Public' | 'Singleplayer';
type Coordinate = [number, number];
interface TurnData {
    source?: Coordinate;
    target?: Coordinate;
    amount?: number;
    unit?: number;
}
interface GameTurn {
    turn: number;
    type: string;
    player: string;
    data: TurnData;
    time: number;
}
interface GameMetadata {
    game: string;
    start: string;
    end: string;
    type: GameType;
    mode: string;
    difficulty: string;
}
interface GameInfo extends GameMetadata {
    turns: GameTurn[];
}
interface GameListOptions {
    type?: GameType;
    limit?: number;
    offset?: number;
}
interface PlayerElo {
    rating: number;
    kFactor: number;
}
interface PlayerInfo {
    id: string;
    name: string;
    elo: PlayerElo;
}
interface PlayerSession {
    gameId: string;
    clientId: string;
    start: string;
    end: string;
}
interface ClanLeaderboardEntry {
    tag: string;
    name: string;
    score: number;
}
interface ClanSession {
    totalPlayerCount: number;
    numTeams: number;
    clanPlayerCount: number;
    hasWon: boolean;
    timestamp: string;
}
interface ClanStatsDetail {
    wins: number;
    losses: number;
    winRate: number;
    winLossRatio: number;
    weightedWinLossRatio: number;
}
interface ClanStatsBreakdown {
    teamType: Record<string, ClanStatsDetail>;
    numTeams: Record<string, ClanStatsDetail>;
}
interface ClanStats {
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
    breakdown: ClanStatsBreakdown;
}
interface ClanOptions {
    start?: string;
    end?: string;
    limit?: number;
}

/**
 * Games
 */
/**
 * List Game Metadata
 * Get game IDs and basic metadata for games that started within a specified time range.
 */
declare function getGames(start: string, end: string, options?: GameListOptions): Promise<GameMetadata[]>;
/**
 * Get Game Info
 * Retrieve detailed information about a specific game.
 */
declare function getGameInfo(gameId: string, includeTurns?: boolean): Promise<GameInfo>;
/**
 * Players
 */
/**
 * Get Player Info
 * Retrieve information and stats for a specific player.
 */
declare function getPlayerInfo(playerId: string): Promise<PlayerInfo>;
/**
 * Get Player Sessions
 * Retrieve a list of games & client ids (session ids) for a specific player.
 */
declare function getPlayerSessions(playerId: string): Promise<PlayerSession[]>;
/**
 * Clans
 */
/**
 * Clan Leaderboard
 * Shows the top 100 clans by weighted wins.
 */
declare function getClanLeaderboard(): Promise<ClanLeaderboardEntry[]>;
/**
 * Clan Stats
 * Displays comprehensive clan performance statistics.
 */
declare function getClanStats(clanTag: string, options?: ClanOptions): Promise<ClanStats>;
/**
 * Clan Sessions
 * Retrieve clan sessions for a specific clan.
 */
declare function getClanSessions(clanTag: string, options?: ClanOptions): Promise<ClanSession[]>;

export { getClanLeaderboard, getClanSessions, getClanStats, getGameInfo, getGames, getPlayerInfo, getPlayerSessions };
