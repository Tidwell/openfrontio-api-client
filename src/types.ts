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
  // Inferred from JSON value "Medium"
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  donateGold: boolean;
  donateTroops: boolean;
  gameType: string;
  // Inferred from JSON value "Free For All"
  gameMode: 'Free For All' | 'Team' | string;
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

// -- Player Stats Interfaces --

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

// -- Player Interface --

export interface PlayerCosmetics {
  flag: string;
}

export interface Player {
  clientID: string;
  username: string;
  cosmetics: PlayerCosmetics;
  persistentID: string | null;
  stats: PlayerStats;
}

// -- Game Metadata --

export interface GameMetadata {
  gameID: string;
  config: GameConfig;
  players: Player[];
  lobbyCreatedAt: number;
  start: number;
  end: number;
  duration: number;
  num_turns: number;
  // Updated: Defined as a tuple [Type, ID] based on JSON ["player", "nfaUr2ZD"]
  winner?: [string, string];
  lobbyFillTime: number;
}

// -- Turns & Intents --

// New: Specific unit names found in the game JSON
export type UnitName =
  | 'City'
  | 'Port'
  | 'Factory'
  | 'SAM Launcher'
  | 'Missile Silo'
  | 'Atom Bomb'
  | 'Hydrogen Bomb'
  | 'Warship'
  | 'Defense Post';

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
  unit: UnitName; // Updated from string to UnitName union
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
