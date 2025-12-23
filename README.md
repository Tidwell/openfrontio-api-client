# OpenFront JS API Client

An unofficial, robust JavaScript/TypeScript client for the [OpenFront API](https://github.com/openfrontio/OpenFrontIO/blob/main/docs/API.md).

[![npm version](https://img.shields.io/npm/v/openfrontio-api-client.svg)](https://www.npmjs.com/package/openfrontio-api-client)
[![License](https://img.shields.io/npm/l/openfrontio-api-client.svg)](LICENSE)

## Installation

```bash
npm install openfrontio-api-client
```

*[View the Docs](https://tidwell.github.io/openfrontio-api-client/)*

## Quick Usage

```js
import { getGames, getGameInfo } from "openfrontio-api-client";

const now = new Date();
const yesterday = new Date(now - 86400000).toISOString();

const games = await getGames({
  start: yesterday,
  end: now.toISOString(),
});
```

## Supported Methods

- [getClanLeaderboard](https://tidwell.github.io/openfrontio-api-client/functions/getClanLeaderboard.html)
- [getClanSessions](https://tidwell.github.io/openfrontio-api-client/functions/getClanSessions.html)
- [getClanStats](https://tidwell.github.io/openfrontio-api-client/functions/getClanStats.html)
- [getGameInfo](https://tidwell.github.io/openfrontio-api-client/functions/getGameInfo.html)
- [getGames](https://tidwell.github.io/openfrontio-api-client/functions/getGames.html)
- [getPlayerInfo](https://tidwell.github.io/openfrontio-api-client/functions/getPlayerInfo.html)
- [getPlayerSessions](https://tidwell.github.io/openfrontio-api-client/functions/getPlayerSessions.html)

## Key Features

- **Pagination Normalization**: Automatically parses and normalizes pagination headers, making it easier to traverse large datasets.
- **TypeScript Support**: Includes comprehensive type definitions that wrap the official game types, ensuring type safety and autocompletion.
- **BigInt Support**: Optional support for `BigInt` to safely handle large numeric identifiers without precision loss.

## TypeScript Integration

The library exposes TypeScript typings for all API responses. These types directly wrap the official game types, adjusting for optional properties where necessary to match the actual API behavior.

## BigInt Support

OpenFront API responses often contain large integer identifiers. By default, these are serialized as strings in JSON to prevent JavaScript number precision loss (IEEE 754).

This library offers optional BigInt support, allowing you to work with these identifiers as native `BigInt` primitives for mathematical operations or comparisons, rather than managing them as strings.

## Contributing

Contributions are welcome! Please ensure you have Node.js and npm installed before starting.

### Development Setup

Clone the repository and install the dependencies:

```bash
git clone github.com/Tidwell/openfrontio-api-client
cd openfrontio-api-client
npm install
```

## Development Scripts

The following scripts are available in `package.json` to assist with development, building, and testing.

### Building the Library

To build the package for production (transpiling TypeScript and bundling):

```bash
npm run build
```

This uses `pkgroll` to output the build artifacts to the `dist/` directory.

### Testing

This project uses Vitest for testing.

#### Unit Tests

To run the standard unit test suite:

```bash
npm test
```

#### End-to-End (E2E) Tests

To run the end-to-end tests using the specific E2E configuration:

```bash
npm run test:e2e
```

#### Updating E2E Snapshots/Responses

If the API behavior changes or you need to record new responses for the E2E tests, use the write command:

```bash
npm run test:e2e:write
```

This sets the `WRITE_API_RESPONSES` environment variable to `true` during the test run.

### Formatting

To format the codebase using Prettier:

```bash
npm run format
```

### Documentation

To generate the API documentation using TypeDoc:

```bash
npm run docs
```

## License

Distributed under the MIT License. See LICENSE.md for more information.
