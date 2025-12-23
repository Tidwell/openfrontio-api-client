import api from '../dist/index.js';

// const oneDay = 24 * 60 * 60 * 1000;
// console.log(api);

// const now = new Date();
// // Subtract 24 hours (86,400,000 milliseconds)
// const start = new Date(now.getTime() - oneDay - oneDay - oneDay - oneDay).toISOString();

// const end = new Date(now  - oneDay - oneDay - oneDay).toISOString();

// const g = await api.getGames({
//   start,
//   end,
//   limit: 1000,
//   offset: 2000
// });


const g = await api.getGameInfo({
  gameId: 'Me17Rjfx',
  includeTurns: false
})

console.log(g);
