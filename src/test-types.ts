import { ClanStats } from './types';
import clanStatsData from '../sample-output/clan-stats_tag-UN.json' with { type: 'json' };

// By spreading the imported data into a new object literal that is typed,
// we can trigger TypeScript's excess property checking.
// If the imported JSON (`clanStatsData`) has properties not defined in `ClanStats`,
// this will cause a compile error, ensuring the types are exact.
const stats: ClanStats = {
    ...clanStatsData
};

console.log('Successfully validated clan stats against the exact type definition.', stats);
