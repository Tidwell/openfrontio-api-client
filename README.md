# OpenFront JS API Client

A JavaScript/TypeScript client for the OpenFront API.

## Installation

```bash
npm install openfront-api
```

## Usage

```typescript
import { getGames, getGameInfo } from 'openfront-api';

// Example: Fetch games
const games = await getGames({
  start: new Date(Date.now() - 86400000).toISOString(),
  end: new Date().toISOString()
});
```

## API Reference

### Games

#### `getGames(options)`

Get game IDs and basic metadata for games that started within a specified time range. Results are paginated.

**Parameters:**

- `options` (`GameListOptions`):
  - `start` (string, required): ISO 8601 timestamp for the start of the range.
  - `end` (string, required): ISO 8601 timestamp for the end of the range.
  - `type` (`GameType`, optional): Filter by game type (e.g., 'Singleplayer', 'Public', 'Private').
  - `limit` (number, optional): Number of results (max 1000, default 50).
  - `offset` (number, optional): Pagination offset.

**Returns:** `Promise<PaginatedGameList>`

The response includes the list of items, total count, and the current range.

```typescript
const result = await getGames({
  start: '2025-10-25T00:00:00Z',
  end: '2025-10-26T23:59:59Z',
  limit: 10,
  type: 'Singleplayer'
});

console.log(result.items); // GameListItem[]
console.log(result.total); // Total number of games matching criteria
```

#### `getGameInfo(params)`

Retrieve detailed information about a specific game.

**Parameters:**

- `params` (`GetGameInfoParams`):
  - `gameId` (string, required): The ID of the game.
  - `includeTurns` (boolean, optional): Whether to include turn data. Defaults to `true`. Set to `false` to reduce response size.

**Returns:** `Promise<PartialGameRecord>`

```typescript
const game = await getGameInfo({
  gameId: 'ABSgwin6',
  includeTurns: false
});
```

### Players

#### `getPlayerInfo(params)`

Retrieve information and stats for a specific player.

**Parameters:**

- `params` (`GetPlayerInfoParams`):
  - `playerId` (string, required): The ID of the player.

**Returns:** `Promise<PlayerProfile>`

```typescript
const player = await getPlayerInfo({ playerId: 'HabCsQYR' });
```

#### `getPlayerSessions(params)`

Retrieve a list of games and session IDs for a specific player.

**Parameters:**

- `params` (`GetPlayerSessionsParams`):
  - `playerId` (string, required): The ID of the player.

**Returns:** `Promise<PlayerSessions>`

```typescript
const sessions = await getPlayerSessions({ playerId: 'HabCsQYR' });
```

### Clans

#### `getClanLeaderboard()`

Shows the top 100 clans by weighted wins.

**Returns:** `Promise<ClanLeaderboardResponse[]>`

```typescript
const leaderboard = await getClanLeaderboard();
```

#### `getClanStats(params)`

Displays comprehensive clan performance statistics.

**Parameters:**

- `params` (`GetClanStatsParams`):
  - `clanTag` (string, required): The clan tag.
  - `start` (string, optional): ISO 8601 timestamp.
  - `end` (string, optional): ISO 8601 timestamp.

**Returns:** `Promise<ClanStats>`

```typescript
const stats = await getClanStats({
  clanTag: 'UN',
  start: '2025-11-15T00:00:00Z'
});
```

#### `getClanSessions(params)`

Retrieve clan sessions for a specific clan.

**Parameters:**

- `params` (`GetClanSessionsParams`):
  - `clanTag` (string, required): The clan tag.
  - `start` (string, optional): ISO 8601 timestamp.
  - `end` (string, optional): ISO 8601 timestamp.

**Returns:** `Promise<ClanSession[]>`

```typescript
const sessions = await getClanSessions({
  clanTag: 'UN'
});
```
