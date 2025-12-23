import { describe, it, expect, vi, beforeEach } from 'vitest';
import https from 'https';
import { EventEmitter } from 'events';
import api from '../src/index.ts';

vi.mock('https');

describe('OpenFront API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockApiResponse = (body, statusCode = 200, headers = {}) => {
    const req = new EventEmitter();
    req.end = vi.fn();

    const res = new EventEmitter();
    res.statusCode = statusCode;
    res.headers = headers;
    res.statusMessage = statusCode === 200 ? 'OK' : 'Error';
    https.request.mockImplementation((options, callback) => {
      if (callback) {
        callback(res);
      }
      res.emit('data', typeof body === 'string' ? body : JSON.stringify(body));
      res.emit('end');
      return req;
    });

    return req;
  };

  describe('getGames', () => {
    it('should fetch games with correct parameters and parse pagination headers', async () => {
      const mockGames = [{ game: 'game123', type: 'Public' }];
      mockApiResponse(mockGames, 200, { 'content-range': 'games 0-1/100' });

      const result = await api.getGames({
        start: '2023-01-01',
        end: '2023-01-02',
        limit: 10,
        type: 'Public',
      });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: 'api.openfront.io',
          path: expect.stringContaining('/public/games'),
          method: 'GET',
        }),
        expect.any(Function)
      );

      const callArgs = https.request.mock.calls[0][0];
      expect(callArgs.path).toContain('start=2023-01-01');
      expect(callArgs.path).toContain('end=2023-01-02');
      expect(callArgs.path).toContain('limit=10');
      expect(callArgs.path).toContain('type=Public');

      expect(result).toEqual({
        items: mockGames,
        total: 100,
        range: { start: 0, end: 1 },
      });
    });

    it('should throw error if start or end is missing', async () => {
      await expect(api.getGames({ start: '2023-01-01' })).rejects.toThrow(
        'Start and End timestamps are required.'
      );
    });
  });

  describe('getGameInfo', () => {
    it('should fetch game details', async () => {
      const mockGame = { id: 'game123', info: { config: {} } };
      mockApiResponse(mockGame);

      const result = await api.getGameInfo({ gameId: 'game123' });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/public/game/game123',
        }),
        expect.any(Function)
      );
      expect(result).toEqual(mockGame);
    });

    it('should handle includeTurns=false', async () => {
      const mockGame = { id: 'game123' };
      mockApiResponse(mockGame);

      await api.getGameInfo({ gameId: 'game123', includeTurns: false });

      const callArgs = https.request.mock.calls[0][0];
      expect(callArgs.path).toContain('turns=false');
    });

    it('should return BigInts when useBigInt is true', async () => {
      const hugeId = '9007199254740995';
      mockApiResponse({ info: { config: { id: hugeId } } });

      const result = await api.getGameInfo({
        gameId: 'game123',
        useBigInt: true,
      });
      // console.log(result.info.config.id);
      expect(result.info.config.id).toBe(BigInt(hugeId));
    });
  });

  describe('getPlayerInfo', () => {
    it('should fetch player profile', async () => {
      const mockPlayer = { id: 'player1', name: 'Player1' };
      mockApiResponse(mockPlayer);

      const result = await api.getPlayerInfo({ playerId: 'player1' });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/public/player/player1',
        }),
        expect.any(Function)
      );
      expect(result).toEqual(mockPlayer);
    });

    it('should return BigInts when useBigInt is true', async () => {
      const hugeId = '9007199254740995';
      mockApiResponse({ id: hugeId, name: 'Player1' });

      const result = await api.getPlayerInfo({
        playerId: 'player1',
        useBigInt: true,
      });

      expect(result.id).toBe(BigInt(hugeId));
    });
  });

  describe('getPlayerSessions', () => {
    it('should fetch player sessions', async () => {
      const mockSessions = [{ gameId: 'game1' }];
      mockApiResponse(mockSessions);

      const result = await api.getPlayerSessions({ playerId: 'player1' });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/public/player/player1/sessions',
        }),
        expect.any(Function)
      );
      expect(result).toEqual(mockSessions);
    });
  });

  describe('getClanLeaderboard', () => {
    it('should fetch leaderboard', async () => {
      const mockLeaderboard = [{ clanTag: 'ABC', score: 100 }];
      mockApiResponse(mockLeaderboard);

      const result = await api.getClanLeaderboard();

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/public/clans/leaderboard',
        }),
        expect.any(Function)
      );
      expect(result).toEqual(mockLeaderboard);
    });
  });

  describe('getClanStats', () => {
    it('should fetch clan stats with options', async () => {
      const mockStats = { clan: { clanTag: 'ABC' } };
      mockApiResponse(mockStats);

      const result = await api.getClanStats({
        clanTag: 'ABC',
        start: '2023-01-01',
      });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: expect.stringContaining('/public/clan/ABC'),
        }),
        expect.any(Function)
      );
      const callArgs = https.request.mock.calls[0][0];
      expect(callArgs.path).toContain('start=2023-01-01');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getClanSessions', () => {
    it('should fetch clan sessions', async () => {
      const mockSessions = [{ gameId: 'game1' }];
      mockApiResponse(mockSessions);

      const result = await api.getClanSessions({ clanTag: 'ABC' });

      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/public/clan/ABC/sessions',
        }),
        expect.any(Function)
      );
      expect(result).toEqual(mockSessions);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-200 status codes', async () => {
      const req = new EventEmitter();
      req.end = vi.fn();

      const res = new EventEmitter();
      res.statusCode = 404;
      res.statusMessage = 'Not Found';

      https.request.mockImplementation((options, callback) => {
        callback(res);
        res.emit('data', '{"error":"Not Found"}');
        res.emit('end');
        return req;
      });

      await expect(
        api.getPlayerInfo({ playerId: 'unknown' })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: 'Not Found',
        body: '{"error":"Not Found"}',
      });
    });

    it('should handle network errors', async () => {
      const req = new EventEmitter();
      req.end = vi.fn();

      https.request.mockImplementation(() => {
        setTimeout(() => {
          req.emit('error', new Error('Network Error'));
        }, 10);
        return req;
      });

      await expect(api.getPlayerInfo({ playerId: 'player1' })).rejects.toThrow(
        'Network Error'
      );
    });
  });
});
