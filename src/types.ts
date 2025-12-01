// Type definitions for OpenFront API

// -- Shared / Common --

// The JSON uses 1D indices for tiles (e.g. 593689), not [x,y] coordinates.
export type TileIndex = number; 

export type GameType = 'Private' | 'Public' | 'Singleplayer';

export interface ApiError {
  statusCode: number;
  message?: string;
  body: string;
}

// -- Configuration & Meta --

export interface GameConfig {
  gameMap: string;
  difficulty: string;
  donateGold: boolean;
  donateTroops: boolean;
  gameType: string;
  gameMode: string;
  gameMapSize: string;
  disableNPCs: boolean;
  bots: number;
  infiniteGold: boolean;
  infiniteTroops: boolean;
  instantBuild: boolean;
  disabledUnits: string[]; 
  playerTeams: number;
  randomSpawn: boolean;
}

// -- Player Stats Interfaces (New) --

export interface PlayerBoats {
  trade: string[];
  trans: string[];
}

export interface PlayerBombs {
  abomb: string[];
  hbomb: string[];
}

export interface PlayerUnits {
  city: string[];
  port: string[];
  saml: string[]; // Matches JSON key 'saml' (SAM Launcher)
  silo: string[]; // Matches JSON key 'silo' (Missile Silo)
  fact: string[]; // Matches JSON key 'fact' (Factory)
  defp: string[]; // Matches JSON key 'defp' (Defense Post)
  wshp: string[]; // Matches JSON key 'wshp' (Warship)
}

export interface PlayerStats {
  attacks: string[];
  conquests: string;
  boats: PlayerBoats;
  bombs: PlayerBombs;
  gold: string[];
  units: PlayerUnits;
}

// -- Player Interface (Updated) --

export interface PlayerCosmetics {
  flag: string;
}

export interface Player {
  clientID: string;
  username: string;
  cosmetics: PlayerCosmetics;
  persistentID: string | null;
  stats: PlayerStats; // Added
}

// -- Game Metadata (Updated) --

export interface GameMetadata {
  gameID: string;
  config: GameConfig;
  players: Player[];
  lobbyCreatedAt: number;
  start: number;
  end: number;
  duration: number;
  num_turns: number;
  winner?: string[]; // Added: e.g. ["player", "nfaUr2ZD"]
  lobbyFillTime: number;
}

// -- Turns & Intents --

interface BaseIntent {
  clientID: string;
  type: string;
}

export interface SpawnIntent extends BaseIntent {
  type: 'spawn';
  tile: TileIndex;
}

export interface AttackIntent extends BaseIntent {
  type: 'attack';
  targetID: string | null;
  troops: number;
}

// Updated: src can be null
export interface BoatIntent extends BaseIntent {
  type: 'boat';
  targetID: string | null;
  troops: number;
  dst: TileIndex;
  src: TileIndex | null; 
}

export interface AllianceIntent extends BaseIntent {
  type: 'allianceRequest' | 'allianceExtension';
  recipient: string;
}

export interface BuildUnitIntent extends BaseIntent {
  type: 'build_unit';
  unit: string;
  tile: TileIndex;
}

export type TurnIntent = 
  | SpawnIntent 
  | AttackIntent 
  | BoatIntent 
  | AllianceIntent 
  | BuildUnitIntent;

export interface GameTurn {
  turnNumber: number;
  intents: TurnIntent[];
  hash?: number;
}

// -- Root Game Object --

export interface GameInfo {
  version: string;
  gitCommit: string;
  domain: string;
  subdomain: string;
  info: GameMetadata;
  turns: GameTurn[];
}

export interface GameListOptions {
  type?: GameType;
  limit?: number;
  offset?: number;
}

// -- Players Info Endpoint --

export interface PlayerElo {
  rating: number;
  kFactor: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  elo: PlayerElo;
}

export interface PlayerSession {
  gameId: string;
  clientId: string;
  start: string;
  end: string;
}

// -- Clans --

export interface ClanLeaderboardEntry {
  tag: string;
  name: string;
  score: number;
}

export interface ClanSession {
  totalPlayerCount: number;
  numTeams: number;
  clanPlayerCount: number;
  hasWon: boolean;
  timestamp: string;
}

export interface ClanStatsDetail {
  wins: number;
  losses: number;
  winRate: number;
  winLossRatio: number;
  weightedWinLossRatio: number;
}

export interface ClanStatsBreakdown {
  teamType: Record<string, ClanStatsDetail>;
  numTeams: Record<string, ClanStatsDetail>;
}

export interface ClanStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  breakdown: ClanStatsBreakdown;
}

export interface ClanOptions {
  start?: string;
  end?: string;
  limit?: number;
}
