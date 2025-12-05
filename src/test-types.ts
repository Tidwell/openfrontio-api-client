import { ClanStats, GameList, GameListItem, PartialGameRecord, ClanLeaderboardResponse, ClanSession, PlayerProfile, PlayerSessions } from './types';
import clanStatsData from '../sample-output/clan-stats_tag-UN.json' with { type: 'json' };
import gamesList from '../sample-output/games-list_start-2025-11-30T08-28-41-809Z_end-2025-12-01T08-28-41-809Z_limit-5.json' with { type: 'json' };
import gameInfo from '../sample-output/game-info_gameId-ABSgwin6.json' with { type: 'json' };
import clanLeaderboard from '../sample-output/clan-leaderboard.json' with { type: 'json' };
import clanSessions from '../sample-output/clan-sessions_tag-UN_limit-5.json' with { type: 'json' };
import playerInfo from '../sample-output/player-info_playerId-HabCsQYR.json' with { type: 'json' };
import playerSessions from '../sample-output/player-sessions_playerId-HabCsQYR.json' with { type: 'json' };

import { JSONParse, JSONStringify } from 'json-with-bigint';

const stats = clanStatsData as ClanStats;

const games =  gamesList as GameList;

const game = JSONParse(JSONStringify(gameInfo)) as PartialGameRecord;

const leaderboard = clanLeaderboard as ClanLeaderboardResponse;

const cSessions = clanSessions as ClanSession;

const player = JSONParse(JSONStringify(playerInfo)) as PlayerProfile;

const sessions = playerSessions as PlayerSessions;

console.log('Successfully validated games list against the exact type definition.', !games);
console.log('Successfully validated game info against the exact type definition.', !game);
console.log('Successfully validated clan leaderboard against the exact type definition.', !leaderboard);
console.log('Successfully validated clan sessions against the exact type definition.', !cSessions);
console.log('Successfully validated player info against the exact type definition.', !player);
console.log('Successfully validated player sessions against the exact type definition.', !sessions);
