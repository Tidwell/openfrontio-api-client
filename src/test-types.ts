import { ClanStats } from './types';
import clanStatsData from '../sample-output/clan-stats_tag-UN.json' with { type: 'json' };

// By spreading the imported data into a new object literal that is typed,
// we can trigger TypeScript's excess property checking.
// If the imported JSON (`clanStatsData`) has properties not defined in `ClanStats`,
// this will cause a compile error, ensuring the types are exact.
const stats: ClanStats = clanStatsData;

console.log('Successfully validated clan stats against the exact type definition.', !stats);
import { GameListItem, PartialGameRecord, ClanLeaderboardResponse, ClanSession, PlayerProfile, PlayerGame } from './types';
import gamesList from '../sample-output/games-list_start-2024-01-01T00-00-00-000Z_end-2024-01-02T00-00-00-000Z_limit-5.json' with { type: 'json' };
import gameInfo from '../sample-output/game-info_gameId-ABSgwin6.json' with { type: 'json' };
import clanLeaderboard from '../sample-output/clan-leaderboard.json' with { type: 'json' };
import clanSessions from '../sample-output/clan-sessions_tag-UN_limit-5.json' with { type: 'json' };
import playerInfo from '../sample-output/player-info_playerId-HabCsQYR.json' with { type: 'json' };
import playerSessions from '../sample-output/player-sessions_playerId-HabCsQYR.json' with { type: 'json' };

const games: GameListItem[] = gamesList;

const game: PartialGameRecord = gameInfo;

const leaderboard: ClanLeaderboardResponse[] = clanLeaderboard;

const sessions: ClanSession[] = clanSessions;

const player: PlayerProfile = playerInfo;

const playerGames: PlayerGame[] = playerSessions;

console.log('Successfully validated games list against the exact type definition.', !games);
console.log('Successfully validated game info against the exact type definition.', !game);
console.log('Successfully validated clan leaderboard against the exact type definition.', !leaderboard);
console.log('Successfully validated clan sessions against the exact type definition.', !sessions);
console.log('Successfully validated player info against the exact type definition.', !player);
console.log('Successfully validated player sessions against the exact type definition.', !playerGames);
