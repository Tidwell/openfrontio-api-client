# Contributing to OpenFront JS API Client

Thank you for your interest in contributing to the OpenFront JS API Client! This document outlines the development process, commands, and guidelines for working on this library.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed.

### Installation

Clone the repository and install the dependencies:

```bash
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
