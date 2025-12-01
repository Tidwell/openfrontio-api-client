// import * as ApiSchemas from 'openfront-client/src/core/ApiSchemas';
import {
  Difficulty,
  GameMode,
  GameType,
} from 'openfront-client/src/core/game/Game';
import {
  PartialGameRecord as OriginalPartialGameRecord,
  TeamCountConfig,
  GameID,
} from 'openfront-client/src/core/Schemas';

type OriginalInfo = OriginalPartialGameRecord['info'];
type OriginalConfig = OriginalInfo['config'];

type ModifiedConfig = Omit<OriginalConfig, 'randomSpawn'> & {
  randomSpawn?: boolean;
};

type ModifiedInfo = Omit<OriginalInfo, 'lobbyCreatedAt' | 'lobbyFillTime' | 'config'> & {
  lobbyCreatedAt?: number;
  lobbyFillTime?: number;
  config: ModifiedConfig;
};

export type PartialGameRecord = Omit<OriginalPartialGameRecord, 'info' | 'version'> & {
  info: ModifiedInfo;
  version: string;
};

export { TeamCountConfig, GameID };
import {
  ClanLeaderboardEntry
} from 'openfront-client/src/core/ApiSchemas';
export {
  PlayerProfile,
  PlayerGame,
  ClanLeaderboardResponse,
} from 'openfront-client/src/core/ApiSchemas';



export interface WL {
  wl: number[];
  weightedWL: number[];
}

export interface TeamClanLeaderboardEntry extends ClanLeaderboardEntry {
  teamTypeWL: Record<string, WL>;
  teamCountWL: Record<string, WL>;
}

export type ClanStats = {
  clan: TeamClanLeaderboardEntry
}
export type ClanSession = {
  gameId: GameID;
  clanTag: string;
  clanPlayerCount: number;
  hasWon: boolean;
  numTeams: number;
  playerTeams: TeamCountConfig;
  totalPlayerCount: number;
  gameStart: string;
  score: number;
};

export type GameListOptions = {
  type?: GameType;
  limit?: number;
  offset?: number;
};

export type GameListItem = {
  game: GameID;
  start: number;
  end: number;
  type: GameType;
  mode: GameMode;
  difficulty: Difficulty;
};

export type ApiError = {
  statusCode: number;
  message?: string;
  body: string;
}

export type ClanOptions = {
  start?: string;
  end?: string;
  limit?: number;
}

// const types = {
//   GameListOptions,
//   GameListItem,
//   ...ApiSchemas,
//   ...Schemas
// };

// console.log(Object.keys(Schemas));

// export default types;
